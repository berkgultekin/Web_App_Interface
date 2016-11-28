angular.module('openlayers-directive').directive('olDraw', ["$log", "$q", "olMapDefaults", "olHelpers", function ($log, $q, olMapDefaults, olHelpers) {

	return {
		restrict: 'E',
		scope: {
			properties: '=olGeomProperties',
			style: '=olStyle'
		},
		require: '^openlayers',
		replace: true,
		template: '<div class="popup-label path" ng-bind-html="message"></div>',

		link: function (scope, element, attrs, controller) {
			var isDefined = olHelpers.isDefined;
			var createFeature = olHelpers.createFeature;
			var createOverlay = olHelpers.createOverlay;
			var createVectorLayer = olHelpers.createVectorLayer;
			var insertLayer = olHelpers.insertLayer;
			var removeLayer = olHelpers.removeLayer;
			var olScope = controller.getOpenlayersScope();

			olScope.getMap().then(function (map) {
				var mapDefaults = olMapDefaults.getDefaults(olScope);
				var viewProjection = mapDefaults.view.projection;

				var raster = new ol.layer.Tile({
					source: new ol.source.OSM()
				});
				var layerCollection = map.getLayers();

				insertLayer(layerCollection, layerCollection.getLength(), raster);

				scope.$on('$destroy', function () {
					removeLayer(layerCollection, layer.index);
				});
				var features = new ol.Collection();
				var featureOverlay = new ol.layer.Vector({
					source: new ol.source.Vector({features: features}),
					style: new ol.style.Style({
						fill: new ol.style.Fill({
							color: 'rgba(255, 255, 255, 0.2)'
						}),
						stroke: new ol.style.Stroke({
							color: '#ffcc33',
							width: 2
						}),
						image: new ol.style.Circle({
							radius: 7,
							fill: new ol.style.Fill({
								color: '#ffcc33'
							})
						})
					})
				});
				featureOverlay.setMap(map);
				var modify = new ol.interaction.Modify({
					features: features,
					// the SHIFT key must be pressed to delete vertices, so
					// that new vertices can be drawn at the same position
					// of existing vertices
					deleteCondition: function (event) {
						return ol.events.condition.shiftKeyOnly(event) &&
							ol.events.condition.singleClick(event);
					}
				});
				map.addInteraction(modify);
				var draw; // global so we can remove it later
				draw = new ol.interaction.Draw({
					features: features,
					type: ol.geom.GeometryType.POLYGON
				});
				map.addInteraction(draw);
			});
		}
	};
}]);

(function () {
	'use strict';

	angular.module('SearchRescueApp')
		.config(stateConfig)
		.controller('MissionController', MissionController);

	function stateConfig($stateProvider) {
		$stateProvider.state('mission', {
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
		$stateProvider.state('mission.new', {
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
		$stateProvider.state('mission.list', {
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
		$stateProvider.state('mission.plan', {
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

	}


	function MissionController($scope, MissionService, PersonService, $state, $stateParams) {

		/* init list page */
		$scope.initList = function () {
			$scope.missionList = [];
			MissionService.getMissions().then(function (response) {
				console.log(response.data);
				$scope.missionList = response.data;
			});
		}

		/* init plan page */
		$scope.initPlan = function () {

			MissionService.getMission($stateParams.missionId).then(function (response) {
				console.log(response);
				$scope.mission = response.data;
			});

			$scope.map = {
				center: {
					lat: 39.8653357,
					lon: 32.7785558,
					zoom: 16
				},
				defaults: {},
				layers: {
					bing: {
						source: {
							name: 'Bing Maps',
							type: 'BingMaps',
							key: 'Aj6XtE1Q1rIvehmjn2Rh1LR2qvMGZ-8vPS9Hn3jCeUiToM77JFnf-kFRzyMELDol',
							imagerySet: 'Aerial'
						}
					}
				}
			};

		}

		/* add new mission */
		$scope.add = function () {

			MissionService.addNewMission($scope.newMission).then(function (response) {
				if (angular.isDefined(response.data) && angular.isDefined(response.data.id)) {
					$state.go('mission.plan', {missionId: response.data.id});
				}
			});

		}

	}


})();
