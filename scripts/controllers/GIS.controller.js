(function () {
    'use strict';

    angular.module('SearchRescueApp')
        .config(stateConfig)
        .controller('GISController', GISController);

    function stateConfig($stateProvider) {
        $stateProvider.state('mobile', {
            url: "/mobile",
            templateUrl: "views/mobile/main.index.html",
            controller: 'GISController',
            controllerAs: 'vm',
            data: {}
        });
        $stateProvider.state('mobile.gis', {
            url: "/gis/:missionId",
            controller: 'GISController',
            controllerAs: 'vm',
            templateUrl: "views/mobile/gis.index.html",
            data: {}
        });
    }

    function GISController(Store, toastr, $scope, $state, $stateParams, $interval, MissionService, $rootScope, GPSService) {

        /* set guest token */
        Store.update('token', "ZTE5NDE5MEBtZXR1LmVkdS50cjoxMjM0NTY3OA==");
        var vm = this;
        var missionId = 0;
        $scope.teamMemberDictionary = [];
        $scope.teamMembers = [];

        $scope.initMissionData = function(){
            MissionService.getMission($stateParams.missionId).then(function (response) {
                $scope.mission = response.data;

                if ($scope.mission.persons.length > 0) {
                    angular.forEach($scope.mission.persons, function (value, key) {
                        $scope.teamMembers.push(value);
                        $scope.teamMemberDictionary[value.id] = value;

                    })
                    console.log($scope.teamMemberDictionary);
                }

                $rootScope.hideLoader();
            });
        }

        $scope.initMap = function(){

            $scope.initMissionData();
            $scope.initTrackTeamMembers();
            $scope.getPoints($stateParams.missionId);


            missionId = $stateParams.missionId;
            $scope.mission_id = missionId;
            angular.extend($scope, {
                center: {
                    lat: 39.8653357,
                    lon: 32.7785558,
                    zoom: 16
                },
                defaults: {
                    events: {
                        map: ['singleclick', 'pointermove']
                    }
                },
                mouseposition: {},
                mouseclickposition: {},
                projection: 'EPSG:4326',
                layers: {
                    bing: {
                        source: {
                            name: 'Bing Maps',
                            type: 'BingMaps',
                            key: 'Aj6XtE1Q1rIvehmjn2Rh1LR2qvMGZ-8vPS9Hn3jCeUiToM77JFnf-kFRzyMELDol',
                            imagerySet: 'Aerial'
                        }
                    }
                },
                markers: {},
                polygons: {}
            });


        }


        $scope.initTrackTeamMembers = function(){
            var activeInterval;
            var mappingInterval = $interval(function () {
                console.log("mappingInterval");
                if ($scope.teamMemberDictionary.length > 0) {
                    $interval.cancel(mappingInterval);

                    activeInterval = $interval(function () {
                        GPSService.active($stateParams.missionId).then(function (response) {
                            var tmp = response.data;
                            angular.forEach(tmp, function (val, key) {
                                val.style = {
                                    image: {
                                        icon: {
                                            anchor: [0.5, 1],
                                            anchorXUnits: 'fraction',
                                            anchorYUnits: 'fraction',
                                            opacity: 0.90,
                                            src: $scope.teamMemberDictionary[val.person_id].marker_path, //value.marker_path
                                        }
                                    }
                                };
                            });
                            $scope.activePositions = response.data;
                        });
                    }, 7500);

                }
            }, 500);

        }


        $scope.getPoints = function (mission_id) {
            var messages = {
                6: "Secure Area",
                5: "Search Area",
            }
            GPSService.listMission(mission_id).then(function (response) {
                var arrangedPolygons = {};
                var arrangedMarkers = [];

                console.log("Gelen Response:", response);


                angular.forEach(response.data, function (value, key) {
                    if (value.type == 1 || value.type == 2 || value.type == 3) {
                        arrangedMarkers.push({
                            lat: value.latitude,
                            lon: value.longitude,
                            style: MarkerStyles['point_' + value.type],
                            id: value.id
                        });
                    } else if (value.type == 5 || value.type == 6) { //polygon
                        if (typeof arrangedPolygons[value.group_key] == 'undefined') {
                            arrangedPolygons[value.group_key] = {
                                key: value.groupkey,
                                coords: [[]],
                                style: PolygonStyles['polygon_' + value.type],
                                message: messages[value.type]
                            };
                        }
                        arrangedPolygons[value.group_key].coords[0].push([value.longitude, value.latitude]);

                        console.log("Lat", value.latitude);
                    }

                });

                angular.forEach(arrangedMarkers, function (value, key) {
                    $scope.markers[value.id] = value;
                })

                $scope.polygons = arrangedPolygons;

                console.log("Gelen Response:", $scope.polygons);

            });
        }

    }


})();
