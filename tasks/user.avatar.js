


module.exports = function (require, module, user) {

    var Avatar = module.require('Avatar');

    var avatar = new Avatar({
        'userId': user.id,
        'host': user.host,
        'url': user.avatarUrl,
    });

    avatar.get();

};