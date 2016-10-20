

define('Percent', function (require, module, exports) {

    var $ = require('$');
    

  

    return {
        'get': function (index, total) {
            if (Array.isArray(total)) {
                total = total.length;
            }

            var order = index + 1;
            var percent = ((order / total) * 100).toFixed(2);
            var item = order + '/' + total + '=' + percent + '%';

            return item;
        },
    };
});

