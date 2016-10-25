
module.exports = function (require, module, id, done) {

    var Log = require('Log');
    var Photo = module.require('Photo');


    //获取照片详情。
    var photo = new Photo(id);

    photo.on('get', function (photo) {
        if (!photo) {
            Log.red('照片详情处理失败: {0}', id);
        }

        done();
    });


    photo.get();

};