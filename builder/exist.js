
(function (require, process) {


    var Process = require('../modules/Process');
    Process.init();

    var id = Process.getUserId();


    var Directory = require('../lib/Directory');

    var Builder = require('../modules/Builder');
    

    var dir = 'E:/iPhone/Photo/';
    //var dir = 'E:/iPhone/Photo/2014-12-06/';

    //var path = 'E:/iPhone/Photo/2014-06-01/';
    //path = path + 'IMG_7859.JPG';
    //var Image = require('../modules/Image');
    //var exif = Image.getBasicExif(path);
    //console.log(exif);
    //return;


    var json = Builder.exist(id, dir);
    Builder.writeJSON(id, 'id$file', json.id$file);
    Builder.writeJSON(id, 'file$id', json.file$id);


    var json = Builder.noExist(id, dir);
    Builder.writeJSON(id, 'noExist', json);


})(require, process);