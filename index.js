
'use strict';

var url = require('url');
var crypto = require('crypto');

var NI_ALGOS_TO_NODE_ALGOS = {
  'sha-256': 'sha256',
  'sha-384': 'sha384',
  'sha-512': 'sha512'
};

var NI_URI_PATHNAME_REGEXP = /\/([a-z]{2,4}-[0-9]{2,4});([A-Za-z0-9+\-_/]+)$/;

function isNull(n) {
  return n === null;
}

function isObject(o) {
  return typeof(o) === 'object' && !isNull(o);
}

function isString(s) {
  return typeof(s) === 'string';
}

function extend(dest) {
  var sources = Array.prototype.slice.call(arguments, 1);
  for (var s = 0, source; s < sources.length; s++) {
    source = sources[s];
    if (isObject(source)) {
      for (var key in source) {
        if (source.hasOwnProperty(key)) {
          dest[key] = source[key];
        }
      }
    }
  }
  return dest;
}

function isAlgorithmSupported(algorithm) {
  return !!NI_ALGOS_TO_NODE_ALGOS[algorithm];
}

module.exports.isAlgorithmSupported = isAlgorithmSupported;

function parse(uri, parseQuery) {
  var parts = url.parse(uri, parseQuery);
  var match = parts.pathname && parts.pathname.match(NI_URI_PATHNAME_REGEXP);
  if (!match) {
    throw new URIError('Invalid NI URI.');
  }
  parts.algorithm = match[1];
  parts.value = match[2];
  return parts;
}

module.exports.parse = parse;

function format(parts) {
  parts = extend({}, parts);
  parts.slashes = true;
  parts.protocol = 'ni:';
  if (parts.algorithm && parts.value) {
    parts.pathname = parts.algorithm + ';' + parts.value;
    delete parts.path;
  }
  return url.format(parts);
}

module.exports.format = format;

function digest(algorithm, data, enc, parts) {
  if (enc && !isString(enc)) {
    parts = enc;
    enc = null;
  }
  var nodeAlgorithm = NI_ALGOS_TO_NODE_ALGOS[algorithm];
  if (!nodeAlgorithm) {
    throw new Error('Unsupported algorithm.');
  }
  var value = crypto.createHash(nodeAlgorithm)
    .update(data, enc)
    .digest('base64')
    .replace(/\=+$/, '');
  if (parts) {
    parts = extend({}, parts);
    parts.value = value;
    parts.algorithm = algorithm;
    return format(parts);
  }
  return value;
}

module.exports.digest = digest;
