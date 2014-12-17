
(function (require, process) {


    var Process = require('../modules/Process');
    Process.init();

    var id = Process.getUserId();

    var Builder = require('../modules/Builder');
    var json = Builder.buildAll(id);
    Builder.writeJSON(id, 'all', json);


})(require, process);