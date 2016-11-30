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
		},
        updateMission: function (mission, mission_id) {
            return $http.put(API.url + 'mission/update/' + mission_id, mission);
        },
        addPersontoMission: function (mission_id, person_id) {
            return $http.post(API.url + 'mission/add-person?mission-id=' + mission_id + "&person-id=" + person_id);
        }
	};

	return mission;

});