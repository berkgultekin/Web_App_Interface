app.factory('GPSService', function (API, $http, $filter, $rootScope) {
    var gps = {
        list: function () {
            return $http.get(API.url + 'gpslog/list');
        },
        listMission: function (mission_id) {
            return $http.get(API.url + 'gpslog/list/' + mission_id);
        },
        add: function (gpsLog) {
            return $http.post(API.url + 'gpslog/create', gpsLog);
        },
        get: function (mission_id) {
            return $http.get(API.url + 'gpslog/' + mission_id);
        },
        delete: function (mission_id) {
            return $http.delete(API.url + 'gpslog/delete/' + mission_id);
        },
        update: function (mission_id) {
            return $http.put(API.url + 'gpslog/update/' + mission_id);
        },
        createMulti: function (gpsLogs) {
            return $http.post(API.url + 'gpslog/create-multi/', gpsLogs);
        },
        getGroup: function (group_key) {
            return $http.get(API.url + 'gpslog/get-group/' + group_key);
        },
        getLogsByType: function (mission_id, type_id) {
            return $http.get(API.url + 'gpslog/list/' + mission_id + '/' + type_id);
        },
        types: function () {
            return $http.get(API.url + 'gpslog/types');
        }
    };
    return gps;
});