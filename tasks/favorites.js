


module.exports = function (require, module, user) {

    var Favorites = module.require('Favorites');

    var fav = new Favorites(user.id);

    fav.on('get', function (fav) {

    });

    fav.get();

};