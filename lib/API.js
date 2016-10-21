

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
    var Config = require('Config');
    var Emitter = $.require('Emitter');


    /**
    * API 构造器。
    * @param {Object} [config] 配置对象。
    */
    function API(config) {
        config = Config.get(module.id, config);

        var meta = {
            'cache': config.cache,
            'url': config.url,
            'file': config.file,
            'parser': config.parser,
            'retry': config.retry,
            'errorHtml': config.errorHtml,
            'retriedCount': 0,          //记录已重试的次数。
            'timeout': config.timeout,
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
            var url = meta.url;
            var self = this;

            if (cache) {
                var content = File.read(file);
                if (content !== null) {
                    done(content);
                    return;
                }
            }

            var Log = require('Log');


            //同时启动超时器和发起请求，让它们去竞争。
            var isTimeout = false;  //指示是否已超时
            var tid = null;
            var timeout = meta.timeout || 0;

            if (timeout > 0) {
                tid = setTimeout(function () {
                    isTimeout = true;
                    done(false);
                }, timeout);
            }

            Log.cyan('开始请求: {0}', url);
            request.get(url, function (error, response, content) {
                if (isTimeout) { //已超时，忽略。
                    return;
                }

                clearTimeout(tid);  //取消超时控制。

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
                done(content);
            });



            //重试。
            function retry() {
                if (meta.retriedCount < meta.retry) {
                    meta.retriedCount++;
                    Log.yellow('开始重试第 {0} 次: {1}', meta.retriedCount, url.cyan);
                    self.get();             //重发请求。
                    return;
                }
            
                if (meta.retriedCount > 0) {
                    Log.red('共重试 {0} 次后依然失败: {1}', meta.retriedCount, url.cyan);
                }

                emitter.fire('fail');
            }

            //内部共用函数。
            function done(content) {
                if (content === false) {
                    Log.red('请求超时: {0}', url.cyan);
                    retry();
                    return;
                }

                if (content.includes(meta.errorHtml)) {
                    Log.red('服务器返回错误页: {0}', url.cyan);
                    File.delete(file);      //内容无效，删除
                    retry();
                    return;
                }


                //用 setTimeout() 包起来是防止 Parser.parse() 会调用太多次而报错: 
                //  "RangeError: Maximum call stack size exceeded"。
                //详见: 
                //  http://stackoverflow.com/questions/20936486/node-js-maximum-call-stack-size-exceeded
                setTimeout(function () {
                    var data = Parser.parse(content, parser);
                    if (data) {
                        emitter.fire('success', [data]);
                    }
                    else {
                        emitter.fire('fail');
                    }
                }, 0);
            }

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


