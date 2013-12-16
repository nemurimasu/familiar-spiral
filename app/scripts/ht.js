define(['jquery', 'Audio/Native', 'Spiral/WebGl', 'Spiral/Native', 'TextHandler', 'ScriptReader', 'ScriptSource/Tag', 'ScriptSource/Ajax', 'ScriptSource/File'], function($, NativeAudio, WebGlSpiral, NativeSpiral, TextHandler, ScriptReader, TagScriptSource, AjaxScriptSource, FileScriptSource) {
  var console = window.console;
  if (console === undefined)
    console = {};
  if (console.log === undefined)
    console.log = function(){};

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
      var types = dt.types;
      for (var i = 0; i < types.length; i++) {
        if (types[i] === 'Files') {
          event.stopPropagation();
          event.preventDefault();
          dt.dropEffect = 'copy';
          return;
        }
      }
    });
    body.on('drop', function(event) {
      event.stopPropagation();
      event.preventDefault();

      var files = event.originalEvent.dataTransfer.items || event.originalEvent.dataTransfer.files;
      var urls = {};
      var pending = 1;
      var promise = $.Deferred();

      var processFile = function(file, name) {
        urls[name] = file;
      };

      var getAsEntry = Modernizr.prefixed('getAsEntry', files[0], false);
      if (getAsEntry) {
        var processEntry = function(entry) {
          pending++;
          if (entry.isDirectory) {
            var dirReader = entry.createReader();
            dirReader.readEntries(function(entries) {
              for (var i = 0; i < entries.length; i++) {
                processEntry(entries[i]);
              }
              if (--pending === 0) {
                promise.resolve();
              }
            }, function(err) {
              promise.reject(err);
            });
          } else if (entry.isFile) {
            entry.file(function(file) {
              processFile(file, entry.fullPath.substring(1));
              if (--pending === 0) {
                promise.resolve();
              }
            }, function(err) {
              promise.reject(err);
            });
          }
        };
        for (var i = 0; i < files.length; i++) {
          var file = files[i];
          processEntry(file[getAsEntry].bind(file)());
        }
      } else {
        for (var i = 0; i < files.length; i++) {
          var file = files[i];
          if (file.getAsFile) {
            // if we used .files instead of .items then we don't need to do this
            file = file.getAsFile();
          }
          processFile(file, file.name);
        }
      }
      if (--pending === 0) {
        promise.resolve();
      }
      promise.done(function() {
        var script = null;
        var scriptScore = 0;
        for (var path in urls) {
          var myScore = 1;
          if (path.match(/\.txt$/i)) {
            myScore = 100;
          } else if (urls[path].type.match(/^text\//)) {
            myScore = 10;
          }
          if (!path.match(/\//)) {
            myScore *= 10;
          } else if (path.match(/^([^\/]+)\/\1(?:\.|$)/)) {
            myScore *= 5;
          }
          if (myScore > scriptScore) {
            script = path;
            scriptScore = myScore;
          }
        }
        var relative = {};
        var leader = script.match(/[^\/]+\//);
        if (leader) {
          relative = {};
          for (var path in urls) {
            var stripped = path.match(/([^\/]+)\/(.*)$/);
            if (stripped[1] === leader[0]) {
              relative[stripped[2]] = urls[path];
            }
          }
        } else {
          relative = urls;
        }
        scriptSource.abort();
        reader.reset();
        reader.translateUrl = function(url) {
          if (url.match(/^[^\/]+:\/\//)) {
            return url;
          }
          var mapped = relative[url];
          if (mapped) {
            return URL.createObjectURL(mapped);
          }
          return url;
        };
        scriptSource = new FileScriptSource(urls[script], reader);
      });
    });
  });
});
