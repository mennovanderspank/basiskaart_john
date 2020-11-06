function initMap() {
    map = new ol.Map({
        target: 'map',
        layers: [],
        view: new ol.View({
            center: ol.proj.fromLonLat([5.309017, 51.716379]),
            zoom: 10
        })
    });

    var geolocation = new ol.Geolocation({
        // take the projection to use from the map's view
        projection: map.getView().getProjection(),
        tracking: true
    });

    // listen to changes in position just 1 time
    geolocation.once('change:position', function(evt) {
        console.log(geolocation.getPosition());

        // Move and zoom the map to my location
        map.setView(new ol.View({
            center: geolocation.getPosition(),
            zoom: 15
        }));
    });

    var container = document.getElementById('popup');
    var content = document.getElementById('popup-content');
    var closer = document.getElementById('popup-closer');

    var popup = new ol.Overlay({
        element: container,
        autoPan: true,
        autoPanAnimation: {
            duration: 250,
        }
    });
    map.addOverlay(popup);

    closer.onclick = function() {
        popup.setPosition(undefined);
        closer.blur();
        return false;
    };

    map.on('click', function(evt) {
        $(".infotabel").hide();
        popup.setPosition(undefined);
        closer.blur();

        map.forEachLayerAtPixel(evt.pixel, function(layer) {
            //  console.log(layer);
            if (layer.values_.title == 'Panden Den Bosch') {
                let viewResolution = /** @type {number} */ (map.getView().getResolution());
                let featureInfoUrl = layer.values_.source.getFeatureInfoUrl(evt.coordinate,
                    viewResolution,
                    'EPSG:3857', {
                        'INFO_FORMAT': 'application/json',
                        'QUERY_LAYERS': 'pandendb'
                    });

                if (featureInfoUrl) {
                    $.ajax({
                        url: featureInfoUrl,
                        dataType: 'json'
                    }).done(function(data) {
                        if (data.features.length > 0) {
                            console.log(data.features[0].properties.bouwjaar);
                            $("#bouwjaar").text(data.features[0].properties.bouwjaar);
                            $("#gebruiksdoel").text(data.features[0].properties.gebruiksdoel);
                            $("#pandeninfo").show();
                            popup.setPosition(evt.coordinate);
                        }
                    });
                }
            } else if (layer.values_.title == 'Vector laag') {
                map.forEachFeatureAtPixel(evt.pixel, function(feature, layer2) {
                    if (feature && layer == layer2) {
                        // content.innerHTML = feature.values_.provnaam;
                        $("#provnaam").text(feature.values_.provnaam);
                        $("#omtrek").text(feature.values_.perimeter + " m");
                        $("#provinfo").show();
                        popup.setPosition(evt.coordinate);

                    } else {
                        popup.setPosition(undefined);
                        closer.blur();
                        return false;
                    }
                });

            }
        });


    });
}