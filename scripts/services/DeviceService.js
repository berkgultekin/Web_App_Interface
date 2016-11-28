app.factory('DeviceService', function (API, $http, $filter, $rootScope) {
	var device = {

		addNewDevice: function (device) {
			return $http.post(API.url + 'device/create', device);
		},
		getDevices: function () {
			return $http.get(API.url + 'device/list');
		},
		getDevice: function (device_id) {
			return $http.get(API.url + 'device/get/' + device_id);
		}
	};

	return device;

});