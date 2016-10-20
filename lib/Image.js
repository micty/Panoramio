
var request = require('request');
var fs = require('fs');

define('Image', function (require, module, exports) {

    var $ = require('$');
    var Directory = require('Directory');
    var File = require('File');




    return {

        /**
        * 
        */
        get: function (options) {
            var Log = require('Log');

            var url = options.url;
            var file = options.file;
            var done = options.done || function () { };

            if (options.cache && File.exists(file)) {
                Log.green('存在文件: {0}', file);
                done();
                return;
            }


            Log.cyan('开始请求: {0}', url);

            var req = request.get(url);

            req.on('error', function () {
                Log.red('请求错误: {0}', url);
                console.log(error);
                done(error);
            });

            req.on('response', function (response) {
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