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
		"openlayers-directive",
		'toastr',
		'angularModalService'
	])
	.config(function ($localStorageProvider, $urlRouterProvider) {
		$localStorageProvider.setKeyPrefix('icond-admin-');
	})
	.run(function ($rootScope, statesTree, $state, $http, $timeout, Store) {
		/* Loader Controls */
        $rootScope.loader = 'hidden';
        $rootScope.showLoader = function(){
            $rootScope.loader = 'shown';
        }

        $rootScope.hideLoader = function(){
			$timeout(function(){
                $rootScope.loader = 'hidden';
			}, 250);
        }


		var statesArray = statesTree.get();
		console.log(statesArray);

		$rootScope.sideMenuArray = [];
		/** SIDEMENU SETUP */
		console.log("States", statesArray);
		angular.forEach(statesArray[1].children, function (state, idx) {
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


		if(Store.isset('user')){
			$rootScope.user =Store.get('user');
			console.log($rootScope.user);
            $state.go('content.mission.list');
		}else{
            $state.go('login');
		}

		//$state.go('content.init');
		//$state.go('init');

		$rootScope.$state = $state;
	});

app.constant('API', {
	//"url": 'http://localhost:8090/myapp/',
	//"url": "http://3d1f1a8f.ngrok.io/myapp/",
	"url": "http://d328a64b.ngrok.io/myapp/"
});
app.factory('HttpResponseInterceptor', function ($q, $sce, API, Store, $rootScope, $injector) {

    var helper = {
        base64Encode: function(string){
            return btoa(string);
        }
    };

    var interceptor = {
        'request': function (config) {
            if(Store.isset("token")){
                var email = "e194190@metu.edu.tr";
                var pass = "12345678";
                config.headers['Authorization'] = "Basic "+Store.get("token");
                console.log("OF", Store.get("token"));
            }
            config.headers['Content-Type'] =  'application/json';
            return config;
        },
        'response': function (response) {
            response.isSuccess = true;
            var responseDataType = '';
            var requestURL = response.config.url.toLowerCase();
            return response;
        },
        'responseError': function (response) {
            //return $q.reject(response);
            return response;
        }
    };
    return interceptor
});

//Http Intercpetor to check auth failures for xhr requests
app.config(['$httpProvider', function ($httpProvider) {
    $httpProvider.defaults.useXDomain = true;
    delete $httpProvider.defaults.headers.common['X-Requested-With'];
    $httpProvider.defaults.headers.common['Content-Type'] = 'application/json';
    $httpProvider.defaults.headers.common = {};
    $httpProvider.defaults.headers.post = {};
    $httpProvider.defaults.headers.put = {};
    $httpProvider.defaults.headers.patch = {};
    $httpProvider.interceptors.push('HttpResponseInterceptor');
}]);

app.filter('reverse', function() {
	return function(items) {
		return items.slice().reverse();
	};
});

app.controller('ModalController', [
	'$scope', '$element', 'title', 'detail','close',
	function($scope, $element, title, detail  ,close) {
		$scope.detail = detail;
		//  This close function doesn't need to use jQuery or bootstrap, because
		//  the button has the 'data-dismiss' attribute.
		$scope.close = function() {
			close({},500); // close, but give 500ms for bootstrap to animate
		};

		//  This cancel function must use the bootstrap, 'modal' function because
		//  the doesn't have the 'data-dismiss' attribute.
		$scope.cancel = function() {

			//  Manually hide the modal.
			$element.modal('hide');

			//  Now call close, returning control to the caller.
			close({}, 500); // close, but give 500ms for bootstrap to animate
		};

	}]);