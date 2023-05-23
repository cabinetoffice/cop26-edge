'use strict';

exports.handler = (event, context, callback) => {
    const request = event.Records[0].cf.request;
    const headerKeys = Object.keys(request.headers);
    const archive_timestamp = '20230401054904';

    var customHeaders = {};
    if (Object.keys(request).indexOf("origin") > -1) {
      if (Object.keys(request.origin).indexOf("custom") > -1) {
        if (Object.keys(request.origin.custom).indexOf("customHeaders") > -1) {
          customHeaders = request.origin.custom.customHeaders;
        }
      }
    }

    var host = "";
    if (headerKeys.indexOf("host") > -1) {
        host = request.headers.host[0].value;
    } else if (headerKeys.indexOf(":authority") > -1) {
        host = request.headers[':authority'][0].value;
    }

    const hosts = [
      "www.ukcop26.org",
      "staging.ukcop26.org",
      "ukcop26.org",
      "together-for-our-planet.ukcop26.org"
    ];

    if (hosts.indexOf(host) == -1) {
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
      const sectxt = 'https://vulnerability-reporting.service.security.gov.uk/.well-known/security.txt';

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

    host = host.replace(/^\s*?(www|staging)\./, '').trim();

    var uri_normalised = request.uri.replace(/^[\.\/\\]+\//, '');
    if (uri_normalised.match(/^\/(wp-admin|wp-config.php|wp-login|\.)/)) {
      uri_normalised = '/';
    }

    const archiveUrl = `https://webarchive.nationalarchives.gov.uk/ukgwa/${archive_timestamp}/https://${host}${uri_normalised}`;
    
    callback(null, {
        status: '301',
        statusDescription: 'Moved Permanently',
        headers: {
            location: [{
                key: 'Location',
                value: archiveUrl,
            }],
            'cache-control': [{
                key: 'Cache-Control',
                value: 'public, max-age=86400, immutable',
            }],
        },
    });
    return;
};
