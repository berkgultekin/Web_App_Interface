(function () {
    'use strict';

    angular.module('SearchRescueApp')
        .config(stateConfig)
        .controller('GISController', GISController);

    function stateConfig($stateProvider) {
        $stateProvider.state('mobile', {
            url: "/mobile",
            controller: 'GISController',
            controllerAs: 'vm',
            data: {}
        });

    }

    function GISController(Store, toastr) {


    }


})();
