angular.module('openlayers-directive').directive('olDraw', ["$log", "$q", "olMapDefaults", "olHelpers", function ($log, $q, olMapDefaults, olHelpers) {
    return {
        restrict: 'E',
        scope: {
            properties: '=olGeomProperties',
            style: '=olStyle'
        },
        require: '^openlayers',
        replace: true,
        template: '<div class="popup-label path" ng-bind-html="message"></div>',

        link: function (scope, element, attrs, controller) {
            var isDefined = olHelpers.isDefined;
            var createFeature = olHelpers.createFeature;
            var createOverlay = olHelpers.createOverlay;
            var createVectorLayer = olHelpers.createVectorLayer;
            var insertLayer = olHelpers.insertLayer;
            var removeLayer = olHelpers.removeLayer;
            var olScope = controller.getOpenlayersScope();

            olScope.getMap().then(function (map) {
                var mapDefaults = olMapDefaults.getDefaults(olScope);
                var viewProjection = mapDefaults.view.projection;

                var raster = new ol.layer.Tile({
                    source: new ol.source.OSM()
                });
                var layerCollection = map.getLayers();

                insertLayer(layerCollection, layerCollection.getLength(), raster);

                scope.$on('$destroy', function () {
                    removeLayer(layerCollection, layer.index);
                });
                var features = new ol.Collection();
                var featureOverlay = new ol.layer.Vector({
                    source: new ol.source.Vector({features: features}),
                    style: new ol.style.Style({
                        fill: new ol.style.Fill({
                            color: 'rgba(255, 255, 255, 0.2)'
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
                    })
                });
                featureOverlay.setMap(map);
                var modify = new ol.interaction.Modify({
                    features: features,
                    // the SHIFT key must be pressed to delete vertices, so
                    // that new vertices can be drawn at the same position
                    // of existing vertices
                    deleteCondition: function (event) {
                        return ol.events.condition.shiftKeyOnly(event) &&
                            ol.events.condition.singleClick(event);
                    }
                });
                map.addInteraction(modify);
                var draw; // global so we can remove it later
                draw = new ol.interaction.Draw({
                    features: features,
                    type: ol.geom.GeometryType.POLYGON
                });
                map.addInteraction(draw);
            });
        }
    };
}]);
