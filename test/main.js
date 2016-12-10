
var ni = require('../');
var should = require('should');

describe('Main test suite for ni-uri', function () {

  it('Should digest data correctly', function () {
    var data = 'The quick brown fox jumps over the lazy dog.';
    var uri = 'ni:///sha-256;71N/JciVv6eCUmUpqbY9l6pjFWTV14nCt2VEjIY1+2w';
    ni.digest('sha-256', data).should.equal(uri);
  });

  it('Should parse a complete ni uri correctly', function () {
    var uri = 'ni:///sha-256;71N/JciVv6eCUmUpqbY9l6pjFWTV14nCt2VEjIY1+2w';
    var parts = ni.parse(uri);
    parts.algorithm.should.equal('sha-256');
    parts.protocol.should.equal('ni:');
    parts.value.should.equal('71N/JciVv6eCUmUpqbY9l6pjFWTV14nCt2VEjIY1+2w');
  });

});