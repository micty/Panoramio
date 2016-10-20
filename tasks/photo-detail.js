﻿


module.exports = function (require, module, id, done) {

    var Log = require('Log');
    var ParallelTasks = require('ParallelTasks');

    var Photo = module.require('Photo');
    var Stats = module.require('Stats');
    var Image = module.require('Image');



    //获取照片详情。
    function getDetail(id, done) {
        var photo = new Photo(id);

        photo.on('get', function (photo) {
            if (!photo) {
                Log.red('照片详情处理失败: {0}', id);
                fail.photos.push(id);
            }
            done();
        });

        photo.get();
    }

    //获取照片统计。
    function getStats(id, done) {
        var stats = new Stats(id);

        stats.on('get', function () {
            done();
        });
        stats.get();
    }



    //并行处理每张照片的详情、统计。
    var tasks = new ParallelTasks([
        getDetail,
        getStats,
    ]);


    tasks.on('each', function (item, index, done) {
        item(id, done);
    });

    tasks.on('all', done);



    tasks.run();



};