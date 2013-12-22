define(function() {
    'use strict';
    function LateScriptSource() {
    }
    LateScriptSource.prototype = {
        aborted: false,
        abort: function() {
            this.aborted = true;
            if (this.realAbort) {
                this.realAbort();
            }
        },
        connect: function(realAbort) {
            this.realAbort = realAbort;
        }
    };
    return LateScriptSource;
});
