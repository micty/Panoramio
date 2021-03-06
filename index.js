﻿
var _require = require; //原生的 require

var defineJS = require('defineJS');

defineJS.config({
    modules: [
        'lib/',
        'modules/',
        'tasks/',
    ],
});

defineJS.run(function (require, module) {

    //运行子任务。
    function run(name, arg0, arg1) {
        var file = './tasks/' + name + '.js';
        var fn = _require(file);

        var args = [].slice.call(arguments, 1);
        args = [require, module].concat(args);

        fn.apply(null, args);
    }

    var Config = require('Config');
    Config.use('./config.js');

    var config = Config.get(module.id);
    var userId = config.userId;

    //全局填充 config.js 中的模板。
    Config.format({
        'userId': userId,
    });



    var Tasks = module.require('Tasks');
    var User = module.require('User');

    var user = new User(userId);


    //旁枝（不那么重要的）子任务。
    Tasks.get('user.').forEach(function (name) {
        user.on('get', function (user) {
            run(name, user);
        });
    });




    //主要任务: 获取用户照片的分页数据。
    user.on('get', function (user) {
        var ParallelTasks = require('ParallelTasks');

        var pageNos = process.argv[2] || config.pageNos;    //接收从命令行输入的参数作为页码。
        var list = Tasks.get(process.argv[3]);              //接收从命令行输入的参数作为单个任务。

        run('pages', user, pageNos, function (id, done) {

            //并行处理每种类型。
            var tasks = new ParallelTasks(list);

            tasks.on('each', function (item, index, done) {
                run(item, id, done);
            });

            //子任务并行处理完成。
            tasks.on('all', done);
            tasks.run();
        });

    });

    user.get();



    var Favorites = module.require('Favorites');
    var fav = new Favorites(config.userId);
    fav.on('get', function () {

    });

    //fav.get();


});
