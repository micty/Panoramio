
var request = require('request');
var fs = require('fs');

define('Image', function (require, module, exports) {

    var $ = require('$');
    var Directory = require('Directory');
    var File = require('File');

    var config = null;



    return {

        /**
        * 
        */
        get: function (options) {
            var Log = require('Log');
       
            if (!config) {
                var Config = require('Config');
                config = Config.get(module.id);
            }

            var url = options.url;
            var file = options.file;
            var done = options.done || function () { };

            if (options.cache && File.exists(file)) {
                Log.green('存在文件: {0}', file);
                done();
                return;
            }


            //同时启动超时器和发起请求，让它们去竞争。
            var isTimeout = false;  //指示是否已超时
            var tid = null;
            var timeout = config.timeout || 0;

            if (timeout > 0) {
                tid = setTimeout(function () {
                    isTimeout = true;
                    var error = new Error('请求已超时。');
                    console.log(error);
                    done(error);
                }, timeout);
            }



            Log.cyan('开始请求: {0}', url);

            var req = request.get(url);

            req.on('error', function (error) {
                if (isTimeout) { //已超时，忽略。
                    return;
                }

                clearTimeout(tid);  //取消超时控制。

                Log.red('请求错误: {0}', url);
                console.log(error);
                done(error);
            });


            req.on('response', function (response) {
                if (isTimeout) { //已超时，忽略。
                    return;
                }

                clearTimeout(tid);  //取消超时控制。

                Log.green('完成请求: {0}', url);

                Directory.create(file);     //先创建目录。

                var stream = fs.createWriteStream(file);
                req.pipe(stream);

                Log.yellow('写入文件: {0}', file);
                done();
            });
        },

    };




});