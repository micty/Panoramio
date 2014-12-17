
(function (require, process) {


    var Process = require('../modules/Process');
    Process.init();

   
    var Builder = require('../modules/Builder');
    

    var path = 'E:/iPhone/Photo/';
    //var path = 'E:/iPhone/Photo/2013-09-07';
    var json = Builder.exif(path);
    Builder.writeJSON('exif', json);

})(require, process);