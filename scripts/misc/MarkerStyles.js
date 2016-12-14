var MarkerStyles = {
    point_1: {
        image: {
            icon: {
                anchor: [0.5, 1],
                anchorXUnits: 'fraction',
                anchorYUnits: 'fraction',
                opacity: 0.90,
                src: 'images/markers/triangle-down.png'
            }
        }
    },
    point_2: {
        image: {
            icon: {
                anchor: [0.5, 1],
                anchorXUnits: 'fraction',
                anchorYUnits: 'fraction',
                opacity: 0.90,
                src: 'images/markers/last_seen.png'
            }
        }
    },
    point_3: {
        image: {
            icon: {
                anchor: [0.5, 1],
                anchorXUnits: 'fraction',
                anchorYUnits: 'fraction',
                opacity: 0.90,
                src: 'images/markers/meeting.png'
            }
        }
    }
};

var PolygonStyles = {
    polygon_5: new ol.style.Style({
        fill: new ol.style.Fill({
            color: 'rgba(255, 204, 51, 0.15)'
        }),
        stroke: new ol.style.Stroke({
            color: '#ffcc33',
            width: 2
        }),
        image: new ol.style.Circle({
            radius: 7,
            fill: new ol.style.Fill({
                color: '#ffcc33'
            })
        })
    }),
    polygon_6: new ol.style.Style({
        fill: new ol.style.Fill({
            color: 'rgba(71, 137, 255, 0.15)'
        }),
        stroke: new ol.style.Stroke({
            color: '#4789ff',
            width: 2
        }),
        image: new ol.style.Circle({
            radius: 7,
            fill: new ol.style.Fill({
                color: '#4789ff'
            })
        })
    })
}