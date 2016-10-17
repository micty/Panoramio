

var request = require('request');

define('Request', function (require, module, exports) {


    return {
        get: function (url, fn) {
            var Log = require('Log');
            Log.cyan('开始请求: {0}', url);

            request.get(url, function (error, response, html) {
                if (error) {
                    Log.red('请求错误: {0}', url);
                    return;
                }

                Log.green('完成请求: {0}', url);
                fn && fn(html);

            });
        },
    };

});