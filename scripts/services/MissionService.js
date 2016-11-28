app.factory('MissionService', function (API, $http, $filter, $rootScope) {
	var mission = {
		addNewMission: function (mission) {
			return $http.post(API.url + 'mission/create', mission);
		},
		getMissions: function () {
			return $http.get(API.url + 'mission/list');
		},
        getPeople: function () {
            return $http.get(API.url + 'person/list');
        },
		getMission: function (mission_id) {
			return $http.get(API.url + 'mission/get/' + mission_id);
		}
	};

	return mission;

});