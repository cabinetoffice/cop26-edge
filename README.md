# COP26-edge

Further info: <https://docs.google.com/document/d/1Tvwl_xtF2W3JQeKNB8l-11RZkFWW_nRx-h8tz_G_IKU/edit>

## Features

CloudFront (CDN)
AWS WAF
Shield Advanced
Lambda@Edge - security.txt (origin request) / security headers (origin response)

## Test / deployment

```
nvm use
cd terraform && tfenv use
cd ../
make test | plan | apply
```
