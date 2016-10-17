
var request = require('request');
var fs = require('fs');

define('/Image', function (require, module, exports) {

    var $ = require('$');
    var Directory = require('Directory');
    var File = require('File');
    var Config = require('Config');


    var Emitter = $.require('Emitter');
    var Parser = module.require('Parser');

    /**
    * 构造器。
    */
    function Image(config) {
        config = Config.get(module.id, config);

        var dir = Directory.root();
        var id = config.id;             //当前照片 id

        var data = {
            'dir': dir.slice(0, -1),
            'id': id,
        };


        var meta = {
            'id': id,
            'cache': config.cache,
            'emitter': new Emitter(this),
        };

        [
            'medium',
            'large',
            'origin',
        ].forEach(function (name) {

            var item = config[name];
            item.url = $.String.format(item.url, data);
            item.file = $.String.format(item.file, data);

            meta[name] = item;
        });


        this.meta = meta;
    }






    Image.prototype = { //实例方法
        constructor: Image,

        /**
        * 
        */
        get: function (type) {
            var Log = require('Log');

            var self = this;
            var meta = this.meta;
            var emitter = meta.emitter;
            var item = meta[type];

            var url = item.url;
            var file = item.file;

            if (meta.cache && File.exists(file)) {
                Log.green('存在文件: {0}', file);
                emitter.fire('get', []);
                return;
            }


            Log.cyan('开始请求: {0}', url);

            var req = request.get(url);

            req.on('error', function () {
                Log.red('请求错误: {0}', url);
                console.log(error);
                emitter.fire('error', [error]);
            });

            req.on('response', function (response) {
                Log.green('完成请求: {0}', url);

                Directory.create(file);     //先创建目录。

                var stream = fs.createWriteStream(file);
                req.pipe(stream);

                Log.yellow('写入文件: {0}', file);

                emitter.fire('get', type, []);
            });

          

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

    return Image;



});