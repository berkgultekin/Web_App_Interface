(function () {
    'use strict';

    angular.module('SearchRescueApp')
        .controller('MapController', MapController);

    function MapController($scope, MissionService, PersonService, GPSService, $state, $stateParams) {

        var custom_style = {
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

        $scope.initClickListener = function(){

            $scope.$on('openlayers.map.singleclick', function(event, data) {
                if(!$scope.drawingActive){
                    return;
                }
                $scope.$apply(function() {
                    if ($scope.projection === data.projection) {
                        $scope.mouseclickposition = data.coord;
                    } else {
                        var p = ol.proj.transform([ data.coord[0], data.coord[1] ], data.projection, $scope.projection);
                        $scope.mouseclickposition = {
                            lat: p[1],
                            lon: p[0],
                            projection: $scope.projection
                        }
                    }
                    $scope.mouseclickposition.style = custom_style['point_'+$scope.activeType];
                    $scope.markers.push($scope.mouseclickposition)
                });
            });
        }

        $scope.initMap = function(){
            $scope.drawingActive = false;
            $scope.activeType = -1;
            $scope.logTypes = []
            GPSService.types().then(function(response){
                $scope.logTypes = response.data;
            });

            /* Click listener */
            $scope.initClickListener();

        }

        $scope.saveAction = function(){
            /* send to db */
            $scope.drawingActive = false;
            $scope.activeType = -1;
        }

        $scope.addPoint = function(point_type){
            if($scope.drawingActive){
                /* already active */
                alert("Please cancel or complete the active drawing process.");
            }else{
                $scope.drawingActive = true;
                $scope.activeType = point_type;
            }

        }

    }


})();
