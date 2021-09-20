'use strict';

exports.handler = (event, context, callback) => {
    const request = event.Records[0].cf.request;
    const headerKeys = Object.keys(request.headers);

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

    if (Object.keys(customHeaders).indexOf("x-staging-authorization") > -1) {
      if (host == "staging.ukcop26.org") {

        const stagingAuth = customHeaders["x-staging-authorization"][0].value;

        request.headers["authorization"] = [{
          key: 'Authorization',
          value: stagingAuth
        }];
      }

      delete customHeaders["x-staging-authorization"];
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
