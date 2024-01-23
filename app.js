mapboxgl.accessToken = 'pk.eyJ1IjoieXVsZXpoIiwiYSI6ImNscmtkMmR0YjBkY2gya28yM3ZobXp2eTQifQ.7zqzJNm7ZrAJdzJNDpEt5w';
const map = new mapboxgl.Map({
        container: 'map', // container ID
        style: 'mapbox://styles/yulezh/clrkd76ck001301pqhgku01rq/draft', // style URL
        center: [245.943951,51.044911], // starting position [lng, lat]
        zoom: 11, // starting zoom
    });

    // add source and layer
    map.on('load', () => {

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

        map.on('click', (e) => {
            const features = map.queryRenderedFeatures(e.point, {
                layers: ['calgary-transit-routes-line']
            });

            console.log(features);
        })
    })


    // fetch("http://localhost:8080/", {
    //     method: "POST",
    // })
    // .then(response => console.log(response))
    // .catch(error =>console.error(error));

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

    const payload = JSON.parse(responseData.data);
    // TODO: convert unix timestamp to date time
    const payloadUpdateTimestamp = payload.header.timestamp;
    const busesInfo = payload.entity;

    console.log(busesInfo);
}

function getBusPosition() {

}

function getBusTrip() {

}

function getBusId() {
    
}


logBuses();