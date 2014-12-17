

var Log = require('../lib/Log');
var Request = require('request');


module.exports = {

    get: function (url, fn) {

        Log.cyan('开始请求: {0}', url);

        Request.get(url, function (error, response, html) {
            
            if (error) {
                Log.red('请求错误: {0}', url);
                return;
            }

            Log.green('完成请求: {0}', url);
            fn && fn(html);

        });

    }

};