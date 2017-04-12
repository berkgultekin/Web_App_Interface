app.factory('Store', function () {
    var storage = {
        'expireTimeInMinutes': 1,
        'init': function () {
            if (storage.isset("storageExpire")) {
                var storedDate = moment(storage.get('storageExpire'));
                if (storedDate > moment().add(storage.expireTimeInMinutes, "expireTimeInMinutes")) {
                    /* no problem */
                    storage.update("storageExpire", moment().add(storage.expireTimeInMinutes, "minutes"));
                } else {
                    localStorage.clear();
                    storage.update("storageExpire", moment().add(storage.expireTimeInMinutes, "minutes"));
                }
            } else {
                /* first init clear and continue */
                localStorage.clear();
                storage.update("storageExpire", moment().add(storage.expireTimeInMinutes, "minutes"));
            }
        },
        'live': function () {
            storage.update("storageExpire", moment().add(storage.expireTimeInMinutes, "minutes"));
        },
        'clear': function () {
            localStorage.clear();
        },
        'update': function (key, data) {
            if (angular.isObject(data)) {
                localStorage.setItem(key, JSON.stringify(data));
            } else {
                localStorage.setItem(key, data);
            }
        },
        'get': function (key) {
            localItem = localStorage.getItem(key);
            if (storage.isJsonString(localItem)) {
                return JSON.parse(localItem);
            } else {
                return localItem;
            }
        },
        'remove': function (key) {
            localStorage.removeItem(key);
        },
        'isJsonString': function (str) {
            try {
                JSON.parse(str);
            } catch (e) {
                return false;
            }
            return true;
        },
        'isset': function (str) {
            if (localStorage.getItem(str) != null) {
                return true;
            } else {
                return false;
            }
        }
    };
    return storage;
});

