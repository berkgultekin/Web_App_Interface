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

    function loginController($scope,$rootScope, toastr, PersonService, Store, $state) {
        var vm = this;
        $rootScope.isLogin = "login";
        $scope.loginModel = {
            email: 'e194190@metu.edu.tr',
            password: '12345678'
        }

        $scope.login = function(){

            if(!angular.isDefined($scope.loginModel)){
                toastr.error('Please fill all fields.', 'Empty Fields!');
            }else{
                var token = btoa($scope.loginModel.email + ":" + $scope.loginModel.password);
                $rootScope.showLoader();
                PersonService.login(token).then(function(response){

                    if(response.status == 401){
                        toastr.error( 'Invalid username or password', 'Invalid Credentials!');
                        $rootScope.hideLoader();
                    }else{
                        toastr.success( 'You signed in successfully and will be redirected in 2 seconds.', 'Successful!');
                        $rootScope.user = response.data;
                        Store.update('user',response.data);
                        Store.update('token',token);
                        $state.go('content.mission.list');
                    }

                });

            }
            console.log($scope.loginModel);
        }



    }
    
    function ContentController($scope, $state, Store,toastr ) {
		var vm = this;
        var init = function ($scope) {
            initMenu();
        }
        init()

        $scope.logout = function(){
            Store.clear();
            $state.go('login');
            toastr.info( 'You logged out successfully.', 'Logged out!');

        }

    }


})();
