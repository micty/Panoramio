


module.exports = function (require, module, user) {

    var FavUsers = module.require('FavUsers');

    var favs = new FavUsers({
        'userId': user.id,
        'host': user.host,
        'url': user.favUsersUrl,
    });

    favs.get();

};