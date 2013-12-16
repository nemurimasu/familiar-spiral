define(['jquery'], function($) {
  TagScriptSource.prototype = {
    abort: function() { }
  };
  function TagScriptSource(reader) {
    var tag = $('script[type="text/x-hypno"]');
    if (!tag.length)
      throw 'missing';
    reader.addLines($(tag.text().split('\n')).map(function(i, v) { return $.trim(v); }));
  }
  return TagScriptSource;
});
