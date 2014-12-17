

/**
* 配置工具类。
*/
module.exports = (function () {



    var $ = require('../lib/MiniQuery');
    var Directory = require('../lib/Directory');
    var File = require('../lib/File');
    var Log = require('../lib/Log');


    //递归扫描并转换 url 成真实的地址
    function convert(config) {

        return $.Object.map(config, function (key, value) {

            if (typeof value == 'string') {
                return Directory.format(value);
            }

            if (value instanceof Array) {
                return $.Array.keep(value, function (item, index) {

                    if (typeof item == 'string') {
                        return Directory.format(item);
                    }

                    if (typeof item == 'object') {
                        return convert(item); //递归
                    }

                    return item;

                }, true);
            }

            return value;

        }, true); //深层次来扫描

    }

    function set(name$config) {

        $.Object.each(name$config, function (name, config) {

            try {
                var module = require('./' + name);
                config = convert(config);
                module.config(config);
            }
            catch (ex) {
                Log.red(ex.message);
            }

        });
    }


    function use() {

        var json = require('../config.js');

        set(json);

        return json;
    }





    return {
        set: set,
        use: use
    };


})();



