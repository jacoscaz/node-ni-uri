
'use strict';

const url = require('url');
const assert = require('assert');
const crypto = require('crypto');

const ENCODINGS = {
  ascii: true,
  utf8: true,
  utf16le: true,
  ucs2: true,
  base64: true,
  latin1: true,
  binary: true,
  hex: true
};

const DEFAULT_ENCODING = 'utf8';

const SUPPORTED_ALGORITHMS = {
  'sha-256': 'sha256',
  'sha-384': 'sha384',
  'sha-512': 'sha512'
};

const DEFAULT_ALGORITHM = 'sha-256';

const NI_VALUE_REGEXP = /[A-Za-z0-9+\-_/]+$/;

function isString(str) {
  return typeof(str) === 'string';
}

function isObject(obj) {
  return typeof(obj) === 'object' && obj !== null;
}

function isNil(val) {
  return val === undefined || val === null;
}

function isEncoding(str) {
  return isString(str) && !!ENCODINGS[str];
}

function isValue(str) {
  return isString(str) && !!str.match(NI_VALUE_REGEXP);
}

function isAlgorithm(str) {
  return isString(str) && !!SUPPORTED_ALGORITHMS[str];
}

function isBoolean(bool) {
  return typeof(bool) === 'boolean';
}

module.exports.isAlgorithm = isAlgorithm;

function isBuffer(obj) {
  return Buffer.isBuffer(obj);
}

function parse(uri, parseQuery, slashesDenoteHost) {
  assert(isString(uri), 'Cannot parse NI-URI (not a string).');
  const parts = url.parse(uri, parseQuery, slashesDenoteHost);
  const pathnameParts = parts.pathname.slice(1).split(';');
  assert(pathnameParts.length === 2, 'Cannot parse NI-URI (invalid pathname).');
  delete parts.pathname;
  delete parts.path;
  parts.algorithm = pathnameParts[0];
  parts.value = pathnameParts[1];
  return parts;
}

module.exports.parse = parse;

function format(parts) {
  assert(isObject(parts), 'Cannot format NI-URI (not an object).');
  assert(isValue(parts.value), 'Cannot format NI-URI (bad value).');
  parts = Object.assign({}, parts);
  parts.slashes = true;
  parts.protocol = 'ni:';
  parts.pathname = parts.algorithm + ';' + parts.value;
  delete parts.path;
  return url.format(parts);
}

module.exports.format = format;

function digest(algorithm, data, enc, parts) {
  if (isString(algorithm) && !isString(data) && !isBuffer(data)) {
    parts = enc;
    enc = data;
    data = algorithm;
    algorithm = DEFAULT_ALGORITHM;
  }
  if (isObject(enc) || isBoolean(enc)) {
    parts = enc;
    enc = DEFAULT_ENCODING;
  }
  assert(isAlgorithm(algorithm), 'Cannot digest data (unsupported algorithm).');
  assert(isString(data) || isBuffer(data), 'Cannot digest data (invalid data).');
  assert(isNil(enc) || isEncoding(enc), 'Cannot digest data (unsupported encoding).');
  assert(isNil(parts) || parts === true || isObject(parts), 'Cannot digest data (invalid parts).');
  const value = crypto.createHash(SUPPORTED_ALGORITHMS[algorithm])
    .update(data, enc)
    .digest('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
  if (parts) {
    parts = isObject(parts) ? Object.assign({}, parts) : {};
    parts.value = value;
    parts.algorithm = algorithm;
    return format(parts);
  }
  return value;
}

module.exports.digest = digest;
