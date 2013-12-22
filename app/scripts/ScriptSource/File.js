define(['jquery'], function($) {
    'use strict';
    function FileScriptSource(file, reader) {
        var self = this;
        var fileReader = this.fileReader = $.extend(new FileReader(), {
            onloadend: function() {
                self.fileReader = undefined;
            },
            onload: function() {
                reader.addLines(fileReader.result.split('\n').map(function(v) { return $.trim(v); }));
            }
        });
        fileReader.readAsText(file);
    }
    FileScriptSource.prototype = {
        abort: function() {
            if (this.fileReader !== undefined) {
                this.fileReader.abort();
            }
        }
    };
    return FileScriptSource;
});
