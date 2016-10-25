

var path = require('path');
var _require = require;

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
            file = path.join(dir, file);
            file = file.replace(/\\/g, '/');

            var ext = path.extname(file).toLowerCase();

            if (ext == '.json') {
                defaults = File.readJSON(file);
            }
            else { //js
                defaults = _require(file);
            }
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



