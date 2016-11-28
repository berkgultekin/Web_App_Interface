'use strict';
var app = angular
	.module('SearchRescueApp', [
		'ngAnimate',
		'ngCookies',
		'ngResource',
		'ngRoute',
		'ngSanitize',
		'ngTouch',
		'ngStorage',
		'ui.router',
		'statesTree',
		"openlayers-directive"
	])
	.config(function ($localStorageProvider, $urlRouterProvider) {
		$localStorageProvider.setKeyPrefix('icond-admin-');
	})
	.run(function ($rootScope, statesTree, $state) {

		var statesArray = statesTree.get();
		console.log(statesArray);

		$rootScope.sideMenuArray = [];
		/** SIDEMENU SETUP */
		angular.forEach(statesArray, function (state, idx) {
			console.log(state, idx);
			if (state.data && state.data.sideMenu) {
				var context = state.data.sideMenu;

				if (state.children) {

					context.children = [];
					angular.forEach(state.children, function (child, idx) {
						if (child.data.sideMenu != null) {
							var sideMenu = child.data.sideMenu;
							sideMenu.target = child.name;
							context.children.push(sideMenu);
						}

					});
				}
				$rootScope.sideMenuArray.push(context);
			}
		});

		console.log($rootScope.sideMenuArray);

		$state.go('init');

		$rootScope.$state = $state;
	});

app.constant('API', {
	"url": 'http://localhost:8090/myapp/'
});
