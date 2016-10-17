

var request = require('request');
var fs = require('fs');


/**
* 页面请求类。
* @class
* @name API
*/
define('API', function (require, module, exports) {

    var $ = require('$');
    var Directory = require('Directory');
    var File = require('File');
    var Parser = require('Parser');
    var Emitter = $.require('Emitter');


    /**
    * API 构造器。
    * @param {Object} [config] 配置对象。
    */
    function API(config) {

        var meta = {
            'cache': config.cache,
            'url': config.url,
            'file': config.file,
            'parser': config.parser,
            'emitter': new Emitter(this),
        };

        this.meta = meta;

    }



    //实例方法
    API.prototype = /**@lends API#*/ {
        constructor: API,

        /**
        * 发起网络 GET 请求。
        * 请求完成后会最先触发相应的事件。
        */
        get: function () {

            var meta = this.meta;
            var emitter = meta.emitter;
            var cache = meta.cache;
            var file = meta.file;
            var parser = meta.parser;

            if (cache) {
                var content = File.read(file);
                if (content !== null) {
                    var data = Parser.parse(content, parser);
                    if (data) {
                        emitter.fire('success', [data]);
                    }
                    else {
                        emitter.fire('fail', []);
                    }
                    return;
                }
            }


            var url = meta.url;

            var Log = require('Log');
            Log.cyan('开始请求: {0}', url);

            request.get(url, function (error, response, content) {

                if (error) {
                    Log.red('请求错误: {0}', url);
                    console.log(error);
                    emitter.fire('error', [error]);
                    return;
                }

                Log.green('完成请求: {0}', url);
              
                if (cache) {
                    File.write(file, content);
                }

                var data = Parser.parse(content, parser);
                if (data) {
                    emitter.fire('success', [data]);
                }
                else {
                    emitter.fire('fail', []);
                }

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


    return API;

});


