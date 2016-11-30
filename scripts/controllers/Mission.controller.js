(function () {
    'use strict';

    angular.module('SearchRescueApp')
        .config(stateConfig)
        .controller('MissionController', MissionController);

    function stateConfig($stateProvider) {
        $stateProvider.state('mission', {
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
        $stateProvider.state('mission.new', {
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
        $stateProvider.state('mission.list', {
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
        $stateProvider.state('mission.plan', {
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

    }


    function MissionController($scope, MissionService, PersonService, GPSService, $state, $stateParams) {

        /* init list page */
        $scope.initList = function () {
            $scope.missionList = [];
            MissionService.getMissions().then(function (response) {
                console.log(response.data);
                $scope.missionList = response.data;
            });
        }

        /* init plan page */
        $scope.initPlan = function () {
            MissionService.getMission($stateParams.missionId).then(function (response) {
                console.log(response);
                $scope.mission = response.data;
            });

            angular.extend($scope, {
                center: {
                    lat: 39.8653357,
                    lon: 32.7785558,
                    zoom: 16
                },
                defaults: {
                    events: {
                        map: [ 'singleclick', 'pointermove' ]
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
                markers: []
            });

        }

        /* add new mission */
        $scope.add = function () {

            MissionService.addNewMission($scope.newMission).then(function (response) {
                if (angular.isDefined(response.data) && angular.isDefined(response.data.id)) {
                    $state.go('mission.plan', {missionId: response.data.id});
                }
            });

        }

    }


})();
