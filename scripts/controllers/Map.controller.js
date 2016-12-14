(function () {
    'use strict';

    angular.module('SearchRescueApp')
        .controller('MapController', MapController);

    function MapController($scope, MissionService, PersonService, GPSService, $state, $stateParams, $rootScope, toastr, $timeout) {
        $scope.denebakalim = PolygonStyles.polygon_5;

        $scope.drawingItemNumber = 100000;
        $scope.polyDrawActive = false;
        $scope.drawingList = [];
        $scope.drawingBuffer = [];
        $scope.polygonBuffer = [];
        $scope.drawLayers = [];

        $scope.resetBuffer = function () {
            $scope.drawingBuffer.length = 0;
            $scope.polygonBuffer.length = 0;
        }

        $scope.initClickListener = function () {

            $scope.$on('openlayers.map.singleclick', function (event, data) {
                $scope.drawingItemNumber = $scope.drawingItemNumber + 1;
                if (!$scope.drawingActive) {
                    return;
                }
                if ($scope.polyDrawActive) {
                    return;
                }
                $scope.$apply(function () {
                    if ($scope.projection === data.projection) {
                        $scope.mouseclickposition = data.coord;
                    } else {
                        var p = ol.proj.transform([data.coord[0], data.coord[1]], data.projection, $scope.projection);
                        $scope.mouseclickposition = {
                            lat: p[1],
                            lon: p[0],
                            projection: $scope.projection
                        }
                    }
                    $scope.mouseclickposition.style = MarkerStyles['point_' + $scope.activeType];
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

        $scope.initMap = function () {
            $scope.drawingActive = false;
            $scope.activeType = -1;
            $scope.logTypes = []
            GPSService.types().then(function (response) {
                $scope.logTypes = response.data;
            });

            /* Click listener */
            $scope.initClickListener();

        }

        $scope.cancelAction = function () {
            $scope.drawingActive = false;
            $scope.activeType = -1;
            $scope.polyDrawActive = false;
            angular.forEach($scope.drawingBuffer, function (val, key) {
                delete $scope.markers[val.item_number];
            })
            $scope.resetBuffer();
        }

        $scope.saveAction = function () {
            /* send to db */
            $rootScope.showLoader();
            var dataToSave = [];
            if($scope.polygonBuffer.length > 0){
                
                angular.forEach($scope.polygonBuffer, function (value, key) {
                    GPSService.createMulti(value.coordinates).then(function (response) {
                        if (response.status == 200) {
                            toastr.success('You successfully added new area to mission.', 'Successfully added!');
                        } else {
                            toastr.danger('Please try again.', 'Network Request Error!');
                        }
                        $rootScope.hideLoader();
                    })
                })
                

            }
            else if ($scope.drawingBuffer.length > 0) {
                angular.forEach($scope.drawingBuffer, function (val, key) {
                    dataToSave.push({
                        type: val.type,
                        latitude: val.position.lat,
                        longitude: val.position.lon,
                        mission_id: $scope.mission.id,
                        mission_person_id: 8,//1,
                        time: '2016-11-19T20:42:55'
                    });
                });

                GPSService.createMulti(dataToSave).then(function (response) {
                    if (response.status == 200) {
                        toastr.success('You successfully added ' + response.data.length + ' element(s) to mission.', 'Successfully added!');
                        $timeout(function () {
                            $scope.resetBuffer();
                            $scope.drawingActive = false;
                            $scope.polyDrawActive = false;
                            $scope.activeType = -1;
                        }, 100);
                    } else {
                        toastr.danger('Please try again.', 'Network Request Error!');
                    }
                    $rootScope.hideLoader();
                })
            } else {
                $rootScope.hideLoader();
            }
        }

        $scope.addPoint = function (point_type) {
            if ($scope.drawingActive) {
                /* already active */
                toastr.danger("Please cancel or complete the active drawing process.");
            } else {
                $scope.drawingActive = true;
                $scope.activeType = point_type;
            }

        }

        $scope.drawPolygon = function (polygon_type) {

            if ($scope.drawingActive) {
                /* already active */
                toastr.danger("Please cancel or complete the active drawing process.");
            } else {
                $scope.drawLayers.push(1);
                $scope.drawingActive = true;
                $scope.activeType = polygon_type;
                $scope.polyDrawActive = true;
            }
        }

        $scope.drawend = function (data) {
            var all_coordinates = data.feature.getGeometry().getCoordinates();
            var coordinates = all_coordinates[0];

            var polygon = {
                shape_type: "polygon",
                type: $scope.activeType,
                coordinates: []
            };
            angular.forEach(coordinates, function (value, key) {
                var latlon = ol.proj.transform(value, 'EPSG:3857', 'EPSG:4326')
                console.log(latlon);
                polygon.coordinates.push({
                    latitude: latlon[0],
                    longitude: latlon[1],
                    type: $scope.activeType,
                    mission_id: $scope.mission.id,
                    mission_person_id: 8,//1,
                    time: '2016-11-19T20:42:55'
                });

            })
            $scope.polygonBuffer.push(polygon);
        }

    }


})();
