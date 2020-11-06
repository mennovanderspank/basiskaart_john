function initLayers() {
    /*
        Functie om alle lagen aan de kaart aan te maken
    */

    //  Achtergrondlaag met ESRI satelliet 
    var ESRIsatteliet = new ol.layer.Tile({
        source: new ol.source.XYZ({
            url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
            attributions: ['Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community']
        }),
        title: 'ESRI Satelliet',
        type: 'basemap'
    });
    map.addLayer(ESRIsatteliet);
    ESRIsatteliet.setVisible(false);

    //  OpenStreetMap achtergrond
    var OSMlayer = new ol.layer.Tile({
        source: new ol.source.OSM(),
        title: 'Open Streetmap',
        type: 'basemap'
    });
    map.addLayer(OSMlayer);

    // Licht grijze achetrgrondkaart van ESRI
    var Esri_WorldLightGrayCanvas = new ol.layer.Tile({
        source: new ol.source.XYZ({
            url: 'https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}',
            attributions: ['Tiles &copy; Esri &mdash; Esri, DeLorme, NAVTEQ']
        }),
        title: 'ESRI Licht grijs',
        type: 'basemap'
    });
    map.addLayer(Esri_WorldLightGrayCanvas);
    Esri_WorldLightGrayCanvas.setVisible(false);

    // Donker grijze achetrgrondkaart van ESRI
    var Esri_WorldDarkGrayCanvas = new ol.layer.Tile({
        source: new ol.source.XYZ({
            url: 'https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}',
            attributions: ['Tiles &copy; Esri &mdash; Esri, DeLorme, NAVTEQ']
        }),
        title: 'ESRI Donker grijs',
        type: 'basemap'
    });
    map.addLayer(Esri_WorldDarkGrayCanvas);
    Esri_WorldDarkGrayCanvas.setVisible(false);


    // WMS met pamden in Den Bosch
    var pandenDBsource = new ol.source.ImageWMS({
        url: 'https://gmd.has.nl/geoserver/proefstudeerdag/wms',
        params: {
            'layers': 'pandendb'
        }
    });

    var pandenDBlayer = new ol.layer.Image({
        source: pandenDBsource,
        title: 'Panden Den Bosch',
        type: 'overlay'
    });

    map.addLayer(pandenDBlayer);
    pandenDBlayer.setVisible(false);

    // Vector laag voor features
    var myFeatureSource = new ol.source.Vector();
    var myFeatureLayer = new ol.layer.Vector({
        source: myFeatureSource,
        title: 'Vector laag',
        type: 'overlay'
    });
    map.addLayer(myFeatureLayer);

    // Feature bij de HAS 
    var HASfeature = new ol.Feature(new ol.geom.Point(ol.proj.fromLonLat([5.285894, 51.686895])));
    myFeatureSource.addFeature(HASfeature);


    // var myurl = 'http://localhost:8080/geoserver/kvk/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=kvk%3Aprovincie&outputFormat=application%2Fjson';

    var postData = {
        'url': 'http://localhost:8080/geoserver/kvk/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=kvk%3Aprovincie&outputFormat=application%2Fjson'
    };

    $.ajax({
        url: 'php/geoproxycurl.php',
        dataType: 'json',
        data: postData,
        method: 'post'
    }).done(function(data) {
        myFeatureSource.addFeatures(new ol.format.GeoJSON().readFeatures(data, {
            dataProjection: 'EPSG:4326',
            featureProjection: 'EPSG:3857'
        }));
    });


}