







module.exports = (function () {

    var Log = require('../lib/Log');
    var Config = require('./Config');



    function getUserId() {
        

        var id = process.argv[2] || '5167299';
        if (!id) {
            Log.red('错误: 未指定参数 id');
            return;
        }

        if (!(/^\d+$/g).test(id)) {
            Log.red('错误: 参数 id 必须全为数字');
            return;
        }

        return id;
    }

    function init() {
        Log.clear();
        Config.use();
    }

    return {
        init: init,
        getUserId: getUserId
    };




})();