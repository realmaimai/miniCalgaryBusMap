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
                    'match',
                    ['get', 'route_short_name'],
                    '68',
                    'red',
                    'steelblue'
                ]
            }
        })
    })