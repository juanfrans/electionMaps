mapboxgl.accessToken = 'pk.eyJ1IjoiamZzMjExOCIsImEiOiJjazJvdXZ2MnkxN2owM2Rwbm1wNWVpYXptIn0.pT-GXNoNxB7l1SMBh2Yjxg';
var map = new mapboxgl.Map({
    container: 'graduatedCircleMap',
    style: 'mapbox://styles/jfs2118/ck2oxs9g115241bpyccyaiq4o',
    zoom: 3,
    maxZoom: 9,
    minZoom: 3.5,
    center: [-99, 38],
    maxBounds: [[-180, 15], [-30, 72]]
});

map.on('load', function(){
    var layers = map.getStyle().layers;
    var firstSymbolId;
    for (var i = 0; i < layers.length; i++) {
        if (layers[i].type === 'symbol') {
            firstSymbolId = layers[i].id;
            break;
        }
    }
    map.addLayer({
        'id': 'us_counties_centroids',
        'type': 'circle',
        'source': {
            'type': 'geojson',
            'data': 'data/CountyCentroidElectionData.geojson'
        },
        'paint': {
            'circle-radius':
                ['interpolate', ['linear'], ['zoom'],
                    3, ['max', ['/', ['sqrt', ['abs', ['-', ['get', 'Trump'], ['get', 'Clinton']]]], 35], 1],
                    9, ['max', ['/', ['sqrt', ['abs', ['-', ['get', 'Trump'], ['get', 'Clinton']]]], 15], 5],
                ],
            'circle-color': [
                'match', ['get', 'Winner'],
                'Trump', '#cf635d',
                'Clinton', '#6193c7',
                'Other', '#91b66e',
                '#ffffff'
            ],
            'circle-stroke-color': '#ffffff',
            'circle-stroke-width': 0.5,
            'circle-opacity': [
                'step', ['get', 'WnrPerc'],
                0.3, 0.4,
                0.5, 0.5,
                0.7, 0.6,
                0.9
            ]
        },
        'minzoom': 3
    }, firstSymbolId);
    map.addLayer({
        'id': 'us_states_elections_outline',
        'type': 'line',
        'source': {
            'type': 'geojson',
            'data': 'data/StateElectionData.geojson'
        },
        'paint': {
            'line-color': '#ffffff',
            'line-width': ['interpolate', ['exponential', 2], ['zoom'], 3, 0.5, 7, 3]
        }
    }, 'us_counties_centroids');
    map.addLayer({
        'id': 'us_counties_elections_outline',
        'type': 'line',
        'source': {
            'type': 'geojson',
            'data': 'data/CountyElectionData.geojson'
        },
        'paint': {
            'line-color': '#ffffff',
            'line-width': ['interpolate', ['exponential', 2], ['zoom'], 6, 0.5, 9, 1]
        },
        'minzoom': 6
    }, 'us_counties_centroids');
});

// Create the popup
map.on('click', 'us_counties_centroids', function (e) {
    var stateName = e.features[0].properties.State;
    var countyName = e.features[0].properties.NAMELSAD;
    var winner = e.features[0].properties.Winner;
    var wnrPerc = e.features[0].properties.WnrPerc;
    var totalVotes = e.features[0].properties.Total;
    wnrPerc = (wnrPerc * 100).toFixed(0);
    totalVotes = totalVotes.toLocaleString();
    stateName = stateName.toUpperCase();
    countyName = countyName.toUpperCase();
    new mapboxgl.Popup()
        .setLngLat(e.lngLat)
        .setHTML('<h4>' + countyName + ' - ' + stateName + '</h4>'
            + '<h2>' + winner + '</h2>'
            + '<p>' + wnrPerc + '% - (' + totalVotes + ' votes)</p>')
        .addTo(map);
});
map.on('mouseenter', 'us_counties_centroids', function () {
    map.getCanvas().style.cursor = 'pointer';
});
map.on('mouseleave', 'us_counties_centroids', function () {
    map.getCanvas().style.cursor = '';
});