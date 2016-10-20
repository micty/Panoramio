


module.exports = function (require, module, user) {

    var Groups = module.require('Groups');

    var groups = new Groups({
        'userId': user.id,
        'host': user.host,
        'url': user.groupsUrl,
    });

    groups.get();

};