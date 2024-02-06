import config from './config.js'
mapboxgl.accessToken = config.mapboxAccessToken;
let theme = determineTheme();

let map = new mapboxgl.Map({
        container: 'map', // container ID
        style: config.mapboxStyle, // style URL
        center: [-114.062925,51.044312], // starting position [lng, lat]
        zoom: 15.5, // starting zoom
        pitch: 45,
        maxZoom: 18,
        minZoom:11,
        maxBounds: [
            [-114.238754,50.864202], // Southwest coordinates
            [-113.796794,51.208483] // Northeast coordinates
          ]
    });

const updateBusPromise = new Promise((resolve) => {
    updateBus(map, resolve);
});

map.addControl(new mapboxgl.NavigationControl());
getWeather();

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

    updateBusPromise.then(() => {
        determineLightPreset(theme.preset);
    
        // add 3d bus model
        map.addLayer({
            id: 'bus-3d-model',
            type: 'custom',
            renderingMode: '3d',
            onAdd: function () {
                const scale = 2000;
                const options = {
                obj: 'model/red-bus.glb',
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
                    position.push(1);
                    model.setCoords(position);
                    tb.add(model);
                    });
                });
            },
                
            render: function () {
                tb.update();
            }
        })
        map.setLayerZoomRange('bus-3d-model', 14,30);

        const layers = map.getStyle().layers
        const layerList = [];
        layers.forEach(element => {
            layerList.push(element.id)
        })
        
        layerList.forEach(layerName => {
            map.on('click', layerName, function (e) {
                // Retrieve the features under the clicked location
                const features = map.queryRenderedFeatures(e.point);
                
                // If there are any features, create a popup and display the information
                if (features.length > 0) {
                    const feature = features[0]; // Get the first feature
                    if (feature.properties.route_short_name != null) {
                        // Create a popup instance
                        const popup = new mapboxgl.Popup()
                        .setLngLat(feature.geometry.coordinates)
                        .setHTML('<h3 class="popup">' + 
                        feature.properties.route_short_name + ' ' + 
                        feature.properties.route_long_name + 
                        '</h3><p class="popup">' + 
                        'Direction: ' + feature.properties.direction +  '</p>' + 
                        '</h3><p class="popup">' + 
                        'Update time: ' + feature.properties.update_time +  '</p>')
                        .addTo(map);
                    } else {
                        const popup = new mapboxgl.Popup()
                        .setLngLat(feature.geometry.coordinates)
                        .setHTML('<h3 class="popup">' + 
                        'Apologies, we are unable to retrieve the bus information due to insufficient data.' +
                        '</h3><p class="popup">')
                        .addTo(map); 
                    }
                }
                });
        })
    })
})


async function updateBus(map, resolve) {
    try {
        const busGeoJson = await logBuses();

        if (map.getSource('calgary-transit-position')) {
            map.getSource('calgary-transit-position').setData(busGeoJson);
            console.log("Updated transit-position");
        } else {
            map.addSource('calgary-transit-position', {
                type: 'geojson',
                data: busGeoJson,
            });
            console.log("Added transit-position");
        }

        if (theme.theme == "dark") {
            map.loadImage('img/gray-bus.png', (error, image) => {
                if (error) throw error;
                map.addImage('gray-bus', image);
            });
        } else {
            map.loadImage('img/red-bus.png', (error, image) => {
                if (error) throw error;
                map.addImage('red-bus', image);
            });
        }

        mapAddLayer(map, theme);

        resolve(); // resolve the promise to indicate that updateBus has finished loading
    } catch (error) {
        console.log("Update bus error:", error);
    }
}

async function logBuses() {
    const response = await fetch('https://minicalgarybusmap-production.up.railway.app:8080', {
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
    document.querySelector('.currentBuses').innerHTML = 'At present, there are ' + busGeoJson.features.length + ' buses operating in Calgary.'
    
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
                        'icon-size': 0.25
                    }
                })
                map.addLayer({
                    'id': 'calgary-transit-position-under',
                    'type': 'circle',
                    'source': 'calgary-transit-position', // reference the data source
                    'paint': {
                        'circle-radius': 6,
                        'circle-color': '#B32233',
                        'circle-stroke-width': 2,
                        'circle-stroke-color': '#fff',
                        'circle-blur': 0.2,
                    }
                })
                map.setLayerZoomRange('calgary-transit-position-point', 0,14);
                map.setLayerZoomRange('calgary-transit-position-under', 14,22);
            } else if (theme.theme == 'dark') {
                map.addLayer({
                    'id': 'calgary-transit-position-point-dark',
                    'type': 'symbol',
                    'source': 'calgary-transit-position', // reference the data source
                    'layout': {
                        'icon-image': 'gray-bus', // reference the image
                        'icon-size': 0.25
                    }
                })
                map.addLayer({
                    'id': 'calgary-transit-position-under-dark',
                    'type': 'circle',
                    'source': 'calgary-transit-position', // reference the data source
                    'paint': {
                        'circle-radius': 6,
                        'circle-color': '#E76372',
                        'circle-stroke-width': 2,
                        'circle-stroke-color': '#ffffff',
                        'circle-blur': 0.2,
                        'circle-emissive-strength': 0.8
                    }
                })
                map.setLayerZoomRange('calgary-transit-position-point-dark', 0,14);
                map.setLayerZoomRange('calgary-transit-position-under-dark', 14,22);
        }
    }

function getClock() {
    let today = new Date;
    let h =  today.getHours()
    let m= today.getMinutes();
    let s= today.getSeconds();

    h = h<10? "0" + h : h;
    m = m<10? "0" + m : m;
    s = s<10? "0" + s : s;

    document.querySelector("#hours").innerHTML = h
    document.querySelector("#mins").innerHTML = m
    document.querySelector("#secs").innerHTML = s
} let interval = setInterval(getClock,400)

async function getWeather() {
    fetch("https://api.openweathermap.org/data/2.5/weather?q=calgary&units=metric&appid=" + config.openWeatherToken)
    .then((response) => response.json())
    .then((data) => {
        const weatherData = data;

        const { description } = weatherData.weather[0];
        const { temp } = weatherData.main;
        const { speed } = weatherData.wind;

        document.querySelector("#temp").innerHTML = temp + " °C";
        document.querySelector("#desc").innerHTML = description;
        document.querySelector("#windSpeed").innerHTML = speed + " m/s";
    })
    .catch((error) => {
        console.log("Error fetching weather data:", error);
    });
}

document.querySelectorAll('.map-overlay-inner input[type="checkbox"]')
        .forEach((checkbox) => {
            checkbox.addEventListener('change', function () {
            map.setConfigProperty('basemap', this.id, checked);
            });
        });