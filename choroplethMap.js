mapboxgl.accessToken = 'pk.eyJ1IjoiamZzMjExOCIsImEiOiJjazJvdXZ2MnkxN2owM2Rwbm1wNWVpYXptIn0.pT-GXNoNxB7l1SMBh2Yjxg';
var choroplethMap = new mapboxgl.Map({
    container: 'choroplethMap',
    style: 'mapbox://styles/jfs2118/ck2oxs9g115241bpyccyaiq4o',
    zoom: 3,
    maxZoom: 9,
    minZoom: 3.5,
    center: [-99, 38],
    maxBounds: [[-180, 15], [-30, 72]]
});

choroplethMap.on('load', function () {
    var layers = choroplethMap.getStyle().layers;
    var firstSymbolId;
    for (var i = 0; i < layers.length; i++) {
        if (layers[i].type === 'symbol') {
            firstSymbolId = layers[i].id;
            break;
        }
    }

    choroplethMap.addLayer({
        'id': 'us_states_elections',
        'type': 'fill',
        'source': {
            'type': 'geojson',
            'data': 'data/StateElectionData.geojson'
        },
        'paint': {
            'fill-color': [
                'match', ['get', 'Winner'],
                'Trump', '#cf635d',
                'Clinton', '#6193c7',
                'Other', '#91b66e',
                '#ffffff'
            ],
            'fill-outline-color': '#000000',
            'fill-opacity': [
                'step', ['get', 'WnrPerc'],
                0.3, 0.4,
                0.5, 0.5,
                0.7, 0.6,
                0.9
            ]
        },
        'maxzoom': 6
    }, firstSymbolId);
    choroplethMap.addLayer({
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
    }, firstSymbolId);
    choroplethMap.addLayer({
        'id': 'us_counties_elections',
        'type': 'fill',
        'source': {
            'type': 'geojson',
            'data': 'data/CountyElectionData.geojson'
        },
        'paint': {
            'fill-color': [
                'match', ['get', 'Winner'],
                'Trump', '#cf635d',
                'Clinton', '#6193c7',
                'Other', '#91b66e',
                '#ffffff'
            ],
            'fill-outline-color': '#000000',
            'fill-opacity': [
                'step', ['get', 'WnrPerc'],
                0.3, 0.4,
                0.5, 0.5,
                0.7, 0.6,
                0.9
            ]
        },
        'minzoom': 6
    }, 'us_states_elections');
    choroplethMap.addLayer({
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
    }, 'us_states_elections');
});

// Create the popup
choroplethMap.on('click', 'us_states_elections', function (e) {
    var stateName = e.features[0].properties.NAME;
    var winner = e.features[0].properties.Winner;
    var wnrPerc = e.features[0].properties.WnrPerc;
    var totalVotes = e.features[0].properties.Total;
    wnrPerc = (wnrPerc * 100).toFixed(0);
    totalVotes = totalVotes.toLocaleString();
    stateName = stateName.toUpperCase();
    new mapboxgl.Popup()
        .setLngLat(e.lngLat)
        .setHTML('<h4>' + stateName + '</h4>'
            + '<h2>' + winner + '</h2>'
            + '<p>' + wnrPerc + '% - (' + totalVotes + ' votes)</p>')
        .addTo(choroplethMap);
});
// Change the cursor to a pointer when the mouse is over the us_states_elections layer.
choroplethMap.on('mouseenter', 'us_states_elections', function () {
    choroplethMap.getCanvas().style.cursor = 'pointer';
});
// Change it back to a pointer when it leaves.
choroplethMap.on('mouseleave', 'us_states_elections', function () {
    choroplethMap.getCanvas().style.cursor = '';
});

choroplethMap.on('click', 'us_counties_elections', function (e) {
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
        .addTo(choroplethMap);
});
choroplethMap.on('mouseenter', 'us_counties_elections', function () {
    choroplethMap.getCanvas().style.cursor = 'pointer';
});
choroplethMap.on('mouseleave', 'us_counties_elections', function () {
    choroplethMap.getCanvas().style.cursor = '';
});
