define(['jquery'], function($) {
    'use strict';
    $.fn.expcss = function(prop, val) {
        prop = Modernizr.prefixed(prop);
        this.each(function(i, v) {
            v.style[prop] = val;
        });
        return this;
    };
    return $;
});
