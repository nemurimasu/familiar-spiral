define(['jquery'], function($) {
  function expcss() {
    return $.extend($.apply($, arguments), {
      expcss: function(prop, val) {
        prop = Modernizr.prefixed(prop);
        this.each(function(i, v) {
          v.style[prop] = val;
        });
      }
    });
  }
  return $.extend(expcss, $);
});
