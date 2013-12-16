define(['jquery'], function($) {
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
  return WebGlSpiral;
});
