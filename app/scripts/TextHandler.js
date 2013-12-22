define(['jquery-expcss'], function($) {
    'use strict';
    function TextHandler() {
        this.tag1 = $('#text');
        if (Modernizr.textshadow) {
            this.tag1.addClass('shadowed');
        } else {
            this.tag2 = $(document.createElement('div')).attr({id: 'text-shadow'}).insertBefore(this.tag1);
        }
        this.tags = $('#text, #text-shadow');
        if (Modernizr.csstransitions && !navigator.userAgent.match(/SecondLife\//)) {
            $.extend(this, this.CSS);
            this.tag1.bind('transitionend oTransitionEnd webkitTransitionEnd', {to: this}, function(event) {return event.data.to.callback(event);});
        } else {
            $.extend(this, this.JQ);
        }
        this.setFadeDuration(500);
    }
    TextHandler.prototype = {
        tag1: null,
        tag2: null,
        tags: null,
        textFade: 500,
        hide: null,
        show: null,
        callback: null,
        setText: function(text) {
            this.tags.text(text);
        },
        setColor: function(r, g, b) {
            this.tag1.css({color: 'rgb(' + 255 * r + ',' + 255 * g + ',' + 255 * b + ')'});
        },
        CSS: {
            setFadeDuration: function(t) {
                this.tags.expcss('transition', 'opacity ' + t / 1000.0 + 's linear');
            },
            hide: function(f) {
                this.callback = f;
                this.tags.css({opacity: 0.0});
            },
            show: function(f) {
                this.callback = f;
                this.tags.css({opacity: 1.0});
            }
        },
        JQ: {
            hide: function(f) {
                this.tag1.fadeOut(this.textFade, f);
                if (this.tag2) {
                    this.tag2.fadeOut(this.textFade);
                }
            },
            show: function(f) {
                this.tag1.fadeIn(this.textFade, f);
                if (this.tag2) {
                    this.tag2.fadeIn(this.textFade);
                }
            },
            setFadeDuration: function(t) {
                this.textFade = t;
            }
        }
    };
    return TextHandler;
});
