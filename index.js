
var defineJS = require('./f/defineJS');

defineJS.config({
    modules: [
        'lib/',
        'modules/',
    ],
});

defineJS.run(function (require, module) {
    var Config = require('Config');
    Config.use('./config.json');

    var Log = require('Log');

    var User = module.require('User');
    var user = new User('5167299');

    user.on('get', function (user) {

        return;
     
        var Page = module.require('Page');
        var total = user.stats.page;        //总页数。
        var pageNos = Page.resolve('1n', total);

        Log.green('请求的页码: {0}', pageNos.join(',').magenta);

        var maxIndex = pageNos.length - 1;
        var index = 0;

        function request() {
            var no = pageNos[index];
            if (!no) {
                return;
            }

            var page = new Page({
                'userId': user.id,
                'total': total,
                'no': no,
            });

            page.on('get', function () {
                index++;
                request();
            });

            page.get();
        }

        request();
    });


    user.get();

    var Photo = module.require('Photo');
    var photo = new Photo('95932372');
    //var photo = new Photo('133807073');

    photo.on('get', function (data) {
        console.log(data);
    });

    //photo.get();



    var Stats = module.require('Stats');
    //var stats = new Stats('43216978');
    var stats = new Stats('93315776');

    stats.on('get', function (data) {
        console.log(data);
    });

    //stats.get();


});
