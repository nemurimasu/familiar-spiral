define(['jquery'], function($) {
  AjaxScriptSource.prototype = {
    abort: function() {
      if (this.req !== undefined)
      {
        this.req.abort();
        this.req = undefined;
      }
    }
  };
  function AjaxScriptSource(url, reader) {
    this.req = $.get(url, function(data) {
      reader.addLines(data.split('\n'));
      this.req = undefined;
    }, 'html').error(function(e) {alert(e);});
  }
  return AjaxScriptSource;
});
