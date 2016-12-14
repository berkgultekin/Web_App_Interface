(function () {
    'use strict';

    angular.module('SearchRescueApp')
        .config(stateConfig)
        .controller('MissionController', MissionController);

    function stateConfig($stateProvider) {
        $stateProvider.state('content.mission', {
            url: "/mission",
            controller: 'MissionController',
            templateUrl: "views/mission/main.index.html",
            controllerAs: 'vm',
            data: {
                sideMenu: {
                    text: 'Mission',
                    styleClass: 'fa fa-heartbeat'
                }
            }
        });
        $stateProvider.state('content.mission.new', {
            url: "/new",
            controller: 'MissionController',
            templateUrl: "views/mission/new.index.html",
            controllerAs: 'vm',
            data: {
                sideMenu: {
                    text: 'Add New Mission',
                }
            }
        });
        $stateProvider.state('content.mission.list', {
            url: "/list",
            controller: 'MissionController',
            templateUrl: "views/mission/list.index.html",
            controllerAs: 'vm',
            data: {
                sideMenu: {
                    text: 'List Missions',
                }
            }
        });
        $stateProvider.state('content.mission.plan', {
            url: "/plan/:missionId",
            controller: 'MissionController',
            templateUrl: "views/mission/plan.index.html",
            data: {
                sideMenu: null,
            },
            params: {
                missionId: null
            }
        });
        $stateProvider.state('content.mission.update', {
            url: "/update/:missionId",
            controller: 'MissionController',
            templateUrl: "views/mission/update.index.html",
            controllerAs: 'vm',
            data: {
                sideMenu: null,
            },
            params: {
                missionId: null
            }
        });

    }


    function MissionController($scope, MissionService, PersonService, GPSService, $state, $stateParams, $rootScope) {

        /* init list page */
        $scope.initList = function () {
            $rootScope.showLoader();
            $scope.missionList = [];
            MissionService.getMissions().then(function (response) {
                $scope.missionList = response.data;
                $rootScope.hideLoader();
            });
        }

        /* init plan page */
        $scope.initPlan = function () {
            $rootScope.showLoader();

            $scope.getPoints($stateParams.missionId);

            MissionService.getMission($stateParams.missionId).then(function (response) {
                console.log(response);
                $scope.mission = response.data;

                if($scope.mission.persons.length > 0){
                    angular.forEach($scope.mission.persons, function(value, key){
                        $scope.teamMembers.push(value);
                    })
                }

                $rootScope.hideLoader();
            });

            $scope.teamMembers = [];
            $scope.personList = [];
            PersonService.getPeople().then(function (response) {
                console.log(response.data);
                $scope.personList = response.data;
            });

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

        /* add new mission */
        $scope.add = function () {
            $rootScope.showLoader();

            MissionService.addNewMission($scope.newMission).then(function (response) {
                if (angular.isDefined(response.data) && angular.isDefined(response.data.id)) {
                    $state.go('mission.plan', {missionId: response.data.id});
                }
                $rootScope.hideLoader();

            });

        }

        /* init update page */
        $scope.initUpdate = function () {
            $rootScope.showLoader();
            $scope.newMission ={};
            MissionService.getMission($stateParams.missionId).then(function (response) {
                console.log(response);
                $scope.newMission = response.data;
                $rootScope.hideLoader();

            });
        }

        /* update mission */
        $scope.update = function () {
            var filtered = {
                name : $scope.newMission.name,
                location : $scope.newMission.location,
                description : $scope.newMission.description,
                date_start : $scope.newMission.date_start,
                date_end : $scope.newMission.date_end
            };

            MissionService.updateMission(filtered, $scope.newMission.id).then(function (response) {
                console.log(response);
            });

        }

        /* add person to mission */
        $scope.additionofTeamMember = function (addedPerson) {
            $rootScope.showLoader();

            console.log(addedPerson);
            //return;
            $scope.teamMembers.push(addedPerson);
            MissionService.addPersontoMission($stateParams.missionId, addedPerson.id).then(function (response) {
                console.log(response);
                $rootScope.hideLoader();
            });
        }

        $scope.getPoints = function(mission_id){
            var messages = {
                6: "Secure Area",
                5: "Search Area",
            }
            GPSService.listMission(mission_id).then(function(response){
                var arrangedPolygons = {};
                var arrangedMarkers = [];



                angular.forEach(response.data, function(value, key){
                    if(value.type == 1 || value.type == 2 || value.type == 3){
                        arrangedMarkers.push({
                            lat: value.latitude,
                            lon: value.longitude,
                            style: MarkerStyles['point_'+value.type],
                            id: value.id
                        });
                    }else if(value.type == 5 || value.type == 6){ //polygon
                        if(typeof arrangedPolygons[value.group_key] == 'undefined'){
                            arrangedPolygons[value.group_key] = {
                                key: value.groupkey,
                                coords: [[]],
                                style: PolygonStyles['polygon_' + value.type],
                                message: messages[value.type]
                            };
                        }
                        arrangedPolygons[value.group_key].coords[0].push([value.latitude, value.longitude]);
                    }

                });

                angular.forEach(arrangedMarkers, function(value, key){
                    $scope.markers[value.id] = value;
                })

                $scope.polygons = arrangedPolygons;
            });
        }

    }


})();
