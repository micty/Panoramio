
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
    var SerialTasks = require('SerialTasks');
    var ParallelTasks = require('ParallelTasks');
    var Percent = require('Percent');

    var User = module.require('User');
    var Page = module.require('Page');
    var Photo = module.require('Photo');
    var Image = module.require('Image');
    var Stats = module.require('Stats');

    var user = new User('5167299');

    user.on('get', function (user) {

        var total = user.stats.page;                //总页数。
        var pageNos = Page.resolve('2000-2050', total);    //要处理的页码列表。

        Log.green('请求的页码: {0}', pageNos.join(',').magenta);

        //记录失败的记录。
        var fail = {
            pages: [],
            photos: [],
        };



        var pages = new SerialTasks(pageNos);

        //串行处理每一分页。
        pages.on('each', function (no, index, done) {
            var percent = Percent.get(index, pageNos);
            Log.add('页码: {0}    进度: {1}', no.toString().cyan, percent.bgBlue);

            var page = new Page({
                'userId': user.id,
                'total': total,
                'no': no,
            });

            page.on('get', function (page) {
                if (!page) {
                    Log.red('分页处理失败, pageNo={0}', no);
                    fail.pages.push(no);
                }

                done({
                    'no': no,
                    'ids': page ? page.ids : [],
                });
            });

            page.get();
        });


        //全部分页处理完后。
        pages.on('all', function (pages) {
            
            var total = pages.length;

            pages = new SerialTasks(pages);

            pages.on('each', function (page, index, done) {

                var percent = Percent.get(index, total);
                var photos = new SerialTasks(page.ids);


                //串行处理每张照片。
                photos.on('each', function (id, index, done) {
                    Log.add('页码: {0}    照片: {1}    进度: {2}', page.no.toString().cyan, id.cyan, percent.bgBlue);

                    //并行处理每张照片的详情、统计、图片。
                    var tasks = new ParallelTasks([
                        //照片详情。
                        function (done) {
                            var photo = new Photo(id);  
                            photo.on('get', function (photo) {
                                if (!photo) {
                                    Log.red('照片详情处理失败: {0}', id);
                                    fail.photos.push(id);
                                }
                                done();
                            });
                            photo.get();
                        },

                        //照片统计。
                        function (done) {
                            var stats = new Stats(id);  
                            stats.on('get', function () {
                                done();
                            });
                            stats.get();
                        },

                        ////照片图片(小）。
                        //function (done) {
                        //    var image = new Image(id);  
                        //    image.on('get', 'thumbnail', function () {
                        //        done();
                        //    });
                        //    image.get('thumbnail');
                        //},
                    ]);

                    tasks.on('each', function (item, index, done) {
                        item(done);
                    });

                    tasks.on('all', function () {
                        done();
                    });

                    tasks.run();
                   
                });

                //分页内所有照片处理完成。
                photos.on('all', function () {
                    done();
                });

                photos.run();

            });

            //全部分页完成。
            pages.on('all', function () {

            });

            pages.run();

        });


        pages.run();

    });



    user.get();



    //var Image = module.require('Image');
    //var image = new Image('133807054');

    //image.get('S');
    ////image.get('M');
    ////image.get('L');
    ////image.get('X');


});
