const expect         = require("chai").expect;
const origin_request = require("../src/origin_request.js");

existing_fixture = {
  "Records": [
    {
      "cf": {
        "config": {
          "distributionId": "EXAMPLE"
        },
        "request": {
          "uri": "/index.phg",
          "method": "GET",
          "clientIp": "2001:cdba::3257:9652",
          "headers": {
            "host": [
              {
                "key": "Host",
                "value": "d123.cf.net"
              }
            ]
          }
        }
      }
    }
  ]
}

security_txt_path_fixture = {
  "Records": [
    {
      "cf": {
        "config": {
          "distributionId": "EXAMPLE"
        },
        "request": {
          "uri": "/.well-known/security.txt",
          "method": "GET",
          "clientIp": "2001:cdba::3257:9652",
          "headers": {
            "host": [
              {
                "key": "Host",
                "value": "d123.cf.net"
              }
            ]
          }
        }
      }
    }
  ]
}

describe("origin_request", function() {
  it('existing_fixture', function(done) {
    origin_request.handler(existing_fixture, {}, function(na, res) {
      expect(res).to.equal(existing_fixture.Records[0].cf.request);
      done();
    });
  });

  it('security_txt_path_fixture', function(done) {
    origin_request.handler(security_txt_path_fixture, {}, function(na, res) {
      expect(res).to.not.equal(security_txt_path_fixture.Records[0].cf.request);
      expect(res.status).to.equal('302');

      const location = res["headers"]["location"][0];
      expect(location.value).to.equal('https://vdp.cabinetoffice.gov.uk/.well-known/security.txt');
      done();
    });
  });
});
