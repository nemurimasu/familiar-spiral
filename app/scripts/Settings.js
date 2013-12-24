define(function() {
    'use strict';

    var defaults = {
        fullName: '<First Name> <Last Name>',
        firstName: '<First Name>',
        lastName: '<Last Name>',
        nickName: '<Nick Name>',
        ownerFullName: '<Owner First Name> <Owner Last Name>',
        ownerFirstName: '<Owner First Name>',
        ownerLastName: '<Owner Last Name>'
    };

    var settings = {};

    function makeAccessor(prop, value) {
        return function() {
            if (arguments.length > 0) {
                value = arguments[0];
                try {
                    window.localStorage['familiar-spiral/' + prop] = value;
                } catch(e) {
                }
            } else {
                try {
                    var val = window.localStorage['familiar-spiral/' + prop];
                    if (val !== undefined) {
                        value = val;
                    }
                } catch(e) {
                }
            }
            return value;
        };
    }

    for (var prop in defaults) {
        settings[prop] = makeAccessor(prop, defaults[prop]);
    }
    return settings;
});
