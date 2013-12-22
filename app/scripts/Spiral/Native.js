define(['jquery-expcss'], function($) {
    'use strict';
    function NativeSpiral() {
        this.image = $(document.createElement('div')).attr({id: 'image'}).prependTo(document.body);
        if (Modernizr.inlinesvg && Modernizr.svgfilters) {
            $.extend(this, this.SVG);
            var svgNS = 'http://www.w3.org/2000/svg';
            var svg = document.createElementNS(svgNS, 'svg');
            svg.setAttribute('id', 'spiral');
            svg.setAttribute('viewBox', '0 0 1 1');
            svg.setAttribute('version', '1.1');
            this.rotTarget = $(svg);
            var defs = svg.insertBefore(document.createElementNS(svgNS, 'defs'), null);
            var filter = defs.insertBefore(document.createElementNS(svgNS, 'filter'), null);
            filter.setAttribute('id', 'm');
            this.colorMatrix = filter.insertBefore(document.createElementNS(svgNS, 'feColorMatrix'), null);
            this.colorMatrix.setAttribute('type', 'matrix');
            this.setSpiralColor(1, 1, 1);
            this.spiralImage = svg.insertBefore(document.createElementNS(svgNS, 'image'), null);
            this.spiralImage.setAttribute('width', '1');
            this.spiralImage.setAttribute('height', '1');
            this.spiralImage.setAttribute('filter', 'url(#m)');
            $(svg).insertAfter(this.image);
        } else {
            var canvas = document.createElement('canvas');
            if (canvas.getContext) {
                $.extend(this, this.CANVAS);
                this.spiralImage = canvas;
                canvas.width = canvas.height = 512;
                this.rotTarget = $(canvas).attr({id: 'spiral'}).insertAfter(this.image);
                this.context = canvas.getContext('2d');
                $(window).resize({spiral: this}, function(event) { event.data.spiral.resize(); });
                this.resize();
            } else {
                $.extend(this, this.IMG);
                this.rotTarget = this.spiralImage = $(document.createElement('div')).attr({id: 'spiral'}).insertAfter(this.image);
            }
        }
        if (Modernizr.cssanimations) {
            $.extend(this, this.CSSANIM);
            this.rotTarget.attr('class', 'spin');
        } else {
            $.extend(this, this.JS);
            this.unboundRotate = $.proxy(this.rotate, this);
            window.requestAnimationFrame(this.unboundRotate);
        }
    }
    NativeSpiral.prototype = {
        image: null,
        svg: null,
        rotTarget: null,
        spiralImage: null,
        setBackground: function(r, g, b) {
            $(document.body).css({'background-color': 'rgb(' + r * 255 + ',' + g * 255 + ',' + b * 255 + ')'});
        },
        SVG: {
            colorMatrix: null,
            xlinkNS: 'http://www.w3.org/1999/xlink',
            setSpiralImage: function(img) {
                this.spiralImage.setAttributeNS(this.xlinkNS, 'href', img);
            },
            setSpiralColor: function(r, g, b) {
                this.colorMatrix.setAttribute('values', r + ' 0 0 0 0 0 ' + g + ' 0 0 0 0 0 ' + b + ' 0 0 0 0 0 1 0');
            }
        },
        IMG: {
            setSpiralImage: function(img) {
                this.spiralImage.css({'background-image': 'url(' + img + ')'});
            },
            setSpiralColor: function(/*r, g, b*/) {
                // impossible
            }
        },
        CANVAS: {
            context: null,
            spiralColor: [1.0, 1.0, 1.0],
            spiralTexture: null,
            recolor: function() {
                if (this.spiralTexture === null) {
                    return;
                }
                this.spiralImage.width = this.spiralTexture.width;
                this.spiralImage.height = this.spiralTexture.height;
                this.context.clearRect(0, 0, this.spiralImage.width, this.spiralImage.height);
                this.context.drawImage(this.spiralTexture, 0, 0);
                var frame = this.context.getImageData(0, 0, this.spiralImage.width, this.spiralImage.height);
                var data = frame.data;
                var i = this.spiralImage.width * this.spiralImage.height * 4;
                while ((i -= 4) !== 0) {
                    data[i] *= this.spiralColor[0];
                    data[i + 1] *= this.spiralColor[1];
                    data[i + 2] *= this.spiralColor[2];
                }
                this.context.putImageData(frame, 0, 0);
            },
            setSpiralImage: function(img) {
                var image = new Image();
                $(image).load({spiral: this}, function(event) {
                    event.data.spiral.spiralTexture = image;
                    event.data.spiral.recolor();
                });
                image.src = img;
            },
            setSpiralColor: function(r, g, b) {
                this.spiralColor = [r, g, b];
                this.recolor();
                // TODO: it may be a good idea to defer this in case the image and the color change
            },
            resize: function() {
                var width = 0;
                var height = 0;
                var top = 0;
                var left = 0;
                var wwidth = $(window).width();
                var wheight = $(window).height();
                if (wwidth > wheight) {
                    width = height = wheight;
                    left = (wwidth - wheight) / 2.0;
                } else {
                    width = height = wwidth;
                    top = (wheight - wwidth) / 2.0;
                }
                this.rotTarget.css({width: width + 'px', height: height + 'px', top: top + 'px', left: left + 'px'});
            }
        },
        CSSANIM: {
            setRotationPeriod: function(wl) {
                this.rotTarget.expcss('animation-duration', wl + 's');
            }
        },
        JS: {
            baseRot: 0,
            baseTime: 0,
            rotPeriod: 10000,
            unboundRotate: null,
            rotate: function() {
                window.requestAnimationFrame(this.unboundRotate);
                this.rotTarget.expcss('transform', 'rotate(' + 360 * (($.now() - this.baseTime) % this.rotPeriod) / this.rotPeriod + 'deg)');
            },
            setRotationPeriod: function(wl) {
                var time = $.now();
                this.baseRot += 360 * ((time - this.baseTime) % this.rotPeriod) / this.rotPeriod;
                this.baseTime = time;
                while (this.baseRot < 0.0) {
                    this.baseRot += 360;
                }
                while (this.baseRot >= 360) {
                    this.baseRot -= 360;
                }
                this.rotPeriod = wl * 1000;
            }
        },
        setSpiralAlpha: function(a) {
            this.rotTarget.css({opacity: a});
        },
        setImage: function(img) {
            this.image.css({'background-image': 'url(' + img + ')'});
        },
        clearImage: function() {
            this.image.css({'background-image': undefined});
        },
        setImageAlpha: function(a) {
            this.image.css({opacity: a});
        },
        setImageScale: function(x, y) {
            this.image.css({width: 100 * x + '%', height: 100 * y + '%', left: 50 * (1.0 - x) + '%', top: 50 * (1.0 - y) + '%'});
        },
    };
    return NativeSpiral;
});
