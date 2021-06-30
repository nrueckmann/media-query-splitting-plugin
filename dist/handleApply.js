"use strict";

var fs = require('fs');

var splitByMediaQuery = require('./splitByMediaQuery');

var _require = require('crypto-hash'),
    sha1 = _require.sha1;

var handleApply = function handleApply(_ref) {
  var compiler = _ref.compiler,
      options = _ref.options;
  var mediaOptions = options.mediaOptions,
      minify = options.minify,
      chunkFileNamePattern = options.chunkFileName;
  var pluginName = 'media-query-splitting-plugin';
  compiler.hooks.thisCompilation.tap(pluginName, function (compilation) {
    compilation.mainTemplate.hooks.requireEnsure.tap(pluginName, function (source) {
      if (source) {
        var matchMediaPolyfill = "\n          // matchMedia polyfill\n          window.matchMedia||(window.matchMedia=function(){\"use strict\";var e=window.styleMedia||window.media;if(!e){var t,d=document.createElement(\"style\"),i=document.getElementsByTagName(\"script\")[0];d.type=\"text/css\",d.id=\"matchmediajs-test\",i?i.parentNode.insertBefore(d,i):document.head.appendChild(d),t=\"getComputedStyle\"in window&&window.getComputedStyle(d,null)||d.currentStyle,e={matchMedium:function(e){var i=\"@media \"+e+\"{ #matchmediajs-test { width: 1px; } }\";return d.styleSheet?d.styleSheet.cssText=i:d.textContent=i,\"1px\"===t.width}}}return function(t){return{matches:e.matchMedium(t||\"all\"),media:t||\"all\"}}}());\n\n          var mediaKeys = ".concat(JSON.stringify(Object.keys(mediaOptions)), ";\n          var mediaValues = ").concat(JSON.stringify(Object.values(mediaOptions).map(function (value) {
          return value.query;
        })), ";\n          var cssChunksMedia = mediaKeys.concat('common');\n          var cssChunksByMedia = {CSS_CHUNKS_BY_MEDIA:1};\n          var appendLink = function(rel, href, type, as, media) {\n            var linkTag = document.createElement('link');\n            var header = document.getElementsByTagName('head')[0];\n\n            linkTag.rel = rel;\n            linkTag.type = type;\n            linkTag.as = as;\n            linkTag.href = href;\n            linkTag.media = media;\n\n            header.appendChild(linkTag);\n          }\n\n          // Define current mediaType\n          var getMediaType = function() {\n            return mediaKeys.find(function(mediaKey, index) {\n              return window.matchMedia(mediaValues[index]).matches\n            }) || mediaKeys[0];\n          };\n\n          var currentMediaType = getMediaType();\n\n          var getChunkOptions = function(chunkId, mediaType) {\n            var chunkOptions = cssChunksByMedia[chunkId] && cssChunksByMedia[chunkId][cssChunksMedia.indexOf(mediaType)]\n\n            if (chunkOptions) {\n              chunkOptions.prefetch = chunkOptions.prefetch && chunkOptions.prefetch.map(function(mediaTypeId) {\n                return cssChunksMedia[mediaTypeId]\n              })\n\n              return chunkOptions\n            }\n\n            return false\n          };\n\n          var tryAppendNewMedia = function() {\n            var linkElements = document.getElementsByTagName('link');\n            var chunkIds = {};\n\n            for (var i = 0; i < linkElements.length; i++) {\n              var chunkHref = linkElements[i].href.replace(/.*\\//, '');\n              var currentChunkId = chunkHref.replace(/\\..+/, '');\n\n              if (/(").concat(Object.keys(mediaOptions).map(function (key) {
          return key;
        }).join('|'), ").*\\.css$/.test(chunkHref)) {\n                var chunkMediaType = chunkHref.replace(currentChunkId + '.', '').replace(/\\..*/, '');\n                var pervChunkHash = cssChunksByMedia[currentChunkId] && cssChunksByMedia[currentChunkId] && cssChunksByMedia[currentChunkId][cssChunksMedia.indexOf(chunkMediaType)] && cssChunksByMedia[currentChunkId][cssChunksMedia.indexOf(chunkMediaType)].hash;\n                var chunkHash = cssChunksByMedia[currentChunkId] && cssChunksByMedia[currentChunkId] && cssChunksByMedia[currentChunkId][cssChunksMedia.indexOf(currentMediaType)] && cssChunksByMedia[currentChunkId][cssChunksMedia.indexOf(currentMediaType)].hash;\n                var chunkHrefPrefix = linkElements[i].href.replace(new RegExp(currentChunkId + '\\\\..+'), '');\n                if (getChunkOptions(currentChunkId, chunkMediaType)) {\n                  if (!chunkIds[currentChunkId]) {\n                    chunkIds[currentChunkId] = {\n                      mediaTypes: [ chunkMediaType ],\n                      hash: chunkHash,\n                      prefix: chunkHrefPrefix,\n                    }\n                  }\n                  else {\n                    chunkIds[currentChunkId].mediaTypes.push(chunkMediaType);\n                  }\n                }\n              }\n            }\n\n            for (var i in chunkIds) {\n              if (chunkIds.hasOwnProperty(i)) {\n                var hasCurrentMedia = chunkIds[i].mediaTypes.indexOf(currentMediaType) !== -1;\n\n                if (!hasCurrentMedia && getChunkOptions(i, currentMediaType)) {\n                  var fullhref = '' + chunkIds[i].prefix + '' + i + '.' + currentMediaType + '.' + chunkIds[i].hash + '.css';\n                  appendLink('stylesheet', fullhref, 'text/css', undefined, mediaValues[mediaKeys.indexOf(currentMediaType)]);\n                }\n              }\n            }\n          };\n\n          var resize = function() {\n            currentMediaType = getMediaType();\n            tryAppendNewMedia();\n          };\n\n          var afterDOMLoaded = function() {\n            if (!window.isListenerAdded) {\n              window.addEventListener('resize', resize);\n              window.isListenerAdded = true;\n              resize();\n            }\n          };\n\n          if (document.readyState === 'loading') {\n            document.addEventListener('DOMContentLoaded',afterDOMLoaded);\n          }\n          else {\n            afterDOMLoaded();\n          }\n        ");
        var promisesString = 'promises.push(installedCssChunks[chunkId] = new Promise(function(resolve, reject) {';
        var newPromisesString = "promises.push(installedCssChunks[chunkId] = Promise.all([ 'common', currentMediaType ]\n          .map(function (mediaType) {\n            if (!getChunkOptions(chunkId, mediaType)) {\n              return Promise.resolve();\n            }\n\n            var chunkOptions = getChunkOptions(chunkId, currentMediaType);\n\n            if (mediaType === 'common') {\n              if (chunkOptions && chunkOptions.common) {\n                return Promise.resolve();\n              }\n            }\n            else {\n              if (chunkOptions.prefetch) {\n                for (var i = 0; i < chunkOptions.prefetch.length; i++) {\n                  // TODO generate fullhref to prefetch\n                  // appendLink('prefetch', fullhref, undefined, 'style')\n                }\n              }\n            }\n\n            return new Promise(function(resolve, reject) {\n        ";
        var promisesBottomRegExp = /head\.appendChild\(linkTag\);(.|\n)*}\)\.then/;
        var newPromisesBottomString = 'head.appendChild(linkTag);resize();\n})\n})).then';
        var hrefString = source.replace(/(.|\n)*var href = \"/, '').replace(/\";(.|\n)*/, '');
        var isPlainChunkId = / chunkId /.test(hrefString);
        var mediaTypeString = (isPlainChunkId ? hrefString.replace(/ chunkId /, ' chunkId + (mediaType !== "common" ? "."  + mediaType : "") ') : hrefString.replace(' + "." + ', ' + (mediaType !== "common" ? "."  + mediaType + "." : ".") + ')).replace(/ \+ \{/, ' + (mediaType !== \'common\' ? getChunkOptions(chunkId, mediaType).hash : {').replace(' + ".css', ') + ".css');
        return source.replace(promisesString, "".concat(matchMediaPolyfill).concat(newPromisesString)).replace(hrefString, mediaTypeString).replace(promisesBottomRegExp, newPromisesBottomString);
      }
    });
  });
  compiler.plugin('emit', function (compilation, callback) {
    var outputPath = compilation.options.output.path;
    var excludes = Object.values(exclude || {});
    var cssChunks = Object.keys(compilation.assets).filter(function (asset) {
      return /\.css$/.test(asset) && !excludes.some(function (exclude) {
        return exclude.test(asset);
      });
    });
    var needMergeCommonStyles = Object.values(mediaOptions).some(function (_ref2) {
      var withCommonStyles = _ref2.withCommonStyles;
      return withCommonStyles;
    });
    var needRemoveCommonChunk = Object.values(mediaOptions).every(function (_ref3) {
      var withCommonStyles = _ref3.withCommonStyles;
      return withCommonStyles;
    });
    var cssChunksMedia = Object.keys(mediaOptions).concat('common');
    var cssChunksByMedia = {};
    var promises = []; // Split each css chunk

    cssChunks.forEach(function (chunkName) {
      var asset = compilation.assets[chunkName];
      var child = asset.children && asset.children[0];
      var chunkValue = typeof asset.source === 'function' ? asset.source() : (child || asset)._value;
      var splittedValue = splitByMediaQuery({
        cssFile: chunkValue,
        mediaOptions: mediaOptions,
        minify: minify
      });
      var chunkId = chunkName.replace(/\..*/, ''); // Filter empty chunks

      splittedValue = Object.keys(splittedValue).reduce(function (result, mediaType) {
        if (splittedValue[mediaType]) {
          result[mediaType] = splittedValue[mediaType];
        }

        return result;
      }, {}); // Merge common styles if needed

      if (needMergeCommonStyles && splittedValue.common) {
        splittedValue = Object.keys(splittedValue).reduce(function (result, mediaType) {
          if (mediaType === 'common') {
            result[mediaType] = splittedValue[mediaType];
          } else {
            var withCommonStyles = mediaOptions[mediaType].withCommonStyles;

            if (withCommonStyles) {
              result[mediaType] = "".concat(splittedValue.common || '').concat(splittedValue[mediaType] || '');
            } else {
              result[mediaType] = splittedValue[mediaType];
            }
          }

          return result;
        }, {});
      }

      Object.keys(splittedValue).forEach(function (mediaType) {
        var splittedMediaChunk = splittedValue[mediaType];
        var isCommon = mediaType === 'common'; // TODO add exclusions (e.g. manual splitted chunks)?

        if (isCommon && (!splittedMediaChunk || needRemoveCommonChunk)) {
          // TODO use optimizeChunks.hook instead
          var path = "".concat(outputPath, "/").concat(chunkName);

          if (fs.existsSync(path)) {
            fs.unlinkSync(path);
            compilation.assets[chunkName] = undefined;
          }

          if (fs.existsSync("".concat(path, ".map"))) {
            fs.unlinkSync("".concat(path, ".map"));
            compilation.assets["".concat(chunkName, ".map")] = undefined;
          }
        } else if (splittedMediaChunk) {
          // Add existed chunk for entry chunk code
          var mediaChunkId = chunkId.replace(/.+\//, '');
          cssChunksByMedia[mediaChunkId] = cssChunksByMedia[mediaChunkId] || {};
          promises.push(new Promise(function (resolve) {
            sha1(splittedMediaChunk).then(function (hash) {
              // default pattern: '[id].[contenthash].css'
              var splittedMediaChunkNameParts = chunkFileNamePattern.split(".").map(function (chunkNamePart) {
                if (chunkNamePart === "[id]") return chunkId;
                if (chunkNamePart === "[contenthash]") return hash;
                return chunkNamePart;
              });
              splittedMediaChunkNameParts.splice(1, 0, mediaType);
              var splittedMediaChunkName = isCommon ? chunkName : splittedMediaChunkNameParts.join(".");
              cssChunksByMedia[mediaChunkId][cssChunksMedia.indexOf(mediaType)] = {
                hash: hash,
                common: !isCommon && mediaOptions[mediaType].withCommonStyles,
                prefetch: !isCommon && !!mediaOptions[mediaType].prefetch && !!mediaOptions[mediaType].prefetch.filter(function (mediaType) {
                  return cssChunksMedia.indexOf(mediaType) !== -1;
                }).length && mediaOptions[mediaType].prefetch.filter(function (mediaType) {
                  return cssChunksMedia.indexOf(mediaType) !== -1;
                }).map(function (mediaType) {
                  return cssChunksMedia.indexOf(mediaType);
                })
              }; // Add chunk to assets

              compilation.assets[splittedMediaChunkName] = {
                size: function size() {
                  return Buffer.byteLength(splittedMediaChunk, 'utf8');
                },
                source: function source() {
                  return Buffer.from(splittedMediaChunk);
                }
              };
              resolve();
            });
          }));
        }
      });
    });
    Promise.all(promises).then(function () {
      // TODO use mainTemplate hook instead
      var entryChunkId = Object.keys(compilation.options.entry)[0];
      var entryChunkName = Object.keys(compilation.assets).find(function (name) {
        return new RegExp("".concat(entryChunkId, ".+js$")).test(name);
      });

      if (compilation.assets[entryChunkName]) {
        var entryChunk = compilation.assets[entryChunkName].source();
        var updatedEntryChunk = entryChunk.replace('{CSS_CHUNKS_BY_MEDIA:1}', "".concat(JSON.stringify(cssChunksByMedia)));
        compilation.assets[entryChunkName] = {
          size: function size() {
            return Buffer.byteLength(updatedEntryChunk, 'utf8');
          },
          source: function source() {
            return Buffer.from(updatedEntryChunk);
          }
        };
      }

      callback();
    });
  });
};

module.exports = handleApply;