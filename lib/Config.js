

var path = require('path');


/**
* 配置工具类。
*/
define('Config', function (require, module, exports) {

    var $ = require('$');
    var Directory = require('Directory');
    var File = require('File');

    var defaults = {};
    var dir = Directory.root();

    return {
        'use': function (file) {
            file = path.join(dir, file)
            defaults = File.readJSON(file);
        },

        'get': function (id, config) {
            var data = defaults[id] || {};

            if (config) {
                data = $.Object.extendDeeply({}, data, config);
            }

            return data;
        },
    };

});



