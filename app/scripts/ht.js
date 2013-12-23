define(['jquery', 'Audio/Native', 'Spiral/WebGl', 'Spiral/Native', 'TextHandler', 'ScriptReader', 'ScriptSource/Tag', 'ScriptSource/Ajax', 'ScriptSource/File', 'ScriptSource/Late'], function($, NativeAudio, WebGlSpiral, NativeSpiral, TextHandler, ScriptReader, TagScriptSource, AjaxScriptSource, FileScriptSource, LateScriptSource) {
    'use strict';

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

        function receiveFiles(files) {
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
                for (var childIndex = 0; childIndex < files.length; childIndex++) {
                    var child = files[childIndex];
                    processEntry(child[getAsEntry].bind(child)());
                }
            } else {
                for (var fileIndex = 0; fileIndex < files.length; fileIndex++) {
                    var file = files[fileIndex];
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
                    } else if (path.match(/\.zip$/i) || urls[path].type === 'application/zip') {
                        myScore = 2;
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
                    for (var fullPath in urls) {
                        var stripped = fullPath.match(/([^\/]+)\/(.*)$/);
                        if (stripped[1] === leader[0]) {
                            relative[stripped[2]] = urls[fullPath];
                        }
                    }
                } else {
                    relative = urls;
                }

                scriptSource.abort();
                reader.reset();

                var scriptFile = urls[script];
                if (scriptFile.name.match(/\.zip$/i) || scriptFile.type === 'application/zip') {
                    scriptSource = new LateScriptSource();
                    require(['ZipLoader'], function(zipLoader) {
                        zipLoader(scriptFile, scriptSource, reader);
                    });
                } else {
                    reader.translateUrl = function(url) {
                        if (url.match(/^[^\/]+:\/\//)) {
                            return url;
                        }
                        var mapped = relative[url];
                        if (mapped) {
                            return window.URL.createObjectURL(mapped);
                        }
                        return url;
                    };
                    scriptSource = new FileScriptSource(scriptFile, reader);
                }
            });
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

            receiveFiles(event.originalEvent.dataTransfer.items || event.originalEvent.dataTransfer.files);
        });
        var requestFullscreen = Modernizr.prefixed('requestFullscreen', document.body) || Modernizr.prefixed('requestFullScreen', document.body);
        if (requestFullscreen) {
            requestFullscreen = requestFullscreen.bind(document.body);
            $('#toolbar a[href="#enter-fullscreen"]').click(function(event) {
                event.stopPropagation();
                event.preventDefault();

                requestFullscreen();
            });
        }
        var cancelFullscreen = Modernizr.prefixed('cancelFullscreen', document) || Modernizr.prefixed('cancelFullScreen', document) || Modernizr.prefixed('exitFullscreen', document) || Modernizr.prefixed('exitFullScreen', document);
        if (cancelFullscreen) {
            cancelFullscreen = cancelFullscreen.bind(document);
            $('#toolbar a[href="#exit-fullscreen"]').click(function(event) {
                event.stopPropagation();
                event.preventDefault();

                cancelFullscreen();
            });
        }
        $('#toolbar a[href="#open"]').click(function(event) {
            event.stopPropagation();
            event.preventDefault();

            $('#file-dialog').show();
        });
        $('#file-dialog [name="files"]').change(function() {
            if (this.files.length) {
                receiveFiles(this.files);
                $('#file-dialog form')[0].reset();
                $('#file-dialog').hide();
            }
        });
        $('#file-dialog [name="cancel"]').click(function(event) {
            event.stopPropagation();
            event.preventDefault();

            $('#file-dialog').hide();
        });
    });
    if (Modernizr.draganddrop) {
        // kick this off early so it should be ready before the user wants it
        require(['ZipLoader']);
    }
});
