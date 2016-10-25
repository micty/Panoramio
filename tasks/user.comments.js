


module.exports = function (require, module, user) {

    var Pager = require('Pager');
    var SerialTasks = require('SerialTasks');
    var Percent = require('Percent');
    var Log = require('Log');

    var Comments = module.require('Comments');
    



    var fails = [];                             //记录失败的页码。
    var total = user.stats.comment;             //总页数。
    var pageNos = Pager.resolve('1n', total);   //要处理的评论页码列表。
    var pages = new SerialTasks(pageNos);




    //串行处理每一分页。
    pages.on('each', function (no, index, done) {

        var percent = Percent.get(index, pageNos);

        Log.add('评论页码: {0}    页码进度: {1}', no.toString().cyan, percent.bgBlue);

        var page = new Comments({
            'userId': user.id,
            'total': total,
            'no': no,
        });

        page.on('get', function (page) {
            if (!page) {
                Log.red('评论分页处理失败: {0}', no);
                fails.push(no);
            }

            done();
        });

        page.get();
    });



    //全部分页处理完成。
    pages.on('all', function () {
        if (fails.length > 0) {
            Log.red('评论分页处理失败的页码: {0}', fails.join(', '));
        }
    });





    //立即运行。
    pages.run();

};