

/**
* 词典集合工具
*/
module.exports = (function () {


    var $ = require('./MiniQuery');
    var Dictionary = require('./Dictionary');


    function DictionaryList() {

        var meta = this.meta = {
            key$dict: {}
        };
    }


    DictionaryList.prototype = { //实例方法
        constructor: DictionaryList,


        add: function (key, value) {

            var meta = this.meta;
            var key$dict = meta.key$dict;

            var dict = key$dict[key];
            if (!dict) {
                dict = key$dict[key] = new Dictionary();
            }

            if (value instanceof Array) { //批量，add('', [ ])
                return $.Array.keep(value, function (item, index) {
                    return dict.getIndex(item);
                });
            }

            return dict.getIndex(value);

        },

        replace: function (json, keys) {

            var self = this;
            $.Array.each(keys, function (key, index) {
                json[key] = self.add(key, json[key]);
            });

        },

        toObject: function () {

            var meta = this.meta;
            var key$dict = meta.key$dict;

            return $.Object.map(key$dict, function (key, dict) {
                return dict.toArray();
            });
        }
    };


    return DictionaryList;


})();



