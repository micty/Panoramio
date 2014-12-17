
(function (require, process) {


    var Process = require('../modules/Process');
    Process.init();

    var id = Process.getUserId();


    var Directory = require('../lib/Directory');

    var Builder = require('../modules/Builder');
    

    var dir = 'E:/iPhone/Photo/';
    //var dir = 'E:/iPhone/Photo/2014-12-06/';


    var json = Builder.noExist(id, dir);
    Builder.writeJSON(id, 'noExist', json);


})(require, process);