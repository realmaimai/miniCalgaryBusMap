mapboxgl.accessToken = 'pk.eyJ1IjoieXVsZXpoIiwiYSI6ImNscmtkMmR0YjBkY2gya28yM3ZobXp2eTQifQ.7zqzJNm7ZrAJdzJNDpEt5w';


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

            map.addLayer({
                id: 'calgary-transit-position-point',
                type: 'circle',
                source: 'calgary-transit-position',
                paint: {
                    'circle-radius': 6,
                    'circle-stroke-color': '#EEEEEE',
                    'circle-stroke-width': 1,
                    'circle-color': '#223b53'
                }
            })
        }
    } catch(error) {
        console.log("update bus error:", error);
    }
}

const map = new mapboxgl.Map({
        container: 'map', // container ID
        style: 'mapbox://styles/yulezh/clrkd76ck001301pqhgku01rq/draft', // style URL
        center: [245.943951,51.044911], // starting position [lng, lat]
        zoom: 11, // starting zoom
    });

    const tb = (window.tb = new Threebox(
        map,
        map.getCanvas().getContext('webgl'),
        {
        defaultLights: true
        }
        ));

    // add source and layer
    map.on('load', () => {

        updateBus(map);

        setInterval(() => {
            updateBus(map)
        }, 30 * 1000);

        map.addSource('calgary-transit-routes', {
            type: 'geojson',
            data: 'data/calgary-transit-routes.geojson',
        })


        map.addLayer({
            id: 'calgary-transit-routes-line',
            type: 'line',
            source: 'calgary-transit-routes',
            paint: {
                // 'line-blur': 5,
                'line-color': [
                    'match', // matches some scenarios
                    ['get', 'route_short_name'], // get the value of geoJson
                    '68', // if route_short_name == 68
                    'red', // goes red 
                    'steelblue' // default is steelblue
                ]
            }
        })

        map.addLayer({
            id: 'custom-threebox-model',
            type: 'custom',
            renderingMode: '3d',
            onAdd: function () {
                const scale = 0.15;
                const options = {
                obj: 'model/Bus.glb',
                type: 'glb',
                scale: { x: scale, y: scale, z: scale },
                units: 'meters',
                rotation: { x: 90, y: -90, z: 0 }
            };
             
            tb.loadObj(options, (model) => {
                const transitData= map.getSource('calgary-transit-position')._data;
                const features = transitData.features;
                features.forEach((feature)=> {
                    const modelInstance = model.clone();
                    const position = feature.geometry.coordinates;
                    const long = position[0] 
                    const lat = position[1]
                    modelInstance.position.set(long, lat);
                    model.setRotation({ x: 0, y: 0, z: 241 });
                    tb.add(modelInstance);
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
