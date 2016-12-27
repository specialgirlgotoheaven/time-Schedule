/**
 * Created by weie on 2016/12/27.
 */
if (typeof jQuery === 'undefined') {
    throw new Error('Timeplan\'s JavaScript requires jQuery')
}
(function ($) {
    'use strict';
    var version = $.fn.jquery.split(' ')[0].split('.');
    if ((version[0] < 2 && version[1] < 6) || (version[0] == 1 && version[1] == 6 && version[2] < 1)) {
        throw new Error('Timeplan\'s JavaScript requires jQuery version 1.6.1 or higher');
    }
}(jQuery));
(function($){
    var TimePlan = function(element, options){

    }

})(jQuery);