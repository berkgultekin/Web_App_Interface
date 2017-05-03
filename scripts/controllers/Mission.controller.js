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
        $stateProvider.state('content.mission.chase', {
            url: "/chase/:missionId",
            controller: 'MissionController',
            templateUrl: "views/mission/chase.index.html",
            data: {
                sideMenu: null,
            },
            params: {
                missionId: null
            }
        });

    }


    function MissionController($scope, ModalService, MediaService, MissionService, PersonService, GPSService, $state, $stateParams, $rootScope, $interval) {

        $scope.viewedLivestreamCount = 0;
        $scope.streams = [];

        /* init list page */
        $scope.initList = function () {
            $rootScope.showLoader();
            $scope.missionList = [];
            MissionService.getMissions().then(function (response) {
                $scope.missionList = response.data;
                $rootScope.hideLoader();
            });
        }

        $scope.showEventDetail = function (ev) {

            console.log(ev);
            if(ev.type == 'livestream'){
                if(confirm("Do you want to activate live stream watch?")){

                    /* start stream.html?id=tug2er455 */

                    $scope.streams.push({
                        url: 'http://sr.dev/app/stream.html?id=' + ev.data
                    });
                }
            }else{
                ModalService.showModal({
                    templateUrl: "views/modal/eventmodal.html",
                    controller: "ModalController",
                    inputs: {
                        detail: ev,
                        title: "Deneme",
                    }
                }).then(function (modal) {
                    modal.element.modal();
                    modal.close.then(function (result) {
                        $scope.yesNoResult = result ? "You said Yes" : "You said No";
                    });
                });
            }


        }

        $scope.initChase = function () {
            $scope.activePositions = [];
            $scope.initPlan();
            $scope.feed = [];
            $scope.listenMediaSince = 0;
            var activeInterval;
            var mappingInterval = $interval(function () {
                if ($scope.teamMemberDictionary.length > 0) {
                    $interval.cancel(mappingInterval);

                    activeInterval = $interval(function () {
                        GPSService.active($stateParams.missionId).then(function (response) {
                            var tmp = response.data;

                            angular.forEach(tmp, function (val, key) {
                                /* $scope.teamMemberDictionary[value.id].style*/
                                console.log($scope.teamMemberDictionary[val.person_id].marker_path, $scope.teamMemberDictionary[val.person_id]);
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

            $scope.listenMedia();

            /* Get all people's last GPSLog */
        }

        $scope.listenMedia = function () {
            $scope.isMediaListening = false;
            $scope.existingMedia = [];
            $interval(function () {
                if ($scope.isMediaListening) return false;
                var since = 0;
                $scope.isMediaListening = true;
                if (angular.isDefined($scope.listenMediaSince)) {
                    since = $scope.listenMediaSince;
                }
                MediaService.getSince(since).then(function (response) {
                    var hasNewEvent = false;
                    if (angular.isDefined(response.data)) {
                        if (angular.isDefined(response.data.media)) {
                            if (response.data.media.length > 0) {
                                angular.forEach(response.data.media, function (val, key) {
                                    console.log(val, key);
                                    if ($scope.existingMedia.indexOf(val.id) == -1) {
                                        $scope.feed.push({
                                            "path": "http://sr.dev/app/images/media/" + val.data,
                                            "type": val.type,
                                            "id": val.id,
                                            "unixtime": val.unixtime,
                                            "data": val.data
                                        });
                                        $scope.existingMedia.push(val.id);
                                        hasNewEvent = true;
                                    }
                                })

                            }
                        }
                        $scope.listenMediaSince = response.data.end;
                        $scope.isMediaListening = false;
                        if (hasNewEvent) {
                            $scope.playAudio();
                        }
                    }

                });
            }, 500);
        }

        $scope.playAudio = function () {
            $scope.playAudio = function () {
                var audio = new Audio('audio/beep.mp3');
                audio.play();
            };
        }

        /* init plan page */
        $scope.initPlan = function () {
            $rootScope.showLoader();

            $scope.getPoints($stateParams.missionId);
            $scope.teamMembers = [];
            $scope.teamMemberDictionary = [];
            $scope.personList = [];
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

            PersonService.getPeople().then(function (response) {
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
                    $state.go('content.mission.plan', {missionId: response.data.id});
                }
                $rootScope.hideLoader();

            });

        }

        /* init update page */
        $scope.initUpdate = function () {
            $rootScope.showLoader();
            $scope.newMission = {};
            MissionService.getMission($stateParams.missionId).then(function (response) {
                $scope.newMission = response.data;
                $rootScope.hideLoader();

            });
        }

        /* update mission */
        $scope.update = function () {
            var filtered = {
                name: $scope.newMission.name,
                location: $scope.newMission.location,
                description: $scope.newMission.description,
                date_start: $scope.newMission.date_start,
                date_end: $scope.newMission.date_end
            };

            MissionService.updateMission(filtered, $scope.newMission.id).then(function (response) {
                console.log(response);
            });

        }

        $scope.startMission = function () {
            $rootScope.showLoader();

            MissionService.start($stateParams.missionId).then(function (response) {
                $rootScope.hideLoader();
                $state.go('content.mission.chase', {missionId: $stateParams.missionId});
            });

        }

        /* add person to mission */
        $scope.additionofTeamMember = function (addedPerson) {
            $rootScope.showLoader();

            MissionService.addPersontoMission($stateParams.missionId, addedPerson.id).then(function (response) {
                $scope.teamMembers.push(addedPerson);
                $rootScope.hideLoader();
            });
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
