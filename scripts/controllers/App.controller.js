(function () {
    'use strict';

    angular.module('SearchRescueApp')
        .config(stateConfig)
        .controller('AppController', AppController);

    function stateConfig($stateProvider) {
        $stateProvider.state('content.dashboard', {
            url: "/dashboard",
            controller: 'AppController',
            controllerAs: 'vm',
            templateUrl: "views/dashboard/dashboard.index.html",
            data: {
                sideMenu: {
                    text: 'Dashboard',
                    styleClass: 'fa fa-home'
                }
            }
        });
    }

    function AppController(Store, toastr) {


    }


})();
