(function () {
    'use strict';

    angular.module('SearchRescueApp')
        .controller('MapController', MapController);

    function MapController($scope, MissionService, PersonService, GPSService, $state, $stateParams, $rootScope, toastr, $timeout) {
        $scope.drawingItemNumber = 0;
        $scope.drawingList = [];
        $scope.drawingBuffer = [];

        $scope.resetBuffer = function () {
            $scope.drawingBuffer.length = 0;
        }

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
                $scope.drawingItemNumber = $scope.drawingItemNumber + 1;
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
                    $scope.mouseclickposition.item_number = $scope.drawingItemNumber;
                    $scope.markers[$scope.mouseclickposition.item_number] = $scope.mouseclickposition;

                    $scope.drawingBuffer.push({
                        type: $scope.activeType,
                        position: $scope.mouseclickposition,
                        item_number: $scope.mouseclickposition.item_number
                    });

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

        $scope.cancelAction = function () {
            $scope.drawingActive = false;
            $scope.activeType = -1;

            angular.forEach($scope.drawingBuffer, function(val, key){
                console.log("Sil, ", val);
                delete $scope.markers[val.item_number];
            })

            $scope.resetBuffer();
        }

        $scope.saveAction = function(){
            /* send to db */
            $rootScope.showLoader();


            var dataToSave = [];

            if($scope.drawingBuffer.length > 0){

                angular.forEach($scope.drawingBuffer, function(val, key){
                    dataToSave.push({
                        type: val.type,
                        latitude: val.position.lat,
                        longitude: val.position.lon,
                        mission_id: $scope.mission.id,
                        mission_person_id: 1,
                        time: '2016-11-19T20:42:55'
                    });

                });

                GPSService.createMulti(dataToSave).then(function(response){
                    if(response.status == 200){
                        toastr.success( 'You successfully added '+ response.data.length + ' element(s) to mission.', 'Successfully added!');
                        $timeout(function() {
                            $scope.resetBuffer();
                            $scope.drawingActive = false;
                            $scope.activeType = -1;
                        }, 100);
                    }else{
                        toastr.danger( 'Please try again.', 'Network Request Error!');
                    }
                    $rootScope.hideLoader();
                })
            }else{
                $rootScope.hideLoader();
            }
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
