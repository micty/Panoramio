
/**
* 用户收藏的图片分页。
*/
define('/FavPhotos', function (require, module, exports) {

    var $ = require('$');
    var Directory = require('Directory');
    var File = require('File');
    var Config = require('Config');
    var API = require('API');

    var Emitter = $.require('Emitter');
    var Parser = module.require('Parser');

    /**
    * 构造器。
    */
    function FavPhotos(config) {
        config = Config.get(module.id, config);

        var dir = Directory.root();
        var userId = config.userId; 
        var no = config.no;         //当前页码，从 1 开始。
        var total = config.total;   //总页数。
        var sn = no - total;        //编程页码，最后一页为 0，倒数第二页为 -1，倒数第三页为 -2，依次类推。

        var data = {
            'dir': dir.slice(0, -1),
            'userId': userId,
            'no': no,
            'sn': sn,
        };

        var url = $.String.format(config.url, data);

        var html = config.html;
        var json = config.json;

        var meta = {
            'userId': userId,
            'url': url,
            'no': no,
            'total': total,
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






    FavPhotos.prototype = { //实例方法
        constructor: FavPhotos,

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

                    $.Object.extend(data, {
                        'userId': meta.userId,
                        'url': meta.url,
                        'no': meta.no,
                        'total': meta.total,
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




    return FavPhotos;



});