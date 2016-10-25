
module.exports = function (require, module, id, done) {

    var Log = require('Log');
    var Stats = module.require('Stats');

    var stats = new Stats(id);

    stats.on('get', function () {
        done();
    });


    stats.get();


};