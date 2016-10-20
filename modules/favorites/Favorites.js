

define('/Favorites', function (require, module, exports) {

    var $ = require('$');
    var Directory = require('Directory');
    var File = require('File');
    var Config = require('Config');
    var API = require('API');
    var Image = require('Image');

    var Emitter = $.require('Emitter');
    var Parser = module.require('Parser');


    /**
    * 构造器。
    */
    function Favorites(config) {

        //重载 Favorites(userId)
        if (typeof config == 'string') {
            config = { 'userId': config };
        }

        config = Config.get(module.id, config);

        var dir = Directory.root();
        var userId = config.userId;

        var data = {
            'userId': userId,
            'dir': dir.slice(0, -1),
        };

        var url = $.String.format(config.url, data);
        var html = config.html;
        var json = config.json;

        var meta = {
            'userId': userId,
            'url': url,
            'host': url.split('/').slice(0, 3).join('/'),   
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


    //实例方法
    Favorites.prototype = { 
        constructor: Favorites,

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
                    //增加些字段。
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

    return Favorites;



});