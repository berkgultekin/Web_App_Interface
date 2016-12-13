(function () {
    'use strict';

    angular.module('SearchRescueApp')
        .config(stateConfig)
        .controller('PersonController', PersonController);

    function stateConfig($stateProvider) {
        $stateProvider.state('content.person', {
            url: "/person",
            controller: 'PersonController',
            templateUrl: "views/person/main.index.html",
            controllerAs: 'vm',
            data: {
                sideMenu: {
                    text: 'People',
                    styleClass: 'fa fa-users'
                }
            }
        });
        $stateProvider.state('content.person.new', {
            url: "/new",
            controller: 'PersonController',
            templateUrl: "views/person/new.index.html",
            controllerAs: 'vm',
            data: {
                sideMenu: {
                    text: 'Add New Person',
                }
            }
        });
        $stateProvider.state('content.person.list', {
            url: "/list",
            controller: 'PersonController',
            templateUrl: "views/person/list.index.html",
            controllerAs: 'vm',
            data: {
                sideMenu: {
                    text: 'List People',
                }
            }
        });

        $stateProvider.state('content.person.update', {
            url: "/update/:personId",
            controller: 'PersonController',
            templateUrl: "views/person/update.index.html",
            controllerAs: 'vm',
            data: {
                sideMenu: null,
            },
            params: {
                missionId: null
            }
        });
    }


    function PersonController($scope, PersonService, $stateParams, $rootScope) {
		/* init add page */
        $scope.initList = function () {
            $scope.personList = [];
            $rootScope.showLoader();
            PersonService.getPeople().then(function (response) {
                console.log(response.data);
                $scope.personList = response.data;
                $rootScope.hideLoader();
            });
        }
		/* init update page */
        $scope.initUpdate = function () {
            $scope.newPerson ={};
            PersonService.getPerson($stateParams.personId).then(function (response) {
                console.log(response);
                $scope.newPerson = response.data;
            });
        }

		/* add new person */
        $scope.add = function () {
            $rootScope.showLoader();
            PersonService.addNewPerson($scope.newPerson).then(function (response) {
                console.log(response);
                $rootScope.hideLoader();
            });

        }

		/* update person */
        $scope.update = function () {
            var filtered = {
                name : $scope.newPerson.name,
                surname : $scope.newPerson.surname,
                blood_group : $scope.newPerson.blood_group
            };

            PersonService.updatePerson(filtered, $scope.newPerson.id).then(function (response) {
                console.log(response);
            });

        }


    }


})();
