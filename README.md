# COP26-edge

Further info: <https://docs.google.com/document/d/1Tvwl_xtF2W3JQeKNB8l-11RZkFWW_nRx-h8tz_G_IKU/edit>

## Features

- CloudFront (CDN)
- AWS WAF
- Shield Advanced
- Lambda@Edge
  - security.txt ([origin request](origin_request/src/origin_request.js))
  - security headers ([origin response](origin_response/src/origin_response.js))

## Test / deployment

```
nvm use
cd terraform && tfenv use
cd ../
make test | plan | apply
```

Continuously deployed using [GitHub Actions](https://github.com/cabinetoffice/cop26-edge/actions/workflows/main.yml).
