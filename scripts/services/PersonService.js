app.factory('PersonService', function (API, $http, $filter, $rootScope) {
    var person = {
        addNewPerson: function (person) {
            return $http.post(API.url + 'person/create', person);
        },
        getPeople: function () {
            return $http.get(API.url + 'person/list');
        },
        getPerson: function (person_id) {
            return $http.get(API.url + 'person/get/' + person_id);
        },
        deletePerson: function (person_id) {
            return $http.delete(API.url + 'person/delete/' + person_id);
        },
        updatePerson: function (person, person_id) {
            return $http.put(API.url + 'person/update/' + person_id, person);
        },
        login: function (token) {
            return $http.get(API.url + 'person/login', {
                headers: {'Authorization': 'Basic ' + token}
            });
        }
    };

    return person;

});