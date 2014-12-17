
(function (require, process) {


    var Process = require('../modules/Process');
    Process.init();

    var id = Process.getUserId();
    
    var Builder = require('../modules/Builder');

    var json = Builder.repeat(id);
    //Builder.writeJSON(id, 'repeat', json);


})(require, process);