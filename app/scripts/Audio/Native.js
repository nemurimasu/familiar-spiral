define(['jquery'], function($) {
    'use strict';
    function NativeAudio() {
        this.loopTag = document.createElement('audio');
        if (!Modernizr.audio.ogg && !Modernizr.audio.mp3) {
            throw 'audio unsupported';
        }
        $(this.loopTag).attr({preload: true, autoplay: true, loop: true, volume: 1.0}).appendTo(document.body);
        if (this.loopTag.loop === undefined) {
            // thanks Firefox...
            $(this.loopTag).bind('ended', function(event) {
                event.target.currentTime = 0.0;
                event.target.play();
            });
        }
    }
    NativeAudio.prototype = {
        loopTag: null,
        tags: [],
        volume: 1.0,
        setVolume: function(volume) {
            this.volume = volume;
        },
        setLoopVolume: function(volume) {
            this.loopTag.volume = volume;
        },
        addSources: function(tag, src, translateUrl) {
            $(tag).empty().append($([['ogg', 'audio/ogg; codecs="vorbis"'], ['mp3', 'audio/mpeg; codecs="mp3"']]).filter(function(i, e) { return Modernizr.audio[e[0]]; }).map(function(i, e) {
                return $(document.createElement('source')).attr({src: translateUrl(src + '.' + e[0]), type: e[1]})[0];
            }));
        },
        playLoop: function(src, translateUrl) {
            this.addSources(this.loopTag, src, translateUrl);
        },
        play: function(src, translateUrl) {
            var tag = document.createElement('audio');
            $(tag).attr({preload: true, autoplay: true, volume: this.volume}).appendTo(document.body);
            $(tag).bind('ended', {na: this}, function(event) {
                var index = event.data.na.tags.indexOf(event.target);
                if (index !== -1) {
                    $(event.data.na.tags.splice(index, 1)).remove();
                }
            });
            this.addSources(tag, src, translateUrl);
            this.tags.push(tag);
        },
        stopLoop: function() {
            $(this.loopTag).empty();
        },
        stopSounds: function() {
            $(this.tags).remove();
            this.tags = [];
        }
    };
    return NativeAudio;
});
