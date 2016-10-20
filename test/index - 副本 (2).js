
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
    var Tasks = require('Tasks');

    var User = module.require('User');
    var Page = module.require('Page');
    var Photo = module.require('Photo');

    var user = new User('5167299');

    user.on('get', function (user) {

        var total = user.stats.page;                //总页数。
        var pageNos = Page.resolve('1n+2300', total);    //要处理的页码列表。

        Log.green('请求的页码: {0}', pageNos.join(',').magenta);

        //串行执行任务。
        Tasks.serial({
            'data': pageNos,

            'each': function (no, index, nextPage) {
                var page = new Page({
                    'userId': user.id,
                    'total': total,
                    'no': no,
                });

                page.on('get', function (page) {

                    Tasks.serial({
                        'data': page.ids,
                        'each': function (id, index, nextPhoto) {

                            var photo = new Photo(id);

                            photo.on('get', function (photo) {
                                nextPhoto();
                            });

                            photo.get();
                        },
                        'all': function (values) {
                            nextPage();
                        },
                    });
                });

                page.get();
            },

            'all': function (values) {

            },
        });

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
