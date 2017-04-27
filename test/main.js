
'use strict';

const ni = require('../');
const should = require('should');

describe('Main test suite for ni-uri', () => {
  it('Should digest data correctly (auto)', () => {
    const data = 'The quick brown fox jumps over the lazy dog.';
    const value = '71N_JciVv6eCUmUpqbY9l6pjFWTV14nCt2VEjIY1-2w';
    should(ni.digest(data)).equal(value);
  });

  it('Should digest data correctly (SHA-256)', () => {
    const data = 'The quick brown fox jumps over the lazy dog.';
    const value = '71N_JciVv6eCUmUpqbY9l6pjFWTV14nCt2VEjIY1-2w';
    should(ni.digest('sha-256', data)).equal(value);
  });

  it('Should digest data and format correctly', () => {
    const data = 'The quick brown fox jumps over the lazy dog.';
    const uri = 'ni:///sha-256;71N_JciVv6eCUmUpqbY9l6pjFWTV14nCt2VEjIY1-2w';
    should(ni.digest('sha-256', data, true)).equal(uri);
  });

  it('Should digest data and format correctly w/ parts', () => {
    const data = 'The quick brown fox jumps over the lazy dog.';
    const uri = 'ni://example.com/sha-256;71N_JciVv6eCUmUpqbY9l6pjFWTV14nCt2VEjIY1-2w?a=1';
    should(ni.digest('sha-256', data, { host: 'example.com', query: { a: 1 } })).equal(uri);
  });

  it('Should parse correctly (simple)', () => {
    const uri = 'ni:///sha-256;71N_JciVv6eCUmUpqbY9l6pjFWTV14nCt2VEjIY1-2w';
    const parts = ni.parse(uri);
    should(parts.algorithm).equal('sha-256');
    should(parts.protocol).equal('ni:');
    should(parts.value).equal('71N_JciVv6eCUmUpqbY9l6pjFWTV14nCt2VEjIY1-2w');
  });

  it('Should parse correctly (host)', () => {
    const uri = 'ni://example.com/sha-256;71N_JciVv6eCUmUpqbY9l6pjFWTV14nCt2VEjIY1-2w';
    const parts = ni.parse(uri);
    should(parts.algorithm).equal('sha-256');
    should(parts.protocol).equal('ni:');
    should(parts.value).equal('71N_JciVv6eCUmUpqbY9l6pjFWTV14nCt2VEjIY1-2w');
    should(parts.hostname).equal('example.com');
  });

  it('Should parse correctly (query)', () => {
    const uri = 'ni://example.com/sha-256;71N_JciVv6eCUmUpqbY9l6pjFWTV14nCt2VEjIY1-2w?a=1';
    const parts = ni.parse(uri, true);
    should(parts.algorithm).equal('sha-256');
    should(parts.protocol).equal('ni:');
    should(parts.value).equal('71N_JciVv6eCUmUpqbY9l6pjFWTV14nCt2VEjIY1-2w');
    should(parts.query.a).equal('1');
  });
});
