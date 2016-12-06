(function () {
	'use strict';

	angular.module('SearchRescueApp')
		.config(stateConfig)
		.controller('initController', initController)
        .controller('loginController', loginController)
        .controller('ContentController', ContentController);

	function stateConfig($stateProvider) {
        $stateProvider.state('content', {
            controller: 'ContentController',
            templateUrl: "views/content.html",
            controllerAs: 'vm',
            data: {}

        });
        $stateProvider.state('content.init', {
            templateUrl: 'views/init/init.html',
            controller: 'initController',
            controllerAs: 'vm',
            data: {}
        });
        $stateProvider.state('login', {
            templateUrl: 'views/login/login.html',
            controller: 'loginController',
            controllerAs: 'vm',
            data: {}
        });
    }

	function initController() {
		var vm = this;
	}

    function loginController($scope,$rootScope) {
        var vm = this;
        $rootScope.isLogin = "login";

    }
    
    function ContentController() {
		var vm = this;
        var init = function ($scope) {
            initMenu();
        }
        init()

    }


})();
