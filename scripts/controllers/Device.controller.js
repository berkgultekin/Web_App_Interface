(function () {
    'use strict';

    angular.module('SearchRescueApp')
        .config(stateConfig)
        .controller('DeviceController', DeviceController);

    function stateConfig($stateProvider) {
        $stateProvider.state('content.device', {
            url: "/device",
            controller: 'DeviceController',
            templateUrl: "views/device/main.index.html",
            controllerAs: 'vm',
            data: {
                sideMenu: {
                    text: 'Devices',
                    styleClass: 'fa fa-fw fa-tablet'
                }
            }
        });
        $stateProvider.state('content.device.new', {
            url: "/new",
            controller: 'DeviceController',
            templateUrl: "views/device/new.index.html",
            controllerAs: 'vm',
            data: {
                sideMenu: {
                    text: 'Add New Device',
                }
            }
        });
        $stateProvider.state('content.device.list', {
            url: "/list",
            controller: 'DeviceController',
            templateUrl: "views/device/list.index.html",
            controllerAs: 'vm',
            data: {
                sideMenu: {
                    text: 'List Devices',
                }
            }
        });
    }


    function DeviceController($scope, DeviceService) {

        $scope.initList = function () {
            $scope.deviceList = [];
            DeviceService.getDevices().then(function (response) {
                console.log(response.data);
                $scope.deviceList = response.data;
            });
        };
        /* init add page */
        /* add new device */
        $scope.add = function () {

            DeviceService.addNewDevice($scope.newDevice).then(function (response) {
                console.log(response);
            });

        };
        $scope.initObject = function (type) {

            $scope.newDevice = null;
            $scope.newDevice = {};
            $scope.newDevice.type = type;

        }
    }


})();
