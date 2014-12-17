

/**
* 词典工具
*/
module.exports = (function () {


    var $ = require('./MiniQuery');


    function Dictionary() {

        var meta = this.meta = {
            name$id: {},
            id$name: {
                length: 0
            },
            list: []
        };
    }


    Dictionary.prototype = {
        constructor: Dictionary,

        getIndex: function (name) {

            var meta = this.meta;
            var id$name = meta.id$name;
            var name$id = meta.name$id;
            var list = meta.list;

            var id = name$id[name];
            if (id === undefined) { //不要 !id，因为 id 可能为 0

                id = list.length;
                list.push(name);

                name$id[name] = id;
                id$name[id] = name;
                id$name.length = list.length;
                
            }

            return id;

        },

        getItem: function (id) {

            var meta = this.meta;
            var id$name = meta.id$name;

            return id$name[id];
        },

        toObject: function () {
            var meta = this.meta;
            var id$name = meta.id$name;
            return id$name;
        },

        toArray: function () {
            var meta = this.meta;
            var list = meta.list;
            return list;
        }
    };


    return Dictionary;


})();



