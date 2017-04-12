app.factory('MediaService', function (API, $http, $filter, $rootScope) {
    var media = {
        getSince: function (since) {
            return $http.get(API.url + 'media/list?since=' + since);
        },

    };

    return media;

});