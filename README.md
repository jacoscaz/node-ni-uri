
NI-URI
======

Parse, format and digest utilities for Named Information (NI) URIs

Usage
-----

    var ni = require('ni-uri');

    var uri = ni.digest('sha-256', 'The quick brown fox jumps over the lazy dog.')
    // uri === 'ni:///sha-256;71N/JciVv6eCUmUpqbY9l6pjFWTV14nCt2VEjIY1+2w'

    var parts = ni.parse(uri);
    // parts.protocol === 'ni:'
    // parts.algorithm === 'sha-256'
    // parts.value === '71N/JciVv6eCUmUpqbY9l6pjFWTV14nCt2VEjIY1+2w'

    var formatted = ni.format(parts);
    // formatted === uri