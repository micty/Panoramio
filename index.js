
var _require = require; //原生的 require

var defineJS = require('./f/defineJS');

defineJS.config({
    modules: [
        'lib/',
        'modules/',
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
    Config.use('./config.json');


    var User = module.require('User');
    var config = Config.get(module.id);

    //接收从命令行输入的参数作为页码。
    if (process.argv[2]) {
        config.pageNos = process.argv[2];
    }

    var user = new User(config.userId);


    //获取用户头像。
    user.on('get', function (user) {
        run('avatar', user);
    });

    //获取用户的评论分页。
    user.on('get', function (user) {
        run('comments', user);
    });

    //获取用户收藏的摄影师
    user.on('get', function (user) {
        run('fav-users', user);
    });

    //获取用户加入的群组
    user.on('get', function (user) {
        run('groups', user);
    });
    
    //获取用户照片的分页数据。
    user.on('get', function (user) {
        run('photo-pages', {
            'user': user,
            'pageNos': config.pageNos,

            //获取照片详情。
            'each': function (id, done) {
                //run('photo-detail', id, done);
                run('photo-image', id, done);
            },
        });
    });



    user.get();



    var Favorites = module.require('Favorites');
    var fav = new Favorites(config.userId);
    fav.on('get', function () {

    });

    //fav.get();


});
