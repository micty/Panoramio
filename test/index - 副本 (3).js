
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
    var Percent = require('Percent');

    var User = module.require('User');
    var Page = module.require('Page');
    var Photo = module.require('Photo');
    var Image = module.require('Image');
    var Stats = module.require('Stats');

    var user = new User('5167299');

    user.on('get', function (user) {

        var total = user.stats.page;                //总页数。
        var pageNos = Page.resolve('1n', total);    //要处理的页码列表。

        Log.green('请求的页码: {0}', pageNos.join(',').magenta);

        //记录失败的记录。
        var fail = {
            pages: [],
            photos: [],
        };


        //串行处理每一分页。
        Tasks.serial({
            'data': pageNos,
            'each': function (no, index, donePage) {
                var percent = Percent.get(index, pageNos);
                Log.add('页码: {0}  进度: {1}', no.toString().cyan, percent.bgBlue);

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

                    donePage({
                        'no': no,
                        'ids': page ? page.ids : [],
                    });
                });

                page.get();
            },



            //全部页处理完成后。
            'all': function (pages) {
                if (fail.pages.length > 0) {
                    Log.red('失败的页码: {0}', fail.pages.join(','));
                }

                //串行处理每一分页。
                Tasks.serial({
                    'data': pages,
                    'each': function (page, index, donePage) {
                        var percent = Percent.get(index, pages);

                        //串行处理页内的单张照片。
                        Tasks.serial({
                            'data': page.ids,

                            'each': function (id, index, donePhoto) {

                                Log.add('页码: {0}  照片: {1}  进度: {2}', page.no.toString().cyan, id.cyan, percent.bgBlue);

                                var photo = new Photo(id);
                                photo.on('get', function (photo) {
                                    if (!photo) {
                                        Log.red('照片处理失败, photoId={0}', id);
                                        fail.photos.push(id);
                                    }

                                    //var image = new Image(id);

                                    //image.on('get', {
                                    //    'thumbnail': function () {
                                    //        image.get('medium');
                                    //    },
                                    //    'medium': function () {
                                    //        image.get('large');
                                    //    },
                                    //    'large': function () {
                                    //        image.get('origin');
                                    //    },
                                    //    'origin': function () {
                                            
                                    //        var stats = new Stats(id);

                                    //        stats.on('get', function () {
                                    //            donePhoto();
                                    //        });

                                    //        stats.get();
                                    //    },
                                    //});

                                    //image.get('thumbnail');


                                    var stats = new Stats(id);

                                    stats.on('get', function () {
                                        donePhoto();
                                    });

                                    stats.get();

                                });

                                photo.get();
                            },

                            //页内所有照片处理完成。
                            'all': function () {
                                donePage();
                            },
                        });
                    },

                    //全部页处理完成。
                    'all': function () {
                        
                    },
                });

            },
        });

    });

    //user.get();



    var Image = module.require('Image');
    var image = new Image('133807054');

    image.get('S');
    //image.get('M');
    //image.get('L');
    //image.get('X');


});
