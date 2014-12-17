

/**
* �ʵ伯�Ϲ���
*/
module.exports = (function () {


    var $ = require('./MiniQuery');
    var Dictionary = require('./Dictionary');


    function DictionaryList() {

        var meta = this.meta = {
            key$dict: {}
        };
    }


    DictionaryList.prototype = { //ʵ������
        constructor: DictionaryList,


        add: function (key, value) {

            var meta = this.meta;
            var key$dict = meta.key$dict;

            var dict = key$dict[key];
            if (!dict) {
                dict = key$dict[key] = new Dictionary();
            }

            if (value instanceof Array) { //������add('', [ ])
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



