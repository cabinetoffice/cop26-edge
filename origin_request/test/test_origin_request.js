const expect         = require("chai").expect;
const origin_request = require("../src/origin_request.js");

const archive_timestamp = '20230401054904';

existing_fixture = {
  "Records": [
    {
      "cf": {
        "config": {
          "distributionId": "EXAMPLE"
        },
        "request": {
          "uri": "/.git",
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
            }
          }
        }
      }
    }
  ]
}

tfop_fixture = {
  "Records": [
    {
      "cf": {
        "config": {
          "distributionId": "EXAMPLE"
        },
        "request": {
          "uri": "/cop26-presidents-foreword/",
          "method": "GET",
          "clientIp": "2001:cdba::3257:9652",
          "headers": {
            "host": [
              {
                "key": "host",
                "value": "together-for-our-planet.ukcop26.org"
              }
            ]
          },
          "origin": {
            "custom": {
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
      expect(res).to.not.equal(staging_fixture.Records[0].cf.request);
      expect(res.status).to.equal('301');

      const location = res["headers"]["location"][0];
      expect(location.value).to.equal(`https://webarchive.nationalarchives.gov.uk/ukgwa/${archive_timestamp}/https://ukcop26.org/`);
      done();
    });
  });

  it('staging_fixture', function(done) {
    origin_request.handler(staging_fixture, {}, function(na, res) {
      expect(res).to.not.equal(staging_fixture.Records[0].cf.request);
      expect(res.status).to.equal('301');

      const location = res["headers"]["location"][0];
      expect(location.value).to.equal(`https://webarchive.nationalarchives.gov.uk/ukgwa/${archive_timestamp}/https://ukcop26.org/index.phg`);
      done();
    });
  });

  it('tfop_fixture', function(done) {
    origin_request.handler(tfop_fixture, {}, function(na, res) {
      expect(res).to.not.equal(tfop_fixture.Records[0].cf.request);
      expect(res.status).to.equal('301');

      const location = res["headers"]["location"][0];
      expect(location.value).to.equal(`https://webarchive.nationalarchives.gov.uk/ukgwa/${archive_timestamp}/https://together-for-our-planet.ukcop26.org/cop26-presidents-foreword/`);
      done();
    });
  });

  it('security_txt_path_fixture', function(done) {
    origin_request.handler(security_txt_path_fixture, {}, function(na, res) {
      expect(res).to.not.equal(security_txt_path_fixture.Records[0].cf.request);
      expect(res.status).to.equal('302');

      const location = res["headers"]["location"][0];
      expect(location.value).to.equal('https://vulnerability-reporting.service.security.gov.uk/.well-known/security.txt');
      done();
    });
  });
});
