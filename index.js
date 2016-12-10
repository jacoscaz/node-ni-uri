
'use strict';

var url = require('url');
var crypto = require('crypto');

var NI_ALGOS_TO_NODE_ALGOS = {
  'sha-256': 'sha256',
  'sha-384': 'sha384',
  'sha-512': 'sha512'
};

var NI_URI_PATHNAME_REGEXP = /\/([a-z]{2,4}-[0-9]{2,4});([A-Za-z0-9+\-_/]+)$/;

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
  if (parts.algorithm && parts.value) {
    parts = Object.create(parts);
    parts.pathname = parts.algorithm + ';' + parts.value;
    delete parts.path;
  }
  return url.format(parts);
}

module.exports.format = format;

function digest(algorithm, data, enc, parts) {
  var nodeAlgorithm = NI_ALGOS_TO_NODE_ALGOS[algorithm];
  if (!nodeAlgorithm) {
    throw new Error('Unsupported algorithm.');
  }
  if (typeof(enc) === 'object') {
    parts = enc;
    enc = null;
  }
  parts = parts ? Object.create(parts) : {};
  parts.protocol = 'ni:';
  parts.slashes = true;
  parts.algorithm = algorithm;
  parts.value = crypto.createHash(nodeAlgorithm)
    .update(data, enc)
    .digest('base64')
    .replace(/\=+$/, '');
  return format(parts);
}

module.exports.digest = digest;
