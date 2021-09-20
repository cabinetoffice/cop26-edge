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
                "value": "ukcop26.org"
              }
            ]
          },
          "origin": {
            "custom": {
              "customHeaders": {
                "x-staging-authorization": [
                  {
                    "key": "x-staging-authorization",
                    "value": "Basic testing"
                  }
                ]
              }
            }
          }
        }
      }
    }
  ]
}

staging_fixture = {
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
            ":authority": [
              {
                "key": ":authority",
                "value": "staging.ukcop26.org"
              }
            ]
          },
          "origin": {
            "custom": {
              "customHeaders": {
                "x-staging-authorization": [
                  {
                    "key": "x-staging-authorization",
                    "value": "Basic testing"
                  }
                ]
              }
            }
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
                "value": "ukcop26.org"
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

      expect(Object.keys(res["headers"])).to.not.have.members(["x-staging-authorization"]);
      expect(Object.keys(res["origin"]["custom"]["customHeaders"])).to.have.length(0);
      done();
    });
  });

  it('staging_fixture', function(done) {
    origin_request.handler(staging_fixture, {}, function(na, res) {
      const auth = res["headers"]["authorization"][0];
      expect(auth.value).to.equal('Basic testing');

      expect(Object.keys(res["origin"]["custom"]["customHeaders"])).to.have.length(0);
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
