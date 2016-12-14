angular.module('openlayers-directive').directive('olDraw', ["$log", "$q", "olMapDefaults", "olHelpers", function ($log, $q, olMapDefaults, olHelpers) {
    return {
        restrict: 'E',
        scope: {
            properties: '=olGeomProperties',
            style: '=olStyle',
            status: '@',
            onDrawEnd: '&'
        },
        require: '^openlayers',
        replace: true,
        template: '<div class="popup-label path" ng-bind-html="message"></div>',
        link: function (scope, element, attrs, controller) {
            var activeStatus = false;
            var isDefined = olHelpers.isDefined;
            var createFeature = olHelpers.createFeature;
            var createOverlay = olHelpers.createOverlay;
            var createVectorLayer = olHelpers.createVectorLayer;
            var insertLayer = olHelpers.insertLayer;
            var removeLayer = olHelpers.removeLayer;
            var olScope = controller.getOpenlayersScope();

            var features = new ol.Collection();
            var modify = new ol.interaction.Modify({
                features: features,
                deleteCondition: function (event) {
                    return ol.events.condition.shiftKeyOnly(event) &&
                        ol.events.condition.singleClick(event);
                }
            });
            var draw; // global so we can remove it later
            draw = new ol.interaction.Draw({
                condition: false,
                features: features,
                type: ol.geom.GeometryType.POLYGON
            });
            olScope.getMap().then(function (map) {
                var mapDefaults = olMapDefaults.getDefaults(olScope);
                var viewProjection = mapDefaults.view.projection;


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


                draw.on('drawend',function(event, deneme){
                    scope.onDrawEnd({data: event});

                })

                attrs.$observe('status', function(status) {
                    if(status == true || status == 'true'){
                        if(activeStatus == false){
                            map.addInteraction(modify);
                            map.addInteraction(draw);
                            activeStatus = true;
                        }
                    }else{
                        if(activeStatus == true){
                            map.removeInteraction(modify);
                            map.removeInteraction(draw);
                            activeStatus = false;
                        }
                    }
                });
            });
        }
    };
}]);
