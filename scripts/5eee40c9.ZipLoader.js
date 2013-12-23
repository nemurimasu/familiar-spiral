var JSZip=function(t,e){this.files={},this.root="",t&&this.load(t,e)};JSZip.signature={LOCAL_FILE_HEADER:"PK",CENTRAL_FILE_HEADER:"PK",CENTRAL_DIRECTORY_END:"PK",ZIP64_CENTRAL_DIRECTORY_LOCATOR:"PK",ZIP64_CENTRAL_DIRECTORY_END:"PK",DATA_DESCRIPTOR:"PK\b"},JSZip.defaults={base64:!1,binary:!1,dir:!1,date:null,compression:null},JSZip.support={arraybuffer:function(){return"undefined"!=typeof ArrayBuffer&&"undefined"!=typeof Uint8Array}(),nodebuffer:function(){return"undefined"!=typeof Buffer}(),uint8array:function(){return"undefined"!=typeof Uint8Array}(),blob:function(){if("undefined"==typeof ArrayBuffer)return!1;var t=new ArrayBuffer(0);try{return 0===new Blob([t],{type:"application/zip"}).size}catch(e){}try{var r=window.BlobBuilder||window.WebKitBlobBuilder||window.MozBlobBuilder||window.MSBlobBuilder,i=new r;return i.append(t),0===i.getBlob("application/zip").size}catch(e){}return!1}()},JSZip.prototype=function(){var t,e;JSZip.support.uint8array&&"function"==typeof TextEncoder&&"function"==typeof TextDecoder&&(t=new TextEncoder("utf-8"),e=new TextDecoder("utf-8"));var r=function(t){if(t._data instanceof JSZip.CompressedObject&&(t._data=t._data.getContent(),t.options.binary=!0,t.options.base64=!1,"uint8array"===JSZip.utils.getTypeOf(t._data))){var e=t._data;t._data=new Uint8Array(e.length),0!==e.length&&t._data.set(e,0)}return t._data},i=function(e){var i=r(e),n=JSZip.utils.getTypeOf(i);if("string"===n){if(!e.options.binary){if(t)return t.encode(i);if(JSZip.support.nodebuffer)return new Buffer(i,"utf-8")}return e.asBinary()}return i},n=function(t){var e=r(this);return null===e||"undefined"==typeof e?"":(this.options.base64&&(e=JSZip.base64.decode(e)),e=t&&this.options.binary?JSZip.prototype.utf8decode(e):JSZip.utils.transformTo("string",e),t||this.options.binary||(e=JSZip.prototype.utf8encode(e)),e)},s=function(t,e,r){this.name=t,this._data=e,this.options=r};s.prototype={asText:function(){return n.call(this,!0)},asBinary:function(){return n.call(this,!1)},asNodeBuffer:function(){var t=i(this);return JSZip.utils.transformTo("nodebuffer",t)},asUint8Array:function(){var t=i(this);return JSZip.utils.transformTo("uint8array",t)},asArrayBuffer:function(){return this.asUint8Array().buffer}};var a=function(t,e){var r,i="";for(r=0;e>r;r++)i+=String.fromCharCode(255&t),t>>>=8;return i},o=function(){var t,e,r={};for(t=0;t<arguments.length;t++)for(e in arguments[t])arguments[t].hasOwnProperty(e)&&"undefined"==typeof r[e]&&(r[e]=arguments[t][e]);return r},f=function(t){return t=t||{},t.base64===!0&&null==t.binary&&(t.binary=!0),t=o(t,JSZip.defaults),t.date=t.date||new Date,null!==t.compression&&(t.compression=t.compression.toUpperCase()),t},u=function(t,e,r){var i=h(t),n=JSZip.utils.getTypeOf(e);if(i&&d.call(this,i),r=f(r),r.dir||null===e||"undefined"==typeof e)r.base64=!1,r.binary=!1,e=null;else if("string"===n)r.binary&&!r.base64&&r.optimizedBinaryString!==!0&&(e=JSZip.utils.string2binary(e));else{if(r.base64=!1,r.binary=!0,!(n||e instanceof JSZip.CompressedObject))throw new Error("The data of '"+t+"' is in an unsupported format !");"arraybuffer"===n&&(e=JSZip.utils.transformTo("uint8array",e))}var a=new s(t,e,r);return this.files[t]=a,a},h=function(t){"/"==t.slice(-1)&&(t=t.substring(0,t.length-1));var e=t.lastIndexOf("/");return e>0?t.substring(0,e):""},d=function(t){return"/"!=t.slice(-1)&&(t+="/"),this.files[t]||u.call(this,t,null,{dir:!0}),this.files[t]},c=function(t,e){var r,n=new JSZip.CompressedObject;return t._data instanceof JSZip.CompressedObject?(n.uncompressedSize=t._data.uncompressedSize,n.crc32=t._data.crc32,0===n.uncompressedSize||t.options.dir?(e=JSZip.compressions.STORE,n.compressedContent="",n.crc32=0):t._data.compressionMethod===e.magic?n.compressedContent=t._data.getCompressedContent():(r=t._data.getContent(),n.compressedContent=e.compress(JSZip.utils.transformTo(e.compressInputType,r)))):(r=i(t),(!r||0===r.length||t.options.dir)&&(e=JSZip.compressions.STORE,r=""),n.uncompressedSize=r.length,n.crc32=this.crc32(r),n.compressedContent=e.compress(JSZip.utils.transformTo(e.compressInputType,r))),n.compressedSize=n.compressedContent.length,n.compressionMethod=e.magic,n},p=function(t,e,r,i){var n,s,o=(r.compressedContent,this.utf8encode(e.name)),f=o!==e.name,u=e.options;n=u.date.getHours(),n<<=6,n|=u.date.getMinutes(),n<<=5,n|=u.date.getSeconds()/2,s=u.date.getFullYear()-1980,s<<=4,s|=u.date.getMonth()+1,s<<=5,s|=u.date.getDate();var h="";h+="\n\x00",h+=f?"\x00\b":"\x00\x00",h+=r.compressionMethod,h+=a(n,2),h+=a(s,2),h+=a(r.crc32,4),h+=a(r.compressedSize,4),h+=a(r.uncompressedSize,4),h+=a(o.length,2),h+="\x00\x00";var d=JSZip.signature.LOCAL_FILE_HEADER+h+o,c=JSZip.signature.CENTRAL_FILE_HEADER+"\x00"+h+"\x00\x00"+"\x00\x00"+"\x00\x00"+(e.options.dir===!0?"\x00\x00\x00":"\x00\x00\x00\x00")+a(i,4)+o;return{fileRecord:d,dirRecord:c,compressedObject:r}},l=function(){this.data=[]};l.prototype={append:function(t){t=JSZip.utils.transformTo("string",t),this.data.push(t)},finalize:function(){return this.data.join("")}};var y=function(t){this.data=new Uint8Array(t),this.index=0};return y.prototype={append:function(t){0!==t.length&&(t=JSZip.utils.transformTo("uint8array",t),this.data.set(t,this.index),this.index+=t.length)},finalize:function(){return this.data}},{load:function(){throw new Error("Load method is not defined. Is the file jszip-load.js included ?")},filter:function(t){var e,r,i,n,a=[];for(e in this.files)this.files.hasOwnProperty(e)&&(i=this.files[e],n=new s(i.name,i._data,o(i.options)),r=e.slice(this.root.length,e.length),e.slice(0,this.root.length)===this.root&&t(r,n)&&a.push(n));return a},file:function(t,e,r){if(1===arguments.length){if(JSZip.utils.isRegExp(t)){var i=t;return this.filter(function(t,e){return!e.options.dir&&i.test(t)})}return this.filter(function(e,r){return!r.options.dir&&e===t})[0]||null}return t=this.root+t,u.call(this,t,e,r),this},folder:function(t){if(!t)return this;if(JSZip.utils.isRegExp(t))return this.filter(function(e,r){return r.options.dir&&t.test(e)});var e=this.root+t,r=d.call(this,e),i=this.clone();return i.root=r.name,i},remove:function(t){t=this.root+t;var e=this.files[t];if(e||("/"!=t.slice(-1)&&(t+="/"),e=this.files[t]),e)if(e.options.dir)for(var r=this.filter(function(e,r){return r.name.slice(0,t.length)===t}),i=0;i<r.length;i++)delete this.files[r[i].name];else delete this.files[t];return this},generate:function(t){t=o(t||{},{base64:!0,compression:"STORE",type:"base64"}),JSZip.utils.checkSupport(t.type);var e,r,i=[],n=0,s=0;for(var f in this.files)if(this.files.hasOwnProperty(f)){var u=this.files[f],h=u.options.compression||t.compression.toUpperCase(),d=JSZip.compressions[h];if(!d)throw new Error(h+" is not a valid compression method !");var g=c.call(this,u,d),m=p.call(this,f,u,g,n);n+=m.fileRecord.length+g.compressedSize,s+=m.dirRecord.length,i.push(m)}var b="";switch(b=JSZip.signature.CENTRAL_DIRECTORY_END+"\x00\x00"+"\x00\x00"+a(i.length,2)+a(i.length,2)+a(s,4)+a(n,4)+"\x00\x00",t.type.toLowerCase()){case"uint8array":case"arraybuffer":case"blob":case"nodebuffer":e=new y(n+s+b.length);break;default:e=new l(n+s+b.length)}for(r=0;r<i.length;r++)e.append(i[r].fileRecord),e.append(i[r].compressedObject.compressedContent);for(r=0;r<i.length;r++)e.append(i[r].dirRecord);e.append(b);var S=e.finalize();switch(t.type.toLowerCase()){case"uint8array":case"arraybuffer":case"nodebuffer":return JSZip.utils.transformTo(t.type.toLowerCase(),S);case"blob":return JSZip.utils.arrayBuffer2Blob(JSZip.utils.transformTo("arraybuffer",S));case"base64":return t.base64?JSZip.base64.encode(S):S;default:return S}},crc32:function(t,e){if("undefined"==typeof t||!t.length)return 0;var r="string"!==JSZip.utils.getTypeOf(t),i=[0,1996959894,3993919788,2567524794,124634137,1886057615,3915621685,2657392035,249268274,2044508324,3772115230,2547177864,162941995,2125561021,3887607047,2428444049,498536548,1789927666,4089016648,2227061214,450548861,1843258603,4107580753,2211677639,325883990,1684777152,4251122042,2321926636,335633487,1661365465,4195302755,2366115317,997073096,1281953886,3579855332,2724688242,1006888145,1258607687,3524101629,2768942443,901097722,1119000684,3686517206,2898065728,853044451,1172266101,3705015759,2882616665,651767980,1373503546,3369554304,3218104598,565507253,1454621731,3485111705,3099436303,671266974,1594198024,3322730930,2970347812,795835527,1483230225,3244367275,3060149565,1994146192,31158534,2563907772,4023717930,1907459465,112637215,2680153253,3904427059,2013776290,251722036,2517215374,3775830040,2137656763,141376813,2439277719,3865271297,1802195444,476864866,2238001368,4066508878,1812370925,453092731,2181625025,4111451223,1706088902,314042704,2344532202,4240017532,1658658271,366619977,2362670323,4224994405,1303535960,984961486,2747007092,3569037538,1256170817,1037604311,2765210733,3554079995,1131014506,879679996,2909243462,3663771856,1141124467,855842277,2852801631,3708648649,1342533948,654459306,3188396048,3373015174,1466479909,544179635,3110523913,3462522015,1591671054,702138776,2966460450,3352799412,1504918807,783551873,3082640443,3233442989,3988292384,2596254646,62317068,1957810842,3939845945,2647816111,81470997,1943803523,3814918930,2489596804,225274430,2053790376,3826175755,2466906013,167816743,2097651377,4027552580,2265490386,503444072,1762050814,4150417245,2154129355,426522225,1852507879,4275313526,2312317920,282753626,1742555852,4189708143,2394877945,397917763,1622183637,3604390888,2714866558,953729732,1340076626,3518719985,2797360999,1068828381,1219638859,3624741850,2936675148,906185462,1090812512,3747672003,2825379669,829329135,1181335161,3412177804,3160834842,628085408,1382605366,3423369109,3138078467,570562233,1426400815,3317316542,2998733608,733239954,1555261956,3268935591,3050360625,752459403,1541320221,2607071920,3965973030,1969922972,40735498,2617837225,3943577151,1913087877,83908371,2512341634,3803740692,2075208622,213261112,2463272603,3855990285,2094854071,198958881,2262029012,4057260610,1759359992,534414190,2176718541,4139329115,1873836001,414664567,2282248934,4279200368,1711684554,285281116,2405801727,4167216745,1634467795,376229701,2685067896,3608007406,1308918612,956543938,2808555105,3495958263,1231636301,1047427035,2932959818,3654703836,1088359270,936918e3,2847714899,3736837829,1202900863,817233897,3183342108,3401237130,1404277552,615818150,3134207493,3453421203,1423857449,601450431,3009837614,3294710456,1567103746,711928724,3020668471,3272380065,1510334235,755167117];"undefined"==typeof e&&(e=0);var n=0,s=0,a=0;e=-1^e;for(var o=0,f=t.length;f>o;o++)a=r?t[o]:t.charCodeAt(o),s=255&(e^a),n=i[s],e=e>>>8^n;return-1^e},clone:function(){var t=new JSZip;for(var e in this)"function"!=typeof this[e]&&(t[e]=this[e]);return t},utf8encode:function(e){if(t){var r=t.encode(e);return JSZip.utils.transformTo("string",r)}if(JSZip.support.nodebuffer)return JSZip.utils.transformTo("string",new Buffer(e,"utf-8"));for(var i=[],n=0,s=0;s<e.length;s++){var a=e.charCodeAt(s);128>a?i[n++]=String.fromCharCode(a):a>127&&2048>a?(i[n++]=String.fromCharCode(192|a>>6),i[n++]=String.fromCharCode(128|63&a)):(i[n++]=String.fromCharCode(224|a>>12),i[n++]=String.fromCharCode(128|63&a>>6),i[n++]=String.fromCharCode(128|63&a))}return i.join("")},utf8decode:function(t){var r=[],i=0,n=JSZip.utils.getTypeOf(t),s="string"!==n,a=0,o=0,f=0,u=0;if(e)return e.decode(JSZip.utils.transformTo("uint8array",t));if(JSZip.support.nodebuffer)return JSZip.utils.transformTo("nodebuffer",t).toString("utf-8");for(;a<t.length;)o=s?t[a]:t.charCodeAt(a),128>o?(r[i++]=String.fromCharCode(o),a++):o>191&&224>o?(f=s?t[a+1]:t.charCodeAt(a+1),r[i++]=String.fromCharCode((31&o)<<6|63&f),a+=2):(f=s?t[a+1]:t.charCodeAt(a+1),u=s?t[a+2]:t.charCodeAt(a+2),r[i++]=String.fromCharCode((15&o)<<12|(63&f)<<6|63&u),a+=3);return r.join("")}}}(),JSZip.compressions={STORE:{magic:"\x00\x00",compress:function(t){return t},uncompress:function(t){return t},compressInputType:null,uncompressInputType:null}},function(){function t(t){return t}function e(t,e){for(var r=0;r<t.length;++r)e[r]=255&t.charCodeAt(r);return e}function r(t){var e=65536,r=[],i=t.length,n=JSZip.utils.getTypeOf(t),s=0,a=!0;try{switch(n){case"uint8array":String.fromCharCode.apply(null,new Uint8Array(0));break;case"nodebuffer":String.fromCharCode.apply(null,new Buffer(0))}}catch(o){a=!1}if(!a){for(var f="",u=0;u<t.length;u++)f+=String.fromCharCode(t[u]);return f}for(;i>s&&e>1;)try{"array"===n||"nodebuffer"===n?r.push(String.fromCharCode.apply(null,t.slice(s,Math.min(s+e,i)))):r.push(String.fromCharCode.apply(null,t.subarray(s,Math.min(s+e,i)))),s+=e}catch(o){e=Math.floor(e/2)}return r.join("")}function i(t,e){for(var r=0;r<t.length;r++)e[r]=t[r];return e}JSZip.utils={string2binary:function(t){for(var e="",r=0;r<t.length;r++)e+=String.fromCharCode(255&t.charCodeAt(r));return e},string2Uint8Array:function(t){return JSZip.utils.transformTo("uint8array",t)},uint8Array2String:function(t){return JSZip.utils.transformTo("string",t)},arrayBuffer2Blob:function(t){JSZip.utils.checkSupport("blob");try{return new Blob([t],{type:"application/zip"})}catch(e){}try{var r=window.BlobBuilder||window.WebKitBlobBuilder||window.MozBlobBuilder||window.MSBlobBuilder,i=new r;return i.append(t),i.getBlob("application/zip")}catch(e){}throw new Error("Bug : can't construct the Blob.")},string2Blob:function(t){var e=JSZip.utils.transformTo("arraybuffer",t);return JSZip.utils.arrayBuffer2Blob(e)}};var n={};n.string={string:t,array:function(t){return e(t,new Array(t.length))},arraybuffer:function(t){return n.string.uint8array(t).buffer},uint8array:function(t){return e(t,new Uint8Array(t.length))},nodebuffer:function(t){return e(t,new Buffer(t.length))}},n.array={string:r,array:t,arraybuffer:function(t){return new Uint8Array(t).buffer},uint8array:function(t){return new Uint8Array(t)},nodebuffer:function(t){return new Buffer(t)}},n.arraybuffer={string:function(t){return r(new Uint8Array(t))},array:function(t){return i(new Uint8Array(t),new Array(t.byteLength))},arraybuffer:t,uint8array:function(t){return new Uint8Array(t)},nodebuffer:function(t){return new Buffer(new Uint8Array(t))}},n.uint8array={string:r,array:function(t){return i(t,new Array(t.length))},arraybuffer:function(t){return t.buffer},uint8array:t,nodebuffer:function(t){return new Buffer(t)}},n.nodebuffer={string:r,array:function(t){return i(t,new Array(t.length))},arraybuffer:function(t){return n.nodebuffer.uint8array(t).buffer},uint8array:function(t){return i(t,new Uint8Array(t.length))},nodebuffer:t},JSZip.utils.transformTo=function(t,e){if(e||(e=""),!t)return e;JSZip.utils.checkSupport(t);var r=JSZip.utils.getTypeOf(e),i=n[r][t](e);return i},JSZip.utils.getTypeOf=function(t){return"string"==typeof t?"string":"[object Array]"===Object.prototype.toString.call(t)?"array":JSZip.support.nodebuffer&&Buffer.isBuffer(t)?"nodebuffer":JSZip.support.uint8array&&t instanceof Uint8Array?"uint8array":JSZip.support.arraybuffer&&t instanceof ArrayBuffer?"arraybuffer":void 0},JSZip.utils.isRegExp=function(t){return"[object RegExp]"===Object.prototype.toString.call(t)},JSZip.utils.checkSupport=function(t){var e=!0;switch(t.toLowerCase()){case"uint8array":e=JSZip.support.uint8array;break;case"arraybuffer":e=JSZip.support.arraybuffer;break;case"nodebuffer":e=JSZip.support.nodebuffer;break;case"blob":e=JSZip.support.blob}if(!e)throw new Error(t+" is not supported by this browser")}}(),function(){JSZip.CompressedObject=function(){this.compressedSize=0,this.uncompressedSize=0,this.crc32=0,this.compressionMethod=null,this.compressedContent=null},JSZip.CompressedObject.prototype={getContent:function(){return null},getCompressedContent:function(){return null}}}(),JSZip.base64=function(){var t="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";return{encode:function(e){for(var r,i,n,s,a,o,f,u="",h=0;h<e.length;)r=e.charCodeAt(h++),i=e.charCodeAt(h++),n=e.charCodeAt(h++),s=r>>2,a=(3&r)<<4|i>>4,o=(15&i)<<2|n>>6,f=63&n,isNaN(i)?o=f=64:isNaN(n)&&(f=64),u=u+t.charAt(s)+t.charAt(a)+t.charAt(o)+t.charAt(f);return u},decode:function(e){var r,i,n,s,a,o,f,u="",h=0;for(e=e.replace(/[^A-Za-z0-9\+\/\=]/g,"");h<e.length;)s=t.indexOf(e.charAt(h++)),a=t.indexOf(e.charAt(h++)),o=t.indexOf(e.charAt(h++)),f=t.indexOf(e.charAt(h++)),r=s<<2|a>>4,i=(15&a)<<4|o>>2,n=(3&o)<<6|f,u+=String.fromCharCode(r),64!=o&&(u+=String.fromCharCode(i)),64!=f&&(u+=String.fromCharCode(n));return u}}}(),define("jszip",function(t){return function(){var e;return e||t.JSZip}}(this)),function(t){"use strict";function e(){this.data=null,this.length=0,this.index=0}function r(t,e){this.data=t,e||(this.data=o.utils.string2binary(this.data)),this.length=this.data.length,this.index=0}function i(t){t&&(this.data=t,this.length=this.data.length,this.index=0)}function n(t){this.data=t,this.length=this.data.length,this.index=0}function s(t,e){this.options=t,this.loadOptions=e}function a(t,e){this.files=[],this.loadOptions=e,t&&this.load(t)}var o=t.JSZip,f=65535,u=-1,h=function(t){var e,r,i="";for(r=0;r<(t||"").length;r++)e=t.charCodeAt(r),i+="\\x"+(16>e?"0":"")+e.toString(16).toUpperCase();return i},d=function(t){for(var e in o.compressions)if(o.compressions.hasOwnProperty(e)&&o.compressions[e].magic===t)return o.compressions[e];return null};e.prototype={checkOffset:function(t){this.checkIndex(this.index+t)},checkIndex:function(t){if(this.length<t||0>t)throw new Error("End of data reached (data length = "+this.length+", asked index = "+t+"). Corrupted zip ?")},setIndex:function(t){this.checkIndex(t),this.index=t},skip:function(t){this.setIndex(this.index+t)},byteAt:function(){},readInt:function(t){var e,r=0;for(this.checkOffset(t),e=this.index+t-1;e>=this.index;e--)r=(r<<8)+this.byteAt(e);return this.index+=t,r},readString:function(t){return o.utils.transformTo("string",this.readData(t))},readData:function(){},lastIndexOfSignature:function(){},readDate:function(){var t=this.readInt(4);return new Date((127&t>>25)+1980,(15&t>>21)-1,31&t>>16,31&t>>11,63&t>>5,(31&t)<<1)}},r.prototype=new e,r.prototype.byteAt=function(t){return this.data.charCodeAt(t)},r.prototype.lastIndexOfSignature=function(t){return this.data.lastIndexOf(t)},r.prototype.readData=function(t){this.checkOffset(t);var e=this.data.slice(this.index,this.index+t);return this.index+=t,e},i.prototype=new e,i.prototype.byteAt=function(t){return this.data[t]},i.prototype.lastIndexOfSignature=function(t){for(var e=t.charCodeAt(0),r=t.charCodeAt(1),i=t.charCodeAt(2),n=t.charCodeAt(3),s=this.length-4;s>=0;--s)if(this.data[s]===e&&this.data[s+1]===r&&this.data[s+2]===i&&this.data[s+3]===n)return s;return-1},i.prototype.readData=function(t){this.checkOffset(t);var e=this.data.subarray(this.index,this.index+t);return this.index+=t,e},n.prototype=new i,n.prototype.readData=function(t){this.checkOffset(t);var e=this.data.slice(this.index,this.index+t);return this.index+=t,e},s.prototype={isEncrypted:function(){return 1===(1&this.bitFlag)},useUTF8:function(){return 2048===(2048&this.bitFlag)},prepareCompressedContent:function(t,e,r){return function(){var i=t.index;t.setIndex(e);var n=t.readData(r);return t.setIndex(i),n}},prepareContent:function(t,e,r,i,n){return function(){var t=o.utils.transformTo(i.uncompressInputType,this.getCompressedContent()),e=i.uncompress(t);if(e.length!==n)throw new Error("Bug : uncompressed data size mismatch");return e}},readLocalPart:function(t){var e,r;if(t.skip(22),this.fileNameLength=t.readInt(2),r=t.readInt(2),this.fileName=t.readString(this.fileNameLength),t.skip(r),-1==this.compressedSize||-1==this.uncompressedSize)throw new Error("Bug or corrupted zip : didn't get enough informations from the central directory (compressedSize == -1 || uncompressedSize == -1)");if(e=d(this.compressionMethod),null===e)throw new Error("Corrupted zip : compression "+h(this.compressionMethod)+" unknown (inner file : "+this.fileName+")");if(this.decompressed=new o.CompressedObject,this.decompressed.compressedSize=this.compressedSize,this.decompressed.uncompressedSize=this.uncompressedSize,this.decompressed.crc32=this.crc32,this.decompressed.compressionMethod=this.compressionMethod,this.decompressed.getCompressedContent=this.prepareCompressedContent(t,t.index,this.compressedSize,e),this.decompressed.getContent=this.prepareContent(t,t.index,this.compressedSize,e,this.uncompressedSize),this.loadOptions.checkCRC32&&(this.decompressed=o.utils.transformTo("string",this.decompressed.getContent()),o.prototype.crc32(this.decompressed)!==this.crc32))throw new Error("Corrupted zip : CRC32 mismatch")},readCentralPart:function(t){if(this.versionMadeBy=t.readString(2),this.versionNeeded=t.readInt(2),this.bitFlag=t.readInt(2),this.compressionMethod=t.readString(2),this.date=t.readDate(),this.crc32=t.readInt(4),this.compressedSize=t.readInt(4),this.uncompressedSize=t.readInt(4),this.fileNameLength=t.readInt(2),this.extraFieldsLength=t.readInt(2),this.fileCommentLength=t.readInt(2),this.diskNumberStart=t.readInt(2),this.internalFileAttributes=t.readInt(2),this.externalFileAttributes=t.readInt(4),this.localHeaderOffset=t.readInt(4),this.isEncrypted())throw new Error("Encrypted zip are not supported");this.fileName=t.readString(this.fileNameLength),this.readExtraFields(t),this.parseZIP64ExtraField(t),this.fileComment=t.readString(this.fileCommentLength),this.dir=16&this.externalFileAttributes?!0:!1},parseZIP64ExtraField:function(){if(this.extraFields[1]){var t=new r(this.extraFields[1].value);this.uncompressedSize===u&&(this.uncompressedSize=t.readInt(8)),this.compressedSize===u&&(this.compressedSize=t.readInt(8)),this.localHeaderOffset===u&&(this.localHeaderOffset=t.readInt(8)),this.diskNumberStart===u&&(this.diskNumberStart=t.readInt(4))}},readExtraFields:function(t){var e,r,i,n=t.index;for(this.extraFields=this.extraFields||{};t.index<n+this.extraFieldsLength;)e=t.readInt(2),r=t.readInt(2),i=t.readString(r),this.extraFields[e]={id:e,length:r,value:i}},handleUTF8:function(){this.useUTF8()&&(this.fileName=o.prototype.utf8decode(this.fileName),this.fileComment=o.prototype.utf8decode(this.fileComment))}},a.prototype={checkSignature:function(t){var e=this.reader.readString(4);if(e!==t)throw new Error("Corrupted zip or bug : unexpected signature ("+h(e)+", expected "+h(t)+")")},readBlockEndOfCentral:function(){this.diskNumber=this.reader.readInt(2),this.diskWithCentralDirStart=this.reader.readInt(2),this.centralDirRecordsOnThisDisk=this.reader.readInt(2),this.centralDirRecords=this.reader.readInt(2),this.centralDirSize=this.reader.readInt(4),this.centralDirOffset=this.reader.readInt(4),this.zipCommentLength=this.reader.readInt(2),this.zipComment=this.reader.readString(this.zipCommentLength)},readBlockZip64EndOfCentral:function(){this.zip64EndOfCentralSize=this.reader.readInt(8),this.versionMadeBy=this.reader.readString(2),this.versionNeeded=this.reader.readInt(2),this.diskNumber=this.reader.readInt(4),this.diskWithCentralDirStart=this.reader.readInt(4),this.centralDirRecordsOnThisDisk=this.reader.readInt(8),this.centralDirRecords=this.reader.readInt(8),this.centralDirSize=this.reader.readInt(8),this.centralDirOffset=this.reader.readInt(8),this.zip64ExtensibleData={};for(var t,e,r,i=this.zip64EndOfCentralSize-44,n=0;i>n;)t=this.reader.readInt(2),e=this.reader.readInt(4),r=this.reader.readString(e),this.zip64ExtensibleData[t]={id:t,length:e,value:r}},readBlockZip64EndOfCentralLocator:function(){if(this.diskWithZip64CentralDirStart=this.reader.readInt(4),this.relativeOffsetEndOfZip64CentralDir=this.reader.readInt(8),this.disksCount=this.reader.readInt(4),this.disksCount>1)throw new Error("Multi-volumes zip are not supported")},readLocalFiles:function(){var t,e;for(t=0;t<this.files.length;t++)e=this.files[t],this.reader.setIndex(e.localHeaderOffset),this.checkSignature(o.signature.LOCAL_FILE_HEADER),e.readLocalPart(this.reader),e.handleUTF8()},readCentralDir:function(){var t;for(this.reader.setIndex(this.centralDirOffset);this.reader.readString(4)===o.signature.CENTRAL_FILE_HEADER;)t=new s({zip64:this.zip64},this.loadOptions),t.readCentralPart(this.reader),this.files.push(t)},readEndOfCentral:function(){var t=this.reader.lastIndexOfSignature(o.signature.CENTRAL_DIRECTORY_END);if(-1===t)throw new Error("Corrupted zip : can't find end of central directory");if(this.reader.setIndex(t),this.checkSignature(o.signature.CENTRAL_DIRECTORY_END),this.readBlockEndOfCentral(),this.diskNumber===f||this.diskWithCentralDirStart===f||this.centralDirRecordsOnThisDisk===f||this.centralDirRecords===f||this.centralDirSize===u||this.centralDirOffset===u){if(this.zip64=!0,t=this.reader.lastIndexOfSignature(o.signature.ZIP64_CENTRAL_DIRECTORY_LOCATOR),-1===t)throw new Error("Corrupted zip : can't find the ZIP64 end of central directory locator");this.reader.setIndex(t),this.checkSignature(o.signature.ZIP64_CENTRAL_DIRECTORY_LOCATOR),this.readBlockZip64EndOfCentralLocator(),this.reader.setIndex(this.relativeOffsetEndOfZip64CentralDir),this.checkSignature(o.signature.ZIP64_CENTRAL_DIRECTORY_END),this.readBlockZip64EndOfCentral()}},prepareReader:function(t){var e=o.utils.getTypeOf(t);this.reader="string"!==e||o.support.uint8array?"nodebuffer"===e?new n(t):new i(o.utils.transformTo("uint8array",t)):new r(t,this.loadOptions.optimizedBinaryString)},load:function(t){this.prepareReader(t),this.readEndOfCentral(),this.readCentralDir(),this.readLocalFiles()}},o.prototype.load=function(t,e){var r,i,n,s;for(e=e||{},e.base64&&(t=o.base64.decode(t)),i=new a(t,e),r=i.files,n=0;n<r.length;n++)s=r[n],this.file(s.fileName,s.decompressed,{binary:!0,optimizedBinaryString:!0,date:s.date,dir:s.dir});return this}}(this),define("jszip-load",["jszip"],function(t){return function(){var e;return e||t.JSZip}}(this)),function(){"use strict";if(!JSZip)throw"JSZip not defined";var t={};(function(){(function(){function t(t,e){var r=t.split("."),i=o;!(r[0]in i)&&i.execScript&&i.execScript("var "+r[0]);for(var n;r.length&&(n=r.shift());)r.length||e===a?i=i[n]?i[n]:i[n]={}:i[n]=e}function e(t){var e,r,i,n,s,a,o,u,h,d=t.length,c=0,p=Number.POSITIVE_INFINITY;for(u=0;d>u;++u)t[u]>c&&(c=t[u]),t[u]<p&&(p=t[u]);for(e=1<<c,r=new(f?Uint32Array:Array)(e),i=1,n=0,s=2;c>=i;){for(u=0;d>u;++u)if(t[u]===i){for(a=0,o=n,h=0;i>h;++h)a=a<<1|1&o,o>>=1;for(h=a;e>h;h+=s)r[h]=i<<16|u;++n}++i,n<<=1,s<<=1}return[r,c,p]}function r(t,e){switch(this.g=[],this.h=32768,this.c=this.f=this.d=this.k=0,this.input=f?new Uint8Array(t):t,this.l=!1,this.i=h,this.p=!1,(e||!(e={}))&&(e.index&&(this.d=e.index),e.bufferSize&&(this.h=e.bufferSize),e.bufferType&&(this.i=e.bufferType),e.resize&&(this.p=e.resize)),this.i){case u:this.a=32768,this.b=new(f?Uint8Array:Array)(32768+this.h+258);break;case h:this.a=0,this.b=new(f?Uint8Array:Array)(this.h),this.e=this.u,this.m=this.r,this.j=this.s;break;default:throw Error("invalid inflate mode")}}function i(t,e){for(var r,i=t.f,n=t.c,s=t.input,o=t.d;e>n;){if(r=s[o++],r===a)throw Error("input buffer is broken");i|=r<<n,n+=8}return r=i&(1<<e)-1,t.f=i>>>e,t.c=n-e,t.d=o,r}function n(t,e){for(var r,i,n,s=t.f,o=t.c,f=t.input,u=t.d,h=e[0],d=e[1];d>o&&(r=f[u++],r!==a);)s|=r<<o,o+=8;return i=h[s&(1<<d)-1],n=i>>>16,t.f=s>>n,t.c=o-n,t.d=u,65535&i}function s(t){function r(t,e,r){var s,a,o,f;for(f=0;t>f;)switch(s=n(this,e)){case 16:for(o=3+i(this,2);o--;)r[f++]=a;break;case 17:for(o=3+i(this,3);o--;)r[f++]=0;a=0;break;case 18:for(o=11+i(this,7);o--;)r[f++]=0;a=0;break;default:a=r[f++]=s}return r}var s,a,o,u,h=i(t,5)+257,d=i(t,5)+1,c=i(t,4)+4,p=new(f?Uint8Array:Array)(l.length);for(u=0;c>u;++u)p[l[u]]=i(t,3);s=e(p),a=new(f?Uint8Array:Array)(h),o=new(f?Uint8Array:Array)(d),t.j(e(r.call(t,h,s,a)),e(r.call(t,d,s,o)))}var a=void 0,o=this,f="undefined"!=typeof Uint8Array&&"undefined"!=typeof Uint16Array&&"undefined"!=typeof Uint32Array,u=0,h=1;r.prototype.t=function(){for(;!this.l;){var t=i(this,3);switch(1&t&&(this.l=!0),t>>>=1){case 0:var e=this.input,r=this.d,n=this.b,o=this.a,d=a,c=a,p=a,l=n.length,y=a;if(this.c=this.f=0,d=e[r++],d===a)throw Error("invalid uncompressed block header: LEN (first byte)");if(c=d,d=e[r++],d===a)throw Error("invalid uncompressed block header: LEN (second byte)");if(c|=d<<8,d=e[r++],d===a)throw Error("invalid uncompressed block header: NLEN (first byte)");if(p=d,d=e[r++],d===a)throw Error("invalid uncompressed block header: NLEN (second byte)");if(p|=d<<8,c===~p)throw Error("invalid uncompressed block header: length verify");if(r+c>e.length)throw Error("input buffer is broken");switch(this.i){case u:for(;o+c>n.length;){if(y=l-o,c-=y,f)n.set(e.subarray(r,r+y),o),o+=y,r+=y;else for(;y--;)n[o++]=e[r++];this.a=o,n=this.e(),o=this.a}break;case h:for(;o+c>n.length;)n=this.e({o:2});break;default:throw Error("invalid inflate mode")}if(f)n.set(e.subarray(r,r+c),o),o+=c,r+=c;else for(;c--;)n[o++]=e[r++];this.d=r,this.a=o,this.b=n;break;case 1:this.j(Z,O);break;case 2:s(this);break;default:throw Error("unknown BTYPE: "+t)}}return this.m()};var d,c,p=[16,17,18,0,8,7,9,6,10,5,11,4,12,3,13,2,14,1,15],l=f?new Uint16Array(p):p,y=[3,4,5,6,7,8,9,10,11,13,15,17,19,23,27,31,35,43,51,59,67,83,99,115,131,163,195,227,258,258,258],g=f?new Uint16Array(y):y,m=[0,0,0,0,0,0,0,0,1,1,1,1,2,2,2,2,3,3,3,3,4,4,4,4,5,5,5,5,0,0,0],b=f?new Uint8Array(m):m,S=[1,2,3,4,5,7,9,13,17,25,33,49,65,97,129,193,257,385,513,769,1025,1537,2049,3073,4097,6145,8193,12289,16385,24577],C=f?new Uint16Array(S):S,w=[0,0,0,0,1,1,2,2,3,3,4,4,5,5,6,6,7,7,8,8,9,9,10,10,11,11,12,12,13,13],v=f?new Uint8Array(w):w,A=new(f?Uint8Array:Array)(288);for(d=0,c=A.length;c>d;++d)A[d]=143>=d?8:255>=d?9:279>=d?7:8;var E,x,Z=e(A),I=new(f?Uint8Array:Array)(30);for(E=0,x=I.length;x>E;++E)I[E]=5;var O=e(I);r.prototype.j=function(t,e){var r=this.b,s=this.a;this.n=t;for(var a,o,f,u,h=r.length-258;256!==(a=n(this,t));)if(256>a)s>=h&&(this.a=s,r=this.e(),s=this.a),r[s++]=a;else for(o=a-257,u=g[o],0<b[o]&&(u+=i(this,b[o])),a=n(this,e),f=C[a],0<v[a]&&(f+=i(this,v[a])),s>=h&&(this.a=s,r=this.e(),s=this.a);u--;)r[s]=r[s++-f];for(;8<=this.c;)this.c-=8,this.d--;this.a=s},r.prototype.s=function(t,e){var r=this.b,s=this.a;this.n=t;for(var a,o,f,u,h=r.length;256!==(a=n(this,t));)if(256>a)s>=h&&(r=this.e(),h=r.length),r[s++]=a;else for(o=a-257,u=g[o],0<b[o]&&(u+=i(this,b[o])),a=n(this,e),f=C[a],0<v[a]&&(f+=i(this,v[a])),s+u>h&&(r=this.e(),h=r.length);u--;)r[s]=r[s++-f];for(;8<=this.c;)this.c-=8,this.d--;this.a=s},r.prototype.e=function(){var t,e,r=new(f?Uint8Array:Array)(this.a-32768),i=this.a-32768,n=this.b;if(f)r.set(n.subarray(32768,r.length));else for(t=0,e=r.length;e>t;++t)r[t]=n[t+32768];if(this.g.push(r),this.k+=r.length,f)n.set(n.subarray(i,i+32768));else for(t=0;32768>t;++t)n[t]=n[i+t];return this.a=32768,n},r.prototype.u=function(t){var e,r,i,n,s=0|this.input.length/this.d+1,a=this.input,o=this.b;return t&&("number"==typeof t.o&&(s=t.o),"number"==typeof t.q&&(s+=t.q)),2>s?(r=(a.length-this.d)/this.n[2],n=0|258*(r/2),i=n<o.length?o.length+n:o.length<<1):i=o.length*s,f?(e=new Uint8Array(i),e.set(o)):e=o,this.b=e},r.prototype.m=function(){var t,e,r,i,n,s=0,a=this.b,o=this.g,u=new(f?Uint8Array:Array)(this.k+(this.a-32768));if(0===o.length)return f?this.b.subarray(32768,this.a):this.b.slice(32768,this.a);for(e=0,r=o.length;r>e;++e)for(t=o[e],i=0,n=t.length;n>i;++i)u[s++]=t[i];for(e=32768,r=this.a;r>e;++e)u[s++]=a[e];return this.g=[],this.buffer=u},r.prototype.r=function(){var t,e=this.a;return f?this.p?(t=new Uint8Array(e),t.set(this.b.subarray(0,e))):t=this.b.subarray(0,e):(this.b.length>e&&(this.b.length=e),t=this.b),this.buffer=t},t("Zlib.RawInflate",r),t("Zlib.RawInflate.prototype.decompress",r.prototype.t);var T,J,z,k,R={ADAPTIVE:h,BLOCK:u};if(Object.keys)T=Object.keys(R);else for(J in T=[],z=0,R)T[z++]=J;for(z=0,k=T.length;k>z;++z)J=T[z],t("Zlib.RawInflate.BufferType."+J,R[J])}).call(this)}).call(t);var e=function(e){var r=new t.Zlib.RawInflate(e);return r.decompress()},r="undefined"!=typeof Uint8Array&&"undefined"!=typeof Uint16Array&&"undefined"!=typeof Uint32Array;JSZip.compressions.DEFLATE?(JSZip.compressions.DEFLATE.uncompress=e,JSZip.compressions.DEFLATE.uncompressInputType=r?"uint8array":"array"):JSZip.compressions.DEFLATE={magic:"\b\x00",uncompress:e,uncompressInputType:r?"uint8array":"array"}
}(),define("jszip-inflate",["jszip","jszip-load"],function(t){return function(){var e;return e||t.JSZip}}(this)),define("ZipLoader",["jszip-inflate"],function(t){"use strict";return function(e,r,i){if(!r.aborted){var n=new FileReader;n.onload=function(n){r.connect(null);var s,a=new t(n.target.result),o=e.name.replace(/\.[^\.]*$/,".txt").toLowerCase();for(var f in a.files)if(!a.files[f].options.dir){if(f.toLowerCase()===o){s=f;break}f.match(/^[^\/]*\.txt$/i)&&(s=f)}var u={};for(var h in a.files)if(h!==s&&!a.files[h].options.dir){var d=h.match(/\.[^\.]*$/);if(d){var c,p=d[0].toLowerCase();if(".png"===p?c="image/png":".jpg"===p||".jpeg"===p?c="image/jpeg":".webp"===p?c="image/webp":".ogg"===p?c="application/ogg":".mp3"===p&&(c="audio/mp3"),c)if(t.support.arraybuffer&&Modernizr.blobconstructor){var l=a.files[h].asArrayBuffer(),y=new Blob([l],{type:c});u[h]=window.URL.createObjectURL(y)}else u[h]="data:"+c+";base64,"+btoa(a.files[h].asBinary())}}i.translateUrl=function(t){if(t.match(/^[^\/]+:\/\//))return t;var e=u[t];return e?e:t},i.addLines(a.files[s].asText().split("\n").map(function(t){return t.trim()}))},r.connect(n.abort.bind(n)),t.support.arraybuffer?n.readAsArrayBuffer(e):n.ReadAsBinaryString(e)}}});