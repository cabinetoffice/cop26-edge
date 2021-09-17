'use strict';

exports.handler = (event, context, callback) => {
    const request = event.Records[0].cf.request;

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
