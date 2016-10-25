
module.exports = function (require, module, id, done) {

    var Log = require('Log');
    var Image = module.require('Image');

    var image = new Image(id);
    var type = 'thumbnail';


    image.on('get', type, function (error) {
        if (error) {
            Log.red('失败的照片 id: {0}, 类型: {1}', id, type);
        }

        done();
    });




    image.get(type);

};