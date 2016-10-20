
/**
* 用户收藏的摄影师。
*/
define('/FavUsers', function (require, module, exports) {

    var $ = require('$');

    var Url = $.require('Url');

    var Directory = require('Directory');
    var File = require('File');
    var Config = require('Config');
    var API = require('API');

    var Emitter = $.require('Emitter');
    var Parser = module.require('Parser');

    /**
    * 构造器。
    */
    function FavUsers(config) {

        config = Config.get(module.id, config);

        var dir = Directory.root();
        var userId = config.userId;

        var data = {
            'userId': userId,
            'dir': dir.slice(0, -1),
        };

   

        var html = config.html;
        var json = config.json;
        var host = config.host;

        var url = host + config.url;
        url = Url.addQueryString(url, { 'size': 100000, }); //增大每页的记录数，以便一次性全取回来。

        var meta = {
            'userId': userId,
            'url': url,
            'host': host,
            'cache': config.cache,
            'html': {
                'file': $.String.format(html.file, data),
                'write': html.write,
            },
            'json': {
                'file': $.String.format(json.file, data),
                'write': json.write,
            },

            'emitter': new Emitter(this),
        };

        this.meta = meta;
    }






    FavUsers.prototype = { //实例方法
        constructor: FavUsers,

        /**
        * 发起 GET 网络请求以获取信息。
        */
        get: function (fn) {

            fn && this.on('get', fn);

            var meta = this.meta;
            var emitter = meta.emitter;
     
            var api = new API({
                'cache': meta.cache,
                'file': meta.html.file,
                'url': meta.url,
                'parser': Parser,
            });

            api.on({
                'success': function (data) {
                    data = $.Object.extend(data, {
                        'userId': meta.userId,
                        'url': meta.url,
                        'host': meta.host,
                    });


                    if (meta.json.write) {
                        File.writeJSON(meta.json.file, data);
                    }

                    emitter.fire('get', [data]);
                },
                'fail': function () {
                    emitter.fire('get', [null]);
                },
                'error': function () {
                    emitter.fire('get', []);
                },
            });

            api.get();
        },

        /**
        * 绑定事件。
        * 已重载 on({...}，因此支持批量绑定。
        * @param {string} name 事件名称。
        * @param {function} fn 回调函数。
        */
        on: function (name, fn) {
            var meta = this.meta;
            var emitter = meta.emitter;
            var args = [].slice.call(arguments, 0);
            emitter.on.apply(emitter, args);
        },

    };

    return FavUsers;



});