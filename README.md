
NI-URI
======

Parse, format and digest utilities for Named Information (NI) URIs

Usage
-----

    var ni = require('ni-uri');

    var value = ni.digest('sha-256', 'The quick brown fox jumps over the lazy dog.');
    // value === '71N/JciVv6eCUmUpqbY9l6pjFWTV14nCt2VEjIY1+2w'

    var uri = ni.digest('sha-256', 'The quick brown fox jumps over the lazy dog.', true);
    // uri === 'ni:///sha-256;71N/JciVv6eCUmUpqbY9l6pjFWTV14nCt2VEjIY1+2w'

    var parts = ni.parse(uri);
    // parts.protocol === 'ni:'
    // parts.algorithm === 'sha-256'
    // parts.value === '71N/JciVv6eCUmUpqbY9l6pjFWTV14nCt2VEjIY1+2w'

    var formatted = ni.format(parts);
    // formatted === uri
    
API
---

### ni.parse(uri, [parseQuery])
### ni.format(parts)
### ni.digest(algorithm, data, [encoding], [parts])

License
-------

MIT - see [LICENSE.md](./LICENSE.md).
