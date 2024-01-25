mapboxgl.accessToken = 'pk.eyJ1IjoieXVsZXpoIiwiYSI6ImNscmtkMmR0YjBkY2gya28yM3ZobXp2eTQifQ.7zqzJNm7ZrAJdzJNDpEt5w';

const theme = determineTheme();

async function updateBus(map) {
    try {
        const busGeoJson = await logBuses();
        
        if (map.getSource('calgary-transit-position')) {
            map.getSource('calgary-transit-position').setData(busGeoJson);
        } else {
            map.addSource('calgary-transit-position', {
                type: 'geojson',
                // data: 'data/bus.geojson',
                data: busGeoJson,
            }) 
        }

        map.loadImage('static/red-bus.png', (error, image) => {
            if (error) throw error;
            map.addImage('red-bus', image);
            });

        map.loadImage('static/gray-bus.png', (error, image) => {
            if (error) throw error;
            map.addImage('gray-bus', image);
            });

        mapAddLayer(map, theme)
        
    } catch(error) {
        console.log("update bus error:", error);
    }
}

const map = new mapboxgl.Map({
        container: 'map', // container ID
        style: 'mapbox://styles/yulezh/clrkd76ck001301pqhgku01rq/draft', // style URL
        center: [-114.062925,51.044312], // starting position [lng, lat]
        zoom: 15.5, // starting zoom
        pitch: 45,
    });


    updateBus(map);
    
    // create threebox instance
    const tb = (window.tb = new Threebox(
        map,
        map.getCanvas().getContext('webgl'),
        {
        defaultLights: true
        }
        ));

    // load map
    map.on('load', () => {


        determineLightPreset(theme.preset);

        // add 3d bus model
        map.addLayer({
            id: 'custom-threebox-model',
            type: 'custom',
            renderingMode: '3d',
            onAdd: function () {
                const scale = 0.2;
                const options = {
                obj: 'static/model/Bus.glb',
                type: 'glb',
                scale: { x: scale, y: scale, z: scale },
                units: 'meters',
                rotation: { x: 90, y: -90, z: 0 },
                anchor: 'center'
            };
             
            const transitData= map.getSource('calgary-transit-position');
            const features = transitData._data.features;
            features.forEach((feature)=> {
                tb.loadObj(options, (model) => {
                    const position = feature.geometry.coordinates;
                    position.push(-1)
                    model.setCoords(position);
                    tb.add(model);
                    });
                });
            },
             
            render: function () {
                tb.update();
            }
        })

    })



async function logBuses() {
    const response = await fetch('http://localhost:8080', {
        method: "POST",
        headers: {
            "content-type": 'application/json'
        },
    })

    const responseData = await response.json();
    if (responseData.code != 1) {
        console.log("not getting any data from server")
    }

    const busGeoJson = responseData.data;
    return busGeoJson;
}

function determineTheme() {
    const currentTime = new Date();
    const currentHour = currentTime.getHours();
    let theme = {};
    switch (true) {
        case (currentHour < 5 || currentHour >= 21):
            theme = {
                'theme': 'dark',
                'preset': 'night'
            }
            return theme;
        case (currentHour < 8 && currentHour >= 5):
            theme = {
                'theme': 'dark',
                'preset': 'dawn'
            }
            return theme;
        case (currentHour < 16 && currentHour >=  8):
            theme = {
                'theme': 'light',
                'preset': 'day'
            }
            return theme;
        case (currentHour < 21 && currentHour >= 16):
            theme = {
                'theme': 'light',
                'preset': 'day'
            }
            return theme;
    }
}

function determineLightPreset(preset) {
    switch (true) {
        case (preset== 'night'):
          map.setConfigProperty('basemap', 'lightPreset', 'night');
          break;
        case (preset== 'dawn'):
          map.setConfigProperty('basemap', 'lightPreset', 'dawn');
          break;
        case (preset == 'day'):
          map.setConfigProperty('basemap', 'lightPreset', 'day');
          break;
        case (preset == 'dusk'):
          map.setConfigProperty('basemap', 'lightPreset', 'dusk');
          break;
      }
}

function mapAddLayer(map, theme) {
            if (theme.theme == 'light') {
                map.addLayer({
                    'id': 'calgary-transit-position-point',
                    'type': 'symbol',
                    'source': 'calgary-transit-position', // reference the data source
                    'layout': {
                        'icon-image': 'red-bus', // reference the image
                        'icon-size': 0.5
                    }
                })
            } else {
                map.addLayer({
                    'id': 'calgary-transit-position-point',
                    'type': 'symbol',
                    'source': 'calgary-transit-position', // reference the data source
                    'layout': {
                        'icon-image': 'gray-bus', // reference the image
                        'icon-size': 0.25
                    }
            })
        }
    }
function determineWeather(){
    return
}
