!function(){function a(){if(this.unboundDraw=$.proxy(this.draw,this),window.requestAnimationFrame=Modernizr.prefixed("requestAnimationFrame",window)||function(a){window.setTimeout(a,1e3/30)},!Modernizr.webgl)throw"webgl unsupported";if(this.canvas=document.createElement("canvas"),this.context=this.canvas.getContext("webgl")||this.canvas.getContext("experimental-webgl"),!this.context)throw"webgl unsupported";$(this.canvas).attr({id:"web-gl-spiral"}).prependTo(document.body);var a=this.context.createShader(this.context.FRAGMENT_SHADER),b=this.context.createShader(this.context.VERTEX_SHADER);if(this.context.shaderSource(a,"precision highp float;uniform vec4 color;varying vec2 ptexcoord;uniform sampler2D sampler;void main(void){gl_FragColor=color*texture2D(sampler,ptexcoord);}"),this.context.shaderSource(b,"attribute vec2 pos;attribute vec2 texcoord;uniform float rot;uniform vec2 scale;uniform vec2 aspect;varying vec2 ptexcoord;void main(void){vec2 scaled=scale*pos;float crot=cos(rot);float srot=sin(rot);gl_Position=vec4(aspect*vec2(scaled.x*crot-scaled.y*srot,scaled.x*srot+scaled.y*crot),0.0,1.0);ptexcoord=texcoord;}"),this.context.compileShader(a),this.context.compileShader(b),!this.context.getShaderParameter(a,this.context.COMPILE_STATUS))throw i.log(this.context.getShaderInfoLog(a)),"psh init failed";if(!this.context.getShaderParameter(b,this.context.COMPILE_STATUS))throw i.log(this.context.getShaderInfoLog(b)),"vsh init failed";if(this.shader=this.context.createProgram(),this.context.attachShader(this.shader,b),this.context.attachShader(this.shader,a),this.context.linkProgram(this.shader),!this.context.getProgramParameter(this.shader,this.context.LINK_STATUS))throw"shader init failed";this.context.useProgram(this.shader),this.shader.pos=this.context.getAttribLocation(this.shader,"pos"),this.context.enableVertexAttribArray(this.shader.pos),this.shader.texcoord=this.context.getAttribLocation(this.shader,"texcoord"),this.context.enableVertexAttribArray(this.shader.texcoord),this.shader.rot=this.context.getUniformLocation(this.shader,"rot"),this.shader.aspectScale=this.context.getUniformLocation(this.shader,"aspect"),this.shader.scale=this.context.getUniformLocation(this.shader,"scale"),this.shader.color=this.context.getUniformLocation(this.shader,"color"),this.shader.texture=this.context.getUniformLocation(this.shader,"sampler"),this.context.uniform2fv(this.shader.aspectScale,this.aspectScale),this.quad=this.context.createBuffer(),this.context.bindBuffer(this.context.ARRAY_BUFFER,this.quad),this.context.bufferData(this.context.ARRAY_BUFFER,new Float32Array([1,1,-1,1,1,-1,-1,-1]),this.context.STATIC_DRAW),this.context.vertexAttribPointer(this.shader.pos,2,this.context.FLOAT,!1,0,0),this.quadtex=this.context.createBuffer(),this.context.bindBuffer(this.context.ARRAY_BUFFER,this.quadtex),this.context.bufferData(this.context.ARRAY_BUFFER,new Float32Array([1,0,0,0,1,1,0,1]),this.context.STATIC_DRAW),this.context.vertexAttribPointer(this.shader.texcoord,2,this.context.FLOAT,!1,0,0),this.context.blendFunc(this.context.SRC_ALPHA,this.context.ONE_MINUS_SRC_ALPHA),this.context.enable(this.context.BLEND),this.setBackground([0,0,0]),this.spiralTexture=this.context.createTexture(),this.imageTexture=this.context.createTexture(),this.setSpiralImage("images/spiral.png"),this.clearImage(),$(window).resize({spiral:this},function(a){a.data.spiral.resize($(window).width(),$(window).height())}),this.resize($(window).width(),$(window).height()),this.draw()}function b(){if(this.loopTag=document.createElement("audio"),!Modernizr.audio.ogg&&!Modernizr.audio.mp3)throw"audio unsupported";$(this.loopTag).attr({preload:!0,autoplay:!0,loop:!0,volume:1}).appendTo(document.body),void 0==this.loopTag.loop&&$(this.loopTag).bind("ended",function(a){a.target.currentTime=0,a.target.play()})}function c(){if(this.image=$(document.createElement("div")).attr({id:"image"}).prependTo(document.body),Modernizr.svgfilters){$.extend(this,this.SVG);var a,b="http://www.w3.org/2000/svg";this.rotTarget=a=$(document.createElementNS(b,"svg")).attr({id:"spiral",viewBox:"0 0 1 1",version:"1.1"});var c=$(document.createElementNS(b,"defs")).appendTo(a),d=$(document.createElementNS(b,"filter")).attr({id:"m"}).appendTo(c);this.colorMatrix=$(document.createElementNS(b,"feColorMatrix")).attr({type:"matrix"}).appendTo(d),this.setSpiralColor(1,1,1),this.spiralImage=$(document.createElementNS(b,"image")).attr({width:1,height:1,filter:"url(#m)"}).appendTo(a),a.insertAfter(this.image)}else{var e=document.createElement("canvas");e.getContext?($.extend(this,this.CANVAS),this.spiralImage=e,e.width=e.height=512,this.rotTarget=$(e).attr({id:"spiral"}).insertAfter(this.image),this.context=e.getContext("2d"),$(window).resize({spiral:this},function(a){a.data.spiral.resize()}),this.resize()):($.extend(this,this.IMG),this.rotTarget=this.spiralImage=$(document.createElement("div")).attr({id:"spiral"}).insertAfter(this.image))}this.setSpiralImage("images/spiral.png"),Modernizr.cssanimations?($.extend(this,this.CSSANIM),this.rotTarget.addClass("spin")):($.extend(this,this.JS),this.unboundRotate=$.proxy(this.rotate,this),window.requestAnimationFrame(this.unboundRotate))}function d(){this.tag1=$("#text"),this.tag2=$(document.createElement("div")).attr({id:"text-shadow"}).insertBefore(this.tag1),this.tags=$("#text, #text-shadow"),Modernizr.csstransitions?($.extend(this,this.CSS),this.tag1.bind("transitionend oTransitionEnd webkitTransitionEnd",{to:this},function(a){return a.data.to.callback(a)})):$.extend(this,this.JQ),this.setFadeDuration(500)}function e(a,b,c){this.spiral=a,this.text=b,this.audio=c,this.unboundHide=$.proxy(this.hide,this),this.unboundShow=$.proxy(this.show,this),this.unboundHover=$.proxy(this.hover,this)}function f(a){var b=$('script[type="text/x-hypno"]');if(!b.length)throw"missing";a.addLines($(b.text().split("\n")).map(function(a,b){return $.trim(b)}))}function g(a,b){this.req=$.get(a,function(a){b.addLines(a.split("\n")),this.req=void 0},"html").error(function(a){alert(a)})}function h(a,b){var c=this.fileReader=$.extend(new FileReader,{onloadend:function(){this.fileReader=void 0},onload:function(){b.addLines(c.result.split("\n").map(function(a){return $.trim(a)}))}});c.readAsText(a)}var i=window.console;void 0==i&&(i={}),void 0==i.log&&(i.log=function(){});var j={expcss:function(a,b){a=Modernizr.prefixed(a),this.each(function(c,d){d.style[a]=b})}};$.extend($.prototype,j),a.prototype={canvas:null,context:null,shader:null,spiralScale:[.95,.95],imageScale:[.95,.95],aspectScale:[.5,1],spiralColor:[1,1,1,1],imageColor:[1,1,1,1],spiralTexture:null,imageTexture:null,unboundDraw:null,baseTime:0,baseRot:0,rotPeriod:1e4,blankImageData:"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVQIHWNgYAAAAAMAAU9ICq8AAAAASUVORK5CYII=",draw:function(){window.requestAnimationFrame(this.unboundDraw);var a=this.context,b=this.canvas,c=this.shader;a.viewport(0,0,b.width,b.height),a.clear(a.COLOR_BUFFER_BIT),a.uniform2fv(c.scale,this.imageScale),a.uniform1f(c.rot,0),a.uniform4fv(c.color,this.imageColor),a.uniform1i(c.texture,1),a.drawArrays(a.TRIANGLE_STRIP,0,4),a.uniform2fv(c.scale,this.spiralScale),a.uniform1f(c.rot,this.baseRot+-2*Math.PI*(($.now()-this.baseTime)%this.rotPeriod)/this.rotPeriod),a.uniform4fv(c.color,this.spiralColor),a.uniform1i(c.texture,0),a.drawArrays(a.TRIANGLE_STRIP,0,4)},resize:function(a,b){this.canvas.width=a,this.canvas.height=b,this.aspectScale=a>b?[b/a,1]:[1,a/b],this.context.uniform2fv(this.shader.aspectScale,this.aspectScale)},loadTexture:function(a,b,c){var d=new Image,e=this.context;$(d).load(function(){for(var c=0,f=0;32>f;f++)c+=1&d.width>>f;if(d.width!=d.height||1!=c){for(var g=d.width,h=d.height,j=Math.max(d.width,d.height),k=j,f=1;k>f;f<<=1);k=f,k=Math.min(k,e.getParameter(e.MAX_TEXTURE_SIZE)),g*=k/j,h*=k/j;var l=0,m=0;g>h?m=.5*(g-h):l=.5*(h-g),i.log({x:l,y:m,width:g,height:h});var n=document.createElement("canvas");n.width=n.height=k;var o=n.getContext("2d");o.drawImage(d,l,m,g,h),d=n}e.activeTexture(b),e.bindTexture(e.TEXTURE_2D,a),e.texImage2D(e.TEXTURE_2D,0,e.RGBA,e.RGBA,e.UNSIGNED_BYTE,d),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MAG_FILTER,e.LINEAR),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MIN_FILTER,e.LINEAR_MIPMAP_NEAREST),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_S,e.CLAMP_TO_EDGE),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_T,e.CLAMP_TO_EDGE),e.generateMipmap(e.TEXTURE_2D)}),$(d).error({gls:this},function(c){c.data.gls.loadTexture(a,b,c.data.gls.blankImageData)}),d.src=c},setBackground:function(a,b,c){this.context.clearColor(a,b,c,1)},setSpiralImage:function(a){this.loadTexture(this.spiralTexture,this.context.TEXTURE0,a)},setImage:function(a){this.loadTexture(this.imageTexture,this.context.TEXTURE1,a)},setSpiralColor:function(a,b,c){this.spiralColor[0]=a,this.spiralColor[1]=b,this.spiralColor[2]=c},setSpiralAlpha:function(a){this.spiralColor[3]=a},setImageColor:function(a,b,c){this.imageColor[0]=a,this.imageColor[1]=b,this.imageColor[2]=c},setImageAlpha:function(a){this.imageColor[3]=a},setSpiralScale:function(a,b){this.imageScale[0]=a,this.imageScale[1]=b},setImageScale:function(a,b){this.imageScale[0]=a,this.imageScale[1]=b},setRotationPeriod:function(){var a=$.now();for(this.baseRot+=-2*Math.PI*((a-this.baseTime)%this.rotPeriod)/this.rotPeriod,this.baseTime=a;this.baseRot<0;)this.baseRot+=2*Math.PI;for(;this.baseRot>=2*Math.PI;)this.baseRot-=2*Math.PI},clearImage:function(){this.setImage(this.blankImageData)}},b.prototype={loopTag:null,tags:[],volume:1,setVolume:function(a){this.volume=a},setLoopVolume:function(a){this.loopTag.volume=a},addSources:function(a,b){$(a).empty().append($([["ogg",'audio/ogg; codecs="vorbis"'],["mp3",'audio/mpeg; codecs="mp3"']]).filter(function(a){return Modernizr.audio[a[0]]}).map(function(a,c){return $(document.createElement("source")).attr({src:b+"."+c[0],type:c[1]})[0]}))},playLoop:function(a){this.addSources(this.loopTag,a)},play:function(a){var b=document.createElement("audio");$(b).attr({preload:!0,autoplay:!0,volume:this.volume}).appendTo(document.body),$(b).bind("ended",{na:this},function(a){var b=a.data.na.tags.indexOf(a.target);-1!=b&&$(a.data.na.tags.splice(b,1)).remove()}),this.addSources(b,a),this.tags.push(b)}},c.prototype={image:null,svg:null,rotTarget:null,spiralImage:null,setBackground:function(a,b,c){$(document.body).css({"background-color":"rgb("+255*a+","+255*b+","+255*c+")"})},SVG:{colorMatrix:null,xlinkNS:"http://www.w3.org/1999/xlink",setSpiralImage:function(a){this.spiralImage[0].setAttributeNS(this.xlinkNS,"href",a)},setSpiralColor:function(a,b,c){this.colorMatrix.attr({values:a+" 0 0 0 0 0 "+b+" 0 0 0 0 0 "+c+" 0 0 0 0 0 1 0"})}},IMG:{setSpiralImage:function(a){this.spiralImage.css({"background-image":"url("+a+")"})},setSpiralColor:function(){}},CANVAS:{context:null,spiralColor:[1,1,1],spiralTexture:null,recolor:function(){this.spiralImage.width=this.spiralTexture.width,this.spiralImage.height=this.spiralTexture.height,this.context.clearRect(0,0,this.spiralImage.width,this.spiralImage.height),this.context.drawImage(this.spiralTexture,0,0);for(var a=this.context.getImageData(0,0,this.spiralImage.width,this.spiralImage.height),b=a.data,c=4*this.spiralImage.width*this.spiralImage.height;c-=4;)b[c]*=this.spiralColor[0],b[c+1]*=this.spiralColor[1],b[c+2]*=this.spiralColor[2];this.context.putImageData(a,0,0)},setSpiralImage:function(a){var b=new Image;$(b).load({spiral:this},function(a){a.data.spiral.spiralTexture=b,a.data.spiral.recolor()}),b.src=a},setSpiralColor:function(a,b,c){this.spiralColor=[a,b,c],this.recolor()},resize:function(){var a=0,b=0,c=0,d=0,e=$(window).width(),f=$(window).height();e>f?(a=b=f,d=(e-f)/2):(a=b=e,c=(f-e)/2),this.rotTarget.css({width:a+"px",height:b+"px",top:c+"px",left:d+"px"})}},CSSANIM:{setRotationPeriod:function(a){this.rotTarget.expcss("animation-duration",a+"s")}},JS:{baseRot:0,baseTime:0,rotPeriod:1e4,unboundRotate:null,rotate:function(){window.requestAnimationFrame(this.unboundRotate),this.rotTarget.expcss("transform","rotate("+360*(($.now()-this.baseTime)%this.rotPeriod)/this.rotPeriod+"deg)")},setRotationPeriod:function(){var a=$.now();for(this.baseRot+=360*((a-this.baseTime)%this.rotPeriod)/this.rotPeriod,this.baseTime=a;this.baseRot<0;)this.baseRot+=360;for(;this.baseRot>=360;)this.baseRot-=360}},setSpiralAlpha:function(a){this.rotTarget.css({opacity:a})},setImage:function(a){this.image.css({"background-image":"url("+a+")"})},clearImage:function(){this.image.css({"background-image":void 0})},setImageAlpha:function(a){this.image.css({opacity:a})},setImageScale:function(a,b){this.image.css({width:100*a+"%",height:100*b+"%",left:50*(1-a)+"%",top:50*(1-b)+"%"})}},d.prototype={tag1:null,tag2:null,tags:null,textFade:500,hide:null,show:null,callback:null,setText:function(a){this.tags.text(a)},setColor:function(a,b,c){this.tag1.css({color:"rgb("+255*a+","+255*b+","+255*c+")"})},CSS:{setFadeDuration:function(a){this.tags.expcss("transition","opacity "+a/1e3+"s linear")},hide:function(a){this.callback=a,this.tags.css({opacity:0})},show:function(a){this.callback=a,this.tags.css({opacity:1})}},JQ:{hide:function(a){this.tag1.fadeOut(this.textFade,a),this.tag2&&this.tag2.fadeOut(this.textFade)},show:function(a){this.tag1.fadeIn(this.textFade,a),this.tag2&&this.tag2.fadeIn(this.textFade)},setFadeDuration:function(a){this.textFade=a}}},e.prototype={spiral:null,text:null,audio:null,lines:[],pos:0,unboundHide:null,unboundShow:null,unboundHover:null,textPause:4e3,filter:function(a){return a.split(/(%\S+)/).map(function(a){if("%"==a[0]){if("%name"==a)return"<Full Name>";if("%fn"==a)return"<First Name>";if("%ln"==a)return"<Last Name>";if("%nn"==a)return"<Nick Name>";if("%oname"==a)return"<Owner Full Name>";if("%ofn"==a)return"<Owner First Name>";if("%oln"==a)return"<Owner Last Name>";i.log("Unhandled substitution: "+a)}return a}).join("")},show:function(){if(this.pos!=this.lines.length){var a=this.filter(this.lines[this.pos]);if(this.pos++,"-"==a[0])return this.handleCommand(a.substring(1));this.text.setText(a),this.text.show(this.unboundHover)}},hover:function(){setTimeout(this.unboundHide,this.textPause)},hide:function(){this.text.hide(this.unboundShow)},addLines:function(a){var b=this.lines.length;$.merge(this.lines,a),this.pos==b&&this.lines.length>b&&this.hide()},clear:function(){this.lines.length,this.lines=[],this.pos=0},handleCommand:function(a){var b;if(b=a.match(/^textcolor\s+<(\d*\.?\d*),\s*(\d*\.?\d*),\s*(\d*\.?\d*)>/))this.text.setColor(parseFloat(b[1]),parseFloat(b[2]),parseFloat(b[3]));else if(b=a.match(/^backgroundcolor\s+<(\d*\.?\d*),\s*(\d*\.?\d*),\s*(\d*\.?\d*)>/))this.spiral.setBackground(parseFloat(b[1])/255,parseFloat(b[2])/255,parseFloat(b[3])/255);else if(b=a.match(/^whirlcolor\s+<(\d*\.?\d*),\s*(\d*\.?\d*),\s*(\d*\.?\d*)>/))this.spiral.setSpiralColor(parseFloat(b[1])/255,parseFloat(b[2])/255,parseFloat(b[3])/255);else if(b=a.match(/^imagesize\s+<(\d*\.?\d*),\s*(\d*\.?\d*),\s*(\d*\.?\d*)>/))this.spiral.setImageScale(parseFloat(b[1]),parseFloat(b[2]));else if(b=a.match(/^imagesize\s+tall$/))this.spiral.setImageScale(.65,.95);else if(b=a.match(/^imagesize\s+wide$/))this.spiral.setImageScale(.95,.65);else{if(b=a.match(/^pause\s+(\d*\.?\d*)/))return setTimeout(this.unboundShow,1e3*parseFloat(b[1])),void 0;if(b=a.match(/^textpause\s+(\d*\.?\d*)/))this.textPause=parseFloat(1e3*b[1]);else if(b=a.match(/^textfade\s+(\d*\.?\d*)/))this.text.setFadeDuration(1e3*parseFloat(b[1]));else if(b=a.match(/^whirlalpha\s+(\d*\.?\d*)/))this.spiral.setSpiralAlpha(parseFloat(b[1]));else if(b=a.match(/^imagealpha\s+(\d*\.?\d*)/))this.spiral.setImageAlpha(parseFloat(b[1]));else if(b=a.match(/^whirlspeed\s+(\d*\.?\d*)/))this.spiral.setRotationPeriod(1/parseFloat(b[1]));else if(b=a.match(/^loopvolume\s+(\d*\.?\d*)/))this.audio.setLoopVolume(parseFloat(b[1]));else if(b=a.match(/^volume\s+(\d*\.?\d*)/))this.audio.setVolume(parseFloat(b[1]));else if(b=a.match(/^whirlimage\s+([^'"()]*)/))this.spiral.setSpiralImage(b[1]);else if(b=a.match(/^image\s+([^'"()]*)/))"no image"==b[1]||"noimage"==b[1]?this.spiral.clearImage():this.spiral.setImage(b[1]);else if(b=a.match(/^loopsound\s+(.*)/))this.audio.playLoop(b[1]);else if(b=a.match(/^sound\s+(.*)/))this.audio.play(b[1]);else if(b=a.match(/^jump\s+(\d+)/))this.pos=parseInt(b[1]);else{if(!(b=a.match(/^rlv\s+(.*)/)))return i.log("Unhandled command: "+a),this.text.setText("-"+a),this.text.show(this.unboundHover),void 0;i.log("Attempting to voodoo the viewer with RLRLV: "+b[1])}}this.show()}},f.prototype={abort:function(){}},g.prototype={abort:function(){void 0!==this.req&&(this.req.abort(),this.req=void 0)}},h.prototype={abort:function(){void 0!==this.fileReader&&this.fileReader.abort()}},$(document).ready(function(){var i,j,k,l,m;try{i=new a}catch(n){i=new c}try{j=new b}catch(n){}k=new d,l=new e(i,k,j);try{m=new f(l)}catch(n){m=new g("1.txt",l)}var o=$(document.body);o.on("dragover",function(a){var b=a.originalEvent.dataTransfer,c=b.items;1==c.length&&"file"===c[0].kind&&(a.stopPropagation(),a.preventDefault(),b.dropEffect="copy")}),o.on("drop",function(a){a.stopPropagation(),a.preventDefault();var b=a.originalEvent.dataTransfer.items[0].getAsFile();m.abort(),l.clear(),m=new h(b,l)})})}();