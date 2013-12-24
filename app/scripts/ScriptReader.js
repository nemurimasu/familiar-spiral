define(['jquery', 'asset-paths', 'Settings'], function($, assetPaths, settings) {
    'use strict';
    function ScriptReader(spiral, text, audio) {
        this.spiral = spiral;
        this.text = text;
        this.audio = audio;
        this.unboundHide = $.proxy(this.hide, this);
        this.unboundShow = $.proxy(this.show, this);
        this.unboundHover = $.proxy(this.hover, this);
        this.reset();
    }
    ScriptReader.prototype = {
        spiral: null,
        text: null,
        audio: null,
        unboundHide: null,
        unboundShow: null,
        unboundHover: null,
        filter: function(line) {
            return line.split(/(%\S+)/).map(function(part) {
                if (part[0] === '%') {
                    if (part === '%name') {
                        return settings.fullName();
                    } else if (part === '%fn') {
                        return settings.firstName();
                    } else if (part === '%ln') {
                        return settings.lastName();
                    } else if (part === '%nn') {
                        return settings.nickName();
                    } else if (part === '%oname') {
                        return settings.ownerFullName();
                    } else if (part === '%ofn') {
                        return settings.ownerFirstName();
                    } else if (part === '%oln') {
                        return settings.ownerLastName();
                    } else {
                        console.log('Unhandled substitution: ' + part);
                    }
                }
                return part;
            }).join('');
        },
        show: function() {
            if (this.pos === this.lines.length) {
                return;
            }
            var line = this.filter(this.lines[this.pos]);
            this.pos++;
            if (line[0] === '-') {
                return this.handleCommand(line.substring(1));
            }
            this.text.setText(line);
            this.text.show(this.unboundHover);
        },
        hover: function() {
            setTimeout(this.unboundHide, this.textPause);
        },
        hide: function() {
            this.text.hide(this.unboundShow);
        },
        addLines: function(lines) {
            var oldLen = this.lines.length;
            $.merge(this.lines, lines);
            if (this.pos === oldLen && this.lines.length > oldLen) {
                this.hide();
            }
        },
        reset: function() {
            this.lines = [];
            this.pos = 0;
            this.textPause = 4000;

            this.translateUrl = function(f) { return f; };

            var text = this.text, spiral = this.spiral, audio = this.audio;
            if (text) {
                text.setColor(1.0, 1.0, 1.0);
                text.setFadeDuration(500);
            }
            if (spiral) {
                spiral.setBackground(0.0, 0.0, 0.0);
                spiral.setSpiralColor(1.0, 1.0, 1.0);
                spiral.setImageScale(0.95, 0.95);
                spiral.setSpiralAlpha(1.0);
                spiral.setImageAlpha(1.0);
                spiral.setRotationPeriod(10);
                spiral.setSpiralImage(assetPaths.spiral);
                spiral.clearImage();
            }
            if (audio) {
                audio.setLoopVolume(1.0);
                audio.setVolume(1.0);
                audio.stopLoop();
                audio.stopSounds();
            }
        },
        handleCommand: function(cmd) {
            var match;
            if ((match = cmd.match(/^textcolor\s+<(\d*\.?\d*),\s*(\d*\.?\d*),\s*(\d*\.?\d*)>/)) !== null) {
                this.text.setColor(parseFloat(match[1]), parseFloat(match[2]), parseFloat(match[3]));
            } else if ((match = cmd.match(/^backgroundcolor\s+<(\d*\.?\d*),\s*(\d*\.?\d*),\s*(\d*\.?\d*)>/)) !== null) {
                this.spiral.setBackground(parseFloat(match[1]) / 255.0, parseFloat(match[2]) / 255.0, parseFloat(match[3]) / 255.0);
            } else if ((match = cmd.match(/^whirlcolor\s+<(\d*\.?\d*),\s*(\d*\.?\d*),\s*(\d*\.?\d*)>/)) !== null) {
                this.spiral.setSpiralColor(parseFloat(match[1]) / 255.0, parseFloat(match[2]) / 255.0, parseFloat(match[3]) / 255.0);
            } else if ((match = cmd.match(/^imagesize\s+<(\d*\.?\d*),\s*(\d*\.?\d*),\s*(\d*\.?\d*)>/)) !== null) {
                this.spiral.setImageScale(parseFloat(match[1]), parseFloat(match[2]));
            } else if ((match = cmd.match(/^imagesize\s+tall$/)) !== null) {
                this.spiral.setImageScale(0.65, 0.95);
            } else if ((match = cmd.match(/^imagesize\s+wide$/)) !== null) {
                this.spiral.setImageScale(0.95, 0.65);
            } else if ((match = cmd.match(/^pause\s+(\d*\.?\d*)/)) !== null) {
                setTimeout(this.unboundShow, parseFloat(match[1]) * 1000);
                // don't change the display, but don't read the next line yet either
                // TODO: find out whether the following sleeps 4 or 8 seconds
                // -textpause 4
                // a
                // -pause 4
                // b
                // TODO: are we supposed to fade out before pausing?
                return;
            } else if ((match = cmd.match(/^textpause\s+(\d*\.?\d*)/)) !== null) {
                this.textPause = parseFloat(match[1] * 1000);
            } else if ((match = cmd.match(/^textfade\s+(\d*\.?\d*)/)) !== null) {
                this.text.setFadeDuration(parseFloat(match[1]) * 1000);
            } else if ((match = cmd.match(/^whirlalpha\s+(\d*\.?\d*)/)) !== null) {
                this.spiral.setSpiralAlpha(parseFloat(match[1]));
            } else if ((match = cmd.match(/^imagealpha\s+(\d*\.?\d*)/)) !== null) {
                this.spiral.setImageAlpha(parseFloat(match[1]));
            } else if ((match = cmd.match(/^whirlspeed\s+(\d*\.?\d*)/)) !== null) {
                this.spiral.setRotationPeriod(1.0 / parseFloat(match[1]));
            } else if ((match = cmd.match(/^loopvolume\s+(\d*\.?\d*)/)) !== null) {
                this.audio.setLoopVolume(parseFloat(match[1]));
            } else if ((match = cmd.match(/^volume\s+(\d*\.?\d*)/)) !== null) {
                this.audio.setVolume(parseFloat(match[1]));
            } else if ((match = cmd.match(/^whirlimage\s+([^'"()]*)/)) !== null) {
                this.spiral.setSpiralImage(this.translateUrl(match[1]));
            } else if ((match = cmd.match(/^image\s+([^'"()]*)/)) !== null) {
                if (match[1] === 'no image' || match[1] === 'noimage') {
                    this.spiral.clearImage();
                } else {
                    this.spiral.setImage(this.translateUrl(match[1]));
                }
            } else if ((match = cmd.match(/^loopsound\s+(.*)/)) !== null) {
                this.audio.playLoop(match[1], this.translateUrl);
            } else if ((match = cmd.match(/^sound\s+(.*)/)) !== null) {
                this.audio.play(match[1], this.translateUrl);
            } else if ((match = cmd.match(/^jump\s+(\d+)/)) !== null) {
                this.pos = parseInt(match[1], 10);
                // TODO: need to watch for tight infinite loops
            } else if ((match = cmd.match(/^rlv\s+(.*)/)) !== null) {
                console.log('Attempting to voodoo the viewer with RLRLV: ' + match[1]);
            } else {
                console.log('Unhandled command: ' + cmd);
                // display the unknown command as text
                this.text.setText('-' + cmd);
                this.text.show(this.unboundHover);
                return;
            }
            this.show();
        }
    };
    return ScriptReader;
});
