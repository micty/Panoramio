﻿
var request = require('request');
var fs = require('fs');

define('/Image', function (require, module, exports) {

    var $ = require('$');
    var Directory = require('Directory');
    var File = require('File');
    var Config = require('Config');


    var Emitter = $.require('Emitter');
    var Parser = module.require('Parser');

    var type$name = {
        'S': 'thumbnail',
        'M': 'medium',
        'L': 'large',
        'X': 'origin',
    };



    /**
    * 构造器。
    */
    function Image(config) {

        //重载 Image(id)
        if (typeof config == 'string') {
            config = { 'id': config };
        }

        config = Config.get(module.id, config);

        var dir = Directory.root();
        var id = config.id;             //当前照片 id

        var data = {
            'dir': dir.slice(0, -1),
            'id': id,
            'retry': config.retry,
            'retriedCount': 0,          //记录已重试的次数。
        };


        var meta = {
            'id': id,
            'cache': config.cache,
            'emitter': new Emitter(this),
        };

        [
            'thumbnail',
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
            type = type$name[type] || type;

            var Image = require('Image');
            var meta = this.meta;
            var item = meta[type];
            var emitter = meta.emitter;
            var self = this;

            var url = item.url;

            //重试。
            function retry() {
                var Log = require('Log');
                if (meta.retriedCount < meta.retry) {
                    meta.retriedCount++;
                    Log.yellow('开始重试第 {0} 次: {1}', meta.retriedCount, url.cyan);
                    self.get(type); //重发请求。
                    return;
                }

                if (meta.retriedCount > 0) {
                    Log.red('共重试 {0} 次后依然失败: {1}', meta.retriedCount, url.cyan);
                }

                var error = new Error('超过最大重试次数。')
                emitter.fire('get', type, [error]);
            }


            Image.get({
                'cache': meta.cache,
                'url': url,
                'file': item.file,

                'done': function (error) {
                    if (error) {
                        retry();
                    }
                    else {
                        emitter.fire('get', type, [error]);
                    }
                },
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