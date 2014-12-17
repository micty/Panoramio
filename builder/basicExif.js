
(function (require, process) {


    var Process = require('../modules/Process');
    Process.init();

   
    var Builder = require('../modules/Builder');
    

    var dir = 'E:/iPhone/Photo/';
    //var dir = 'E:/iPhone/Photo/2013-09-07';

    var json = Builder.basicExif(dir);
    Builder.writeJSON('basicExif', json);

   
    

})(require, process);