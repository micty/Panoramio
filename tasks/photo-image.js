

module.exports = function (require, module, id, done) {

    var Log = require('Log');
    var ParallelTasks = require('ParallelTasks');

    var Image = module.require('Image');

    var image = new Image(id);
    var fails = [];


    //并行处理每种类型照片。
    var tasks = new ParallelTasks([
        'thumbnail',
        'medium',
        'large',
        'origin',
    ]);


    tasks.on('each', function (type, index, done) {
        image.on('get', type, function (error) {
            if (error) {
                fails.push(type);
            }
            done();
        });

        image.get(type);
    });



    //子任务并行处理完成。
    tasks.on('all', function () {
        if (fails.length > 0) {
            Log.red('失败的照片 id: {0}, 类型: {1}', id, fails.join(', '));
        }

        done();
    });



    tasks.run();



};