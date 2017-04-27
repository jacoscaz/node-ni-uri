
NI-URI
======

Parsing, formating and digesting utilities for [Named Information (NI) URIs](https://tools.ietf.org/html/rfc6920) in Node.js land.

Usage
-----

#### install / require

    $ npm install ni-uri

    const ni = require('ni-uri');
    
#### .format(Object parts)

Similar to [Node.js' url#format()](https://nodejs.org/api/url.html#url_url_format_urlobject).

    const result = ni.format({
      host: example.com,
      algorithm: 'sha-256',
      value: '71N_JciVv6eCUmUpqbY9l6pjFWTV14nCt2VEjIY1-2w',
      query: {q: '1'}
    });
    
    // 'ni://example.con/sha-256;71N_JciVv6eCUmUpqbY9l6pjFWTV14nCt2VEjIY1-2w?q=1'

#### .parse(string uri, boolean parseQuery)

Similar to [Node.js' url#parse()](https://nodejs.org/api/url.html#url_url_parse_urlstring_parsequerystring_slashesdenotehost).
    
    const result = ni.parse('ni://example.con/sha-256;71N_JciVv6eCUmUpqbY9l6pjFWTV14nCt2VEjIY1-2w?q=1', true);
     
    // {
    //   protocol: 'ni',
    //   algorithm: 'sha-256',
    //   value: '71N_JciVv6eCUmUpqbY9l6pjFWTV14nCt2VEjIY1-2w',
    //   host: 'example.com'
    // }

#### .digest([string algorithm], string | Buffer data, [string encoding], [Object | boolean parts])

Generates the hash/value component for some data. Returns the hash or a formatted uri. 

    const result = ni.digest('sha-256', 'The quick brown fox jumps over the lazy dog.');
    
    // returns '71N_JciVv6eCUmUpqbY9l6pjFWTV14nCt2VEjIY1-2w'

    const result = ni.digest('sha-256', 'The quick brown fox jumps over the lazy dog.', true);
    
    // returns 'ni:///sha-256;71N_JciVv6eCUmUpqbY9l6pjFWTV14nCt2VEjIY1-2w'

    const result = ni.digest('sha-256', 'The quick brown fox jumps over the lazy dog.', {host: 'example.com'});
    
    // returns 'ni://example.com/sha-256;71N_JciVv6eCUmUpqbY9l6pjFWTV14nCt2VEjIY1-2w'
    

License
-------

MIT - see [LICENSE.md](./LICENSE.md).
