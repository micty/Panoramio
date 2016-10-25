


module.exports = function (require, module, user, pageNos, each) {

    var Pager = require('Pager');
    var SerialTasks = require('SerialTasks');
    var Percent = require('Percent');
    var Log = require('Log');

    var Page = module.require('Page');


   
    var total = user.stats.page;                //总页数。

    pageNos = Pager.resolve(pageNos, total);    //要处理的页码列表。


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
        Log.add('照片页码: {0}    页码进度: {1}', no.toString().cyan, percent.bgBlue);

        var page = new Page({
            'userId': user.id,
            'total': total,
            'no': no,
        });

        page.on('get', function (page) {
            if (!page) {
                Log.red('照片分页处理失败: {0}', no);
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

        //串行处理每一分页。
        pages.on('each', function (page, index, done) {
            var ids = page.ids;
            if (!ids) { //发现错误
                console.log(page);
            }

            var percent = Percent.get(index, total);
            var photos = new SerialTasks(page.ids);

            //串行处理每张照片。
            photos.on('each', function (id, index, done) {
                Log.add('页码: {0}    照片: {1}    进度: {2}', page.no.toString().cyan, id.cyan, percent.bgBlue);
                
                //避免堆栈溢出而挂掉。
                setTimeout(function () {
                    each(id, done);
                }, 0);


            });

            //分页内所有照片处理完成。
            photos.on('all', function () {
                done();
            });

            photos.run();
        });

        //全部分页处理完后。
        pages.on('all', function () {
            Log.magenta('全部分页处理完!');
        });

        pages.run();

    });



    //立即运行。
    pages.run();


};