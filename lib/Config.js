

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

        /**
        * 使用指定文件的数据作为配置。
        */
        'use': function (file) {
            file = path.join(dir, file);
            file = file.replace(/\\/g, '/');

            var ext = path.extname(file).toLowerCase();

            if (ext == '.json') {
                defaults = File.readJSON(file);
            }
            else { // js
                defaults = _require(file);
            }

        },

        /**
        * 获取指定模块 id 的配置对象。
        */
        'get': function (id, config) {
            var data = defaults[id] || {};

            if (config) {
                data = $.Object.extendDeeply({}, data, config);
            }

            return data;
        },

        /**
        * 用指定的数据去格式整个配置对象。
        */
        'format': function (data) {

            var json = JSON.stringify(defaults);
            json = $.String.format(json, data);
            json = JSON.parse(json);


            $.Object.extendDeeply(defaults, json);

        },
    };

});



