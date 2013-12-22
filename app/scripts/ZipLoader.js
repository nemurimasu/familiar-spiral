define(['jszip-inflate'], function(JSZip) {
    'use strict';
    return function(zipFile, scriptSource, reader) {
        if (scriptSource.aborted) {
            return;
        }
        var fileReader = new FileReader();
        fileReader.onload = function(result) {
            scriptSource.connect(null);
            var zip = new JSZip(result.target.result);

            var bestName = zipFile.name.replace(/\.[^\.]*$/, '.txt').toLowerCase();
            var scriptName;
            for (var potentialScript in zip.files) {
                if (zip.files[potentialScript].options.dir) {
                    continue;
                }
                if (potentialScript.toLowerCase() === bestName) {
                    scriptName = potentialScript;
                    break;
                }
                if (potentialScript.match(/^[^\/]*\.txt$/i)) {
                    scriptName = potentialScript;
                }
            }

            var data = {};
            for (var fileName in zip.files) {
                if (fileName === scriptName) {
                    continue;
                }
                if (zip.files[fileName].options.dir) {
                    continue;
                }
                var extMatch = fileName.match(/\.[^\.]*$/);
                if (!extMatch) {
                    continue;
                }
                var ext = extMatch[0].toLowerCase();
                var mime;
                if (ext === '.png') {
                    mime = 'image/png';
                } else if (ext === '.jpg' || ext === '.jpeg') {
                    mime = 'image/jpeg';
                } else if (ext === '.webp') {
                    mime = 'image/webp';
                } else if (ext === '.ogg') {
                    mime = 'application/ogg';
                } else if (ext === '.mp3') {
                    mime = 'audio/mp3';
                }
                if (!mime) {
                    continue;
                }
                if (JSZip.support.arraybuffer && Modernizr.blobconstructor) {
                    var bytes = zip.files[fileName].asArrayBuffer();
                    var blob = new Blob([bytes], {type: mime});
                    data[fileName] = window.URL.createObjectURL(blob);
                } else {
                    data[fileName] = 'data:' + mime + ';base64,' + btoa(zip.files[fileName].asBinary());
                }
            }

            reader.translateUrl = function(url) {
                if (url.match(/^[^\/]+:\/\//)) {
                    return url;
                }
                var mapped = data[url];
                if (mapped) {
                    return mapped;
                }
                return url;
            };

            reader.addLines(zip.files[scriptName].asText().split('\n').map(function(v) { return v.trim(); }));
        };
        scriptSource.connect(fileReader.abort.bind(fileReader));
        if (JSZip.support.arraybuffer) {
            fileReader.readAsArrayBuffer(zipFile);
        } else {
            fileReader.ReadAsBinaryString(zipFile);
        }
    };
});
