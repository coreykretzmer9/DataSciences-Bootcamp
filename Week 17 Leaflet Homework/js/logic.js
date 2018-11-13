var url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/2.5_week.geojson";
var url_plates = "https://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_boundaries.json";


// define a function to scale the magnitdue
function markerSize(magnitude) {
    return magnitude * 5;
};


var earthquakes = new L.LayerGroup();

d3.json(url, function (geoJson) {
    L.geoJSON(geoJson.features, {
        pointToLayer: function (geoJsonPoint, latlng) {
            return L.circleMarker(latlng, { radius: markerSize(geoJsonPoint.properties.mag) });
        },

        style: function (geoJsonFeature) {
            return {
                fillColor: chooseColor(geoJsonFeature.properties.mag),
                fillOpacity: 1,
                weight: 1,
                color: chooseColor(geoJsonFeature.properties.mag)

            }
        },

        onEachFeature: function (feature, layer) {
            layer.bindPopup("<h3>" + feature.properties.place +
             "</h3><hr><p>" + new Date(feature.properties.time) + "</p>");
  }

    }).addTo(earthquakes);

});

var plateBoundary = new L.LayerGroup();


d3.json(url_plates, function (geoJson) {
    L.geoJSON(geoJson.features, {
        style: function (geoJsonFeature) {
            return {
                weight: 1,
                color: 'blue'
            }
        },
    }).addTo(plateBoundary);
})



function chooseColor(d) {
    return d < 2 ? 'lime' : 
    d < 3  ? 'yellowgreen' :
    d < 4  ? 'yellow' :
    d < 5  ? 'orange' :
    d < 6  ? 'salmon' :
              'red';
}


// define a function to create the map
function createMap() {

    var highContrastMap = L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
        maxZoom: 18,
        id: 'mapbox.high-contrast',
        accessToken: API_KEY
    });

    var streetMap = L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
        maxZoom: 18,
        id: 'mapbox.streets',
        accessToken: API_KEY
    });

    var darkMap = L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
        maxZoom: 18,
        id: 'mapbox.dark',
        accessToken: API_KEY
    });


    var satellite = L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
        maxZoom: 18,
        id: 'mapbox.satellite',
        accessToken: API_KEY
    });


    // define a baselayer object to hold our base layer objects
    var baseLayers = {
        "High Contrast": highContrastMap,
        "Street": streetMap,
        "Dark": darkMap,
        "Satellite": satellite
    };

    // define a overlay object to hold our overlay layer objects
    var overlays = {
        "Earthquakes": earthquakes,
        "Plate Boundaries": plateBoundary,
    };

    // initialize the map on the "mymap" div with a given center and zoom
    mymap = L.map("map", {
        center: [37.09, -95.71],
        zoom: 5,
        layers: [streetMap, earthquakes]
    })

    // Creates an attribution control with the given layers. 
    // Base layers will be switched with radio buttons, while overlays will be switched with checkboxes. 
    // Note that all base layers should be passed in the base layers object, but only one should be added 
    // to the map during map instantiation
    L.control.layers(baseLayers, overlays,{
        collapsed: false
    }).addTo(mymap);


    // Create the legend control
    var legend = L.control({ position: 'bottomright' });

    legend.onAdd = function (map) {

        var div = L.DomUtil.create('div', 'info legend'),
            magnitude = [0, 1, 2, 3, 4, 5],
            labels = [];

        div.innerHTML += '<h4>Magnitude</h4><hr>'
        
        for (var i = 0; i < magnitude.length; i++) {
            div.innerHTML +=
                '<i style="background:' + chooseColor(magnitude[i] + 1) + '"></i> ' +
                magnitude[i] + (magnitude[i + 1] ? '&ndash;' + magnitude[i + 1] + '<br>' : '+');
        }

        return div;
    };
    legend.addTo(mymap);
}



// define a function to create the heat map
function createHeatMap() {


    var mapHeat = L.map('mymapHeat', {
        center: [37.09, -95.71],
        zoom: 2
    });

    // add a tile layer to add to our map
    L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}@2x.png?access_token={accessToken}', {
        id: 'mapbox.dark',
        maxZoom: 18,
        accessToken: API_KEY
    }).addTo(mapHeat);

    // get data
    d3.json(url, function (geoJson) {

        // initialize an empty array to store the coordinates. This array will then then be passed to leaflet-heat.js
        var heatArray = []
        var features = geoJson.features;

        // loop through each feature
        for (var i = 0; i < features.length; i++) {
            var coords = features[i].geometry;

            // if coordinates are available to proceed
            if (coords) {
                heatArray.push([coords.coordinates[1], coords.coordinates[0]])
            }
        }
        var heat = L.heatLayer(heatArray, {
            radius: 10,
            minOpacity: 0.8
        }).addTo(mapHeat);   
    });
   
}

// call the create map function
createMap()