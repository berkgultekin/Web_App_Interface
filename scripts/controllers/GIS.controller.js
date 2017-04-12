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
            url: "/gis",
            controller: 'GISController',
            controllerAs: 'vm',
            templateUrl: "views/mobile/gis.index.html",
            data: {}
        });
    }

    function GISController(Store, toastr, $scope) {
        var vm = this;
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


})();
