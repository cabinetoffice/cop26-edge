'use strict';

exports.handler = (event, context, callback) => {
    const request = event.Records[0].cf.request;
    
    const hosts = [
      "www.ukcop26.org",
      "ukcop26.org",
      "together-for-our-planet.ukcop26.org"
    ];

    if (hosts.indexOf(request.headers["host"].value) == -1) {
      callback(null, {
        status: '404',
        statusDescription: 'Not Found',
        headers: {
            'cache-control': [{
                key: 'Cache-Control',
                value: 'max-age=31536000'
            }],
            'content-type': [{
                key: 'Content-Type',
                value: 'text/html'
            }]
        },
        body: "404",
      });
      return;
    }

    if (request.uri.match(/^(\/.well[-_]known)?\/security\.txt$/)) {
      const sectxt = 'https://vdp.cabinetoffice.gov.uk/.well-known/security.txt';

      callback(null, {
          status: '302',
          statusDescription: 'Found',
          headers: {
              location: [{
                  key: 'Location',
                  value: sectxt,
              }],
              'cache-control': [{
                  key: 'Cache-Control',
                  value: 'public, max-age=604800, immutable',
              }],
          },
      });
      return;
    }

    callback(null, request);
};
