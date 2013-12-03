(function() {
  var console = window.console;
  if (console == undefined)
    console = {};
  if (console.log == undefined)
    console.log = function(){};
  var expcss = {
    expcss: function(prop, val) {
      prop = Modernizr.prefixed(prop);
      this.each(function(i, v) {
        v.style[prop] = val;
      });
    }
  };
  $.extend($.prototype, expcss);
  WebGlSpiral.prototype = {
    canvas: null,
    context: null,
    shader: null,
    spiralScale: [0.95, 0.95],
    imageScale: [0.95, 0.95],
    aspectScale: [0.5, 1.0],
    spiralColor: [1.0, 1.0, 1.0, 1.0],
    imageColor: [1.0, 1.0, 1.0, 1.0],
    spiralTexture: null,
    imageTexture: null,
    unboundDraw: null,
    baseTime: 0,
    baseRot: 0,
    rotPeriod: 10000,
    blankImageData: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVQIHWNgYAAAAAMAAU9ICq8AAAAASUVORK5CYII=',
    draw: function() {
      window.requestAnimationFrame(this.unboundDraw);
      var context = this.context, canvas = this.canvas, shader = this.shader;

      context.viewport(0, 0, canvas.width, canvas.height);

      context.clear(context.COLOR_BUFFER_BIT);

      context.uniform2fv(shader.scale, this.imageScale);
      context.uniform1f(shader.rot, 0.0);
      context.uniform4fv(shader.color, this.imageColor);
      context.uniform1i(shader.texture, 1);
      context.drawArrays(context.TRIANGLE_STRIP, 0, 4);

      context.uniform2fv(shader.scale, this.spiralScale);
      context.uniform1f(shader.rot, this.baseRot + -2.0 * Math.PI * (($.now() - this.baseTime) % this.rotPeriod) / this.rotPeriod);
      context.uniform4fv(shader.color, this.spiralColor);
      context.uniform1i(shader.texture, 0);
      context.drawArrays(context.TRIANGLE_STRIP, 0, 4);
    },
    resize: function(w, h) {
      this.canvas.width = w;
      this.canvas.height = h;
      if (w > h) {
        this.aspectScale = [h / w, 1.0];
      } else {
        this.aspectScale = [1.0, w / h];
      }
      this.context.uniform2fv(this.shader.aspectScale, this.aspectScale);
    },
    loadTexture: function(texture, num, src) {
      var img = new Image();
      var context = this.context;
      $(img).load(function() {
        var bits = 0;
        // check for power of two
        for (var i = 0; i < 32; i++) {
          bits += 1 & (img.width >> i);
        }
        if (img.width != img.height || bits != 1) {
          var width = img.width;
          var height = img.height;
          var maxImg = Math.max(img.width, img.height);
          var target = maxImg;
          // convert to power of 2
          for (var i = 1; i < target; i = i << 1);
          target = i;
          // clamp
          target = Math.min(target, context.getParameter(context.MAX_TEXTURE_SIZE));
          width *= target / maxImg;
          height *= target / maxImg;
          var x = 0;
          var y = 0;
          if (width > height) {
            y = (width - height) * 0.5;
          } else {
            x = (height - width) * 0.5;
          }
          console.log({x: x, y: y, width: width, height: height});
          var canvas = document.createElement('canvas');
          canvas.width = canvas.height = target;
          var context2d = canvas.getContext('2d');
          context2d.drawImage(img, x, y, width, height);
          img = canvas;
        }
        context.activeTexture(num);
        context.bindTexture(context.TEXTURE_2D, texture);
        context.texImage2D(context.TEXTURE_2D, 0, context.RGBA, context.RGBA, context.UNSIGNED_BYTE, img);
        context.texParameteri(context.TEXTURE_2D, context.TEXTURE_MAG_FILTER, context.LINEAR);
        context.texParameteri(context.TEXTURE_2D, context.TEXTURE_MIN_FILTER, context.LINEAR_MIPMAP_NEAREST);
        context.texParameteri(context.TEXTURE_2D, context.TEXTURE_WRAP_S, context.CLAMP_TO_EDGE);
        context.texParameteri(context.TEXTURE_2D, context.TEXTURE_WRAP_T, context.CLAMP_TO_EDGE);
        context.generateMipmap(context.TEXTURE_2D);
      });
      $(img).error({gls: this}, function(event) {
        event.data.gls.loadTexture(texture, num, event.data.gls.blankImageData);
      });
      img.src = src;
    },
    setBackground: function(r, g, b) {
      this.context.clearColor(r, g, b, 1.0);
    },
    setSpiralImage: function(img) {
      this.loadTexture(this.spiralTexture, this.context.TEXTURE0, img);
    },
    setImage: function(img) {
      this.loadTexture(this.imageTexture, this.context.TEXTURE1, img);
    },
    setSpiralColor: function(r, g, b) {
      this.spiralColor[0] = r;
      this.spiralColor[1] = g;
      this.spiralColor[2] = b;
    },
    setSpiralAlpha: function(a) {
      this.spiralColor[3] = a;
    },
    setImageColor: function(r, g, b) {
      this.imageColor[0] = r;
      this.imageColor[1] = g;
      this.imageColor[2] = b;
    },
    setImageAlpha: function(a) {
      this.imageColor[3] = a;
    },
    setSpiralScale: function(x, y) {
      this.imageScale[0] = x;
      this.imageScale[1] = y;
    },
    setImageScale: function(x, y) {
      this.imageScale[0] = x;
      this.imageScale[1] = y;
    },
    setRotationPeriod: function(wl) {
      var time = $.now();
      this.baseRot += -2.0 * Math.PI * ((time - this.baseTime) % this.rotPeriod) / this.rotPeriod;
      this.baseTime = time;
      while (this.baseRot < 0.0)
        this.baseRot += 2.0 * Math.PI;
      while (this.baseRot >= 2.0 * Math.PI)
        this.baseRot -= 2.0 * Math.PI;
      this.rotPeriod = wl * 1000;
    },
    clearImage: function() {
      this.setImage(this.blankImageData);
    }
  };
  function WebGlSpiral() {
    this.unboundDraw = $.proxy(this.draw, this);
    window.requestAnimationFrame = Modernizr.prefixed('requestAnimationFrame', window) || function(proc) { window.setTimeout(proc, 1000 / 30); };

    if (!Modernizr.webgl)
      throw 'webgl unsupported';
    this.canvas = document.createElement('canvas');
    this.context = this.canvas.getContext('webgl') || this.canvas.getContext('experimental-webgl');
    if (!this.context)
      throw 'webgl unsupported';
    $(this.canvas).attr({id: 'web-gl-spiral'}).prependTo(document.body);

    var psh = this.context.createShader(this.context.FRAGMENT_SHADER);
    var vsh = this.context.createShader(this.context.VERTEX_SHADER);
    this.context.shaderSource(psh, 'precision highp float;uniform vec4 color;varying vec2 ptexcoord;uniform sampler2D sampler;void main(void){gl_FragColor=color*texture2D(sampler,ptexcoord);}');
    this.context.shaderSource(vsh, 'attribute vec2 pos;attribute vec2 texcoord;uniform float rot;uniform vec2 scale;uniform vec2 aspect;varying vec2 ptexcoord;void main(void){vec2 scaled=scale*pos;float crot=cos(rot);float srot=sin(rot);gl_Position=vec4(aspect*vec2(scaled.x*crot-scaled.y*srot,scaled.x*srot+scaled.y*crot),0.0,1.0);ptexcoord=texcoord;}');
    this.context.compileShader(psh);
    this.context.compileShader(vsh);
    if (!this.context.getShaderParameter(psh, this.context.COMPILE_STATUS)) {
      console.log(this.context.getShaderInfoLog(psh));
      throw 'psh init failed';
    }
    if (!this.context.getShaderParameter(vsh, this.context.COMPILE_STATUS)) {
      console.log(this.context.getShaderInfoLog(vsh));
      throw 'vsh init failed';
    }
    this.shader = this.context.createProgram();
    this.context.attachShader(this.shader, vsh);
    this.context.attachShader(this.shader, psh);
    this.context.linkProgram(this.shader);
    if (!this.context.getProgramParameter(this.shader, this.context.LINK_STATUS)) {
      throw 'shader init failed';
    }
    this.context.useProgram(this.shader);
    this.shader.pos = this.context.getAttribLocation(this.shader, 'pos');
    this.context.enableVertexAttribArray(this.shader.pos);
    this.shader.texcoord = this.context.getAttribLocation(this.shader, 'texcoord');
    this.context.enableVertexAttribArray(this.shader.texcoord);
    this.shader.rot = this.context.getUniformLocation(this.shader, 'rot');
    this.shader.aspectScale = this.context.getUniformLocation(this.shader, 'aspect');
    this.shader.scale = this.context.getUniformLocation(this.shader, 'scale');
    this.shader.color = this.context.getUniformLocation(this.shader, 'color');
    this.shader.texture = this.context.getUniformLocation(this.shader, 'sampler');
    this.context.uniform2fv(this.shader.aspectScale, this.aspectScale);

    this.quad = this.context.createBuffer();
    this.context.bindBuffer(this.context.ARRAY_BUFFER, this.quad);
    this.context.bufferData(this.context.ARRAY_BUFFER, new Float32Array([
          1.0, 1.0,
          -1.0, 1.0,
          1.0, -1.0,
          -1.0, -1.0
          ]), this.context.STATIC_DRAW);
    this.context.vertexAttribPointer(this.shader.pos, 2, this.context.FLOAT, false, 0, 0);

    this.quadtex = this.context.createBuffer();
    this.context.bindBuffer(this.context.ARRAY_BUFFER, this.quadtex);
    this.context.bufferData(this.context.ARRAY_BUFFER, new Float32Array([
          1.0, 0.0,
          0.0, 0.0,
          1.0, 1.0,
          0.0, 1.0
          ]), this.context.STATIC_DRAW);
    this.context.vertexAttribPointer(this.shader.texcoord, 2, this.context.FLOAT, false, 0, 0);

    this.context.blendFunc(this.context.SRC_ALPHA, this.context.ONE_MINUS_SRC_ALPHA);
    this.context.enable(this.context.BLEND);

    this.setBackground([0, 0, 0]);

    this.spiralTexture = this.context.createTexture();
    this.imageTexture = this.context.createTexture();
    this.setSpiralImage(this.blankImageData);
    this.clearImage();

    $(window).resize({spiral: this}, function(event) { event.data.spiral.resize($(window).width(), $(window).height()); });
    this.resize($(window).width(), $(window).height());
    this.draw();
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
    addSources: function(tag, src) {
      $(tag).empty().append($([['ogg', 'audio/ogg; codecs="vorbis"'], ['mp3', 'audio/mpeg; codecs="mp3"']]).filter(function(e) { return Modernizr.audio[e[0]]; }).map(function(i, e) {
        return $(document.createElement('source')).attr({src: src + '.' + e[0], type: e[1]})[0];
      }));
    },
    playLoop: function(src) {
      this.addSources(this.loopTag, src);
    },
    play: function(src) {
      var tag = document.createElement('audio');
      $(tag).attr({preload: true, autoplay: true, volume: this.volume}).appendTo(document.body);
      $(tag).bind('ended', {na: this}, function(event) {
        var index = event.data.na.tags.indexOf(event.target);
        if (index != -1)
          $(event.data.na.tags.splice(index, 1)).remove();
      });
      this.addSources(tag, src);
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
  function NativeAudio() {
    this.loopTag = document.createElement('audio');
    if (!Modernizr.audio.ogg && !Modernizr.audio.mp3) {
      throw 'audio unsupported';
    }
    $(this.loopTag).attr({preload: true, autoplay: true, loop: true, volume: 1.0}).appendTo(document.body);
    if (this.loopTag.loop == undefined) {
      // thanks Firefox...
      $(this.loopTag).bind('ended', function(event) {
        event.target.currentTime = 0.0;
        event.target.play();
      });
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
      setSpiralColor: function(r, g, b) {
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
        while (i -= 4) {
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
        while (this.baseRot < 0.0)
          this.baseRot += 360;
        while (this.baseRot >= 360)
          this.baseRot -= 360;
        this.rotPeriod = wl * 1000;
      }
    },
    setSpiralAlpha: function(a) {
      this.rotTarget.css({opacity: a});
    },
    setImage: function(img) {
      this.image.css({'background-image': 'url(' + img + ')'});
    },
    clearImage: function(img) {
      this.image.css({'background-image': undefined});
    },
    setImageAlpha: function(a) {
      this.image.css({opacity: a});
    },
    setImageScale: function(x, y) {
      this.image.css({width: 100 * x + '%', height: 100 * y + '%', left: 50 * (1.0 - x) + '%', top: 50 * (1.0 - y) + '%'});
    },
  };
  function NativeSpiral() {
    this.image = $(document.createElement('div')).attr({id: 'image'}).prependTo(document.body);
    if (Modernizr.svgfilters) {
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
        if (this.tag2)
          this.tag2.fadeOut(this.textFade);
      },
      show: function(f) {
        this.tag1.fadeIn(this.textFade, f);
        if (this.tag2)
          this.tag2.fadeIn(this.textFade);
      },
      setFadeDuration: function(t) {
        this.textFade = t;
      }
    }
  };
  function TextHandler() {
    this.tag1 = $('#text');
    if (Modernizr.textshadow) {
      this.tag1.addClass('shadowed');
    } else {
      this.tag2 = $(document.createElement('div')).attr({id: 'text-shadow'}).insertBefore(this.tag1);
    }
    this.tags = $('#text, #text-shadow');
    if (Modernizr.csstransitions) {
      $.extend(this, this.CSS);
      this.tag1.bind('transitionend oTransitionEnd webkitTransitionEnd', {to: this}, function(event) {return event.data.to.callback(event);});
    } else {
      $.extend(this, this.JQ);
    }
    this.setFadeDuration(500);
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
        if (part[0] == '%') {
          if (part == '%name') {
            return '<Full Name>';
          } else if (part == '%fn') {
            return '<First Name>';
          } else if (part == '%ln') {
            return '<Last Name>';
          } else if (part == '%nn') {
            return '<Nick Name>';
          } else if (part == '%oname') {
            return '<Owner Full Name>';
          } else if (part == '%ofn') {
            return '<Owner First Name>';
          } else if (part == '%oln') {
            return '<Owner Last Name>';
          } else {
            console.log('Unhandled substitution: ' + part);
          }
        }
        return part;
      }).join('');
    },
    show: function() {
      if (this.pos == this.lines.length)
        return;
      var line = this.filter(this.lines[this.pos]);
      this.pos++;
      if (line[0] == '-')
        return this.handleCommand(line.substring(1));
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
      if (this.pos == oldLen && this.lines.length > oldLen) {
        this.hide();
      }
    },
    reset: function(lines) {
      this.lines = [];
      this.pos = 0;
      this.textPause = 4000;

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
        spiral.setSpiralImage('images/spiral.png');
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
      if (match = cmd.match(/^textcolor\s+<(\d*\.?\d*),\s*(\d*\.?\d*),\s*(\d*\.?\d*)>/)) {
        this.text.setColor(parseFloat(match[1]), parseFloat(match[2]), parseFloat(match[3]));
      } else if (match = cmd.match(/^backgroundcolor\s+<(\d*\.?\d*),\s*(\d*\.?\d*),\s*(\d*\.?\d*)>/)) {
        this.spiral.setBackground(parseFloat(match[1]) / 255.0, parseFloat(match[2]) / 255.0, parseFloat(match[3]) / 255.0);
      } else if (match = cmd.match(/^whirlcolor\s+<(\d*\.?\d*),\s*(\d*\.?\d*),\s*(\d*\.?\d*)>/)) {
        this.spiral.setSpiralColor(parseFloat(match[1]) / 255.0, parseFloat(match[2]) / 255.0, parseFloat(match[3]) / 255.0);
      } else if (match = cmd.match(/^imagesize\s+<(\d*\.?\d*),\s*(\d*\.?\d*),\s*(\d*\.?\d*)>/)) {
        this.spiral.setImageScale(parseFloat(match[1]), parseFloat(match[2]));
      } else if (match = cmd.match(/^imagesize\s+tall$/)) {
        this.spiral.setImageScale(0.65, 0.95);
      } else if (match = cmd.match(/^imagesize\s+wide$/)) {
        this.spiral.setImageScale(0.95, 0.65);
      } else if (match = cmd.match(/^pause\s+(\d*\.?\d*)/)) {
        setTimeout(this.unboundShow, parseFloat(match[1]) * 1000);
        // don't change the display, but don't read the next line yet either
        // TODO: find out whether the following sleeps 4 or 8 seconds
        // -textpause 4
        // a
        // -pause 4
        // b
        // TODO: are we supposed to fade out before pausing?
        return;
      } else if (match = cmd.match(/^textpause\s+(\d*\.?\d*)/)) {
        this.textPause = parseFloat(match[1] * 1000);
      } else if (match = cmd.match(/^textfade\s+(\d*\.?\d*)/)) {
        this.text.setFadeDuration(parseFloat(match[1]) * 1000);
      } else if (match = cmd.match(/^whirlalpha\s+(\d*\.?\d*)/)) {
        this.spiral.setSpiralAlpha(parseFloat(match[1]));
      } else if (match = cmd.match(/^imagealpha\s+(\d*\.?\d*)/)) {
        this.spiral.setImageAlpha(parseFloat(match[1]));
      } else if (match = cmd.match(/^whirlspeed\s+(\d*\.?\d*)/)) {
        this.spiral.setRotationPeriod(1.0 / parseFloat(match[1]));
      } else if (match = cmd.match(/^loopvolume\s+(\d*\.?\d*)/)) {
        this.audio.setLoopVolume(parseFloat(match[1]));
      } else if (match = cmd.match(/^volume\s+(\d*\.?\d*)/)) {
        this.audio.setVolume(parseFloat(match[1]));
      } else if (match = cmd.match(/^whirlimage\s+([^'"()]*)/)) {
        this.spiral.setSpiralImage(match[1]);
      } else if (match = cmd.match(/^image\s+([^'"()]*)/)) {
        if (match[1] == 'no image' || match[1] == 'noimage') {
          this.spiral.clearImage();
        } else {
          this.spiral.setImage(match[1]);
        }
      } else if (match = cmd.match(/^loopsound\s+(.*)/)) {
        this.audio.playLoop(match[1]);
      } else if (match = cmd.match(/^sound\s+(.*)/)) {
        this.audio.play(match[1]);
      } else if (match = cmd.match(/^jump\s+(\d+)/)) {
        this.pos = parseInt(match[1]);
        // TODO: need to watch for tight infinite loops
      } else if (match = cmd.match(/^rlv\s+(.*)/)) {
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
  function ScriptReader(spiral, text, audio, scriptSource) {
    this.spiral = spiral;
    this.text = text;
    this.audio = audio;
    this.unboundHide = $.proxy(this.hide, this);
    this.unboundShow = $.proxy(this.show, this);
    this.unboundHover = $.proxy(this.hover, this);
    this.reset();
  };

  TagScriptSource.prototype = {
    abort: function() { }
  };
  function TagScriptSource(reader) {
    var tag = $('script[type="text/x-hypno"]');
    if (!tag.length)
      throw 'missing';
    reader.addLines($(tag.text().split('\n')).map(function(i, v) { return $.trim(v); }));
  }

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

  FileScriptSource.prototype = {
    abort: function() {
      if (this.fileReader !== undefined)
      {
        this.fileReader.abort();
      }
    }
  };
  function FileScriptSource(file, reader) {
    var fileReader = this.fileReader = $.extend(new FileReader(), {
      onloadend: function() {
        this.fileReader = undefined;
      },
      onload: function() {
        reader.addLines(fileReader.result.split('\n').map(function(v) { return $.trim(v); }));
      }
    });
    fileReader.readAsText(file);
  }

  $(document).ready(function() {
    var spiral;
    var audio;
    var text;
    var reader;
    var scriptSource;
    try {
      spiral = new WebGlSpiral();
    } catch (e) {
      spiral = new NativeSpiral();
    }
    try {
      audio = new NativeAudio();
    } catch (e) {
    }
    text = new TextHandler();
    reader = new ScriptReader(spiral, text, audio);
    try {
      scriptSource = new TagScriptSource(reader);
    } catch(e) {
      scriptSource = new AjaxScriptSource('1.txt', reader);
    }

    var body = $(document.body);
    body.on('dragover', function(event) {
      var dt = event.originalEvent.dataTransfer;
      var items = dt.items;
      if (items.length == 1 && items[0].kind === 'file')
      {
        event.stopPropagation();
        event.preventDefault();
        dt.dropEffect = 'copy';
      }
    });
    body.on('drop', function(event) {
      event.stopPropagation();
      event.preventDefault();
      var file = event.originalEvent.dataTransfer.items[0].getAsFile();
      scriptSource.abort();
      reader.reset();
      scriptSource = new FileScriptSource(file, reader);
    });
  });
})();
