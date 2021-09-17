// defaults:
// Lambda@Edge doesn't support environment variables!

const DELETE_SRV_HEADER = "true";
const HEADER_STS        = "max-age=31536000; includeSubdomains; preload";
const HEADER_EXPECTCT   = "max-age=0";
const HEADER_CSP        = "NULL"; // to be worked out
const HEADER_CSPRO      = "default-src 'self' *.twimg.com *.vimeo.com www.youtube.com *.cdninstagram.com; connect-src 'self' www.google-analytics.com; script-src 'self' *.facebook.com www.googletagmanager.com *.google-analytics.com *.netdna-ssl.com 'unsafe-eval' 'unsafe-inline'; style-src 'self' *.typekit.net *.netdna-ssl.com fonts.googleapis.com 'unsafe-inline'; img-src 'self' data: *.facebook.com s.w.org secure.gravatar.com *.twimg.com *.google-analytics.com *.cdninstagram.com *.netdna-ssl.com; font-src data: 'self' fonts.gstatic.com use.typekit.net *.netdna-ssl.com; frame-src www.facebook.com player.vimeo.com www.youtube.com; report-uri https://browser-listener-10c8e3692d0a.cloudapps.digital/csp-reports; report-to csp-endpoint";
const HEADER_XCTO       = "nosniff";
const HEADER_XFO        = "DENY";
const HEADER_XSSP       = "1; mode=block";
const HEADER_RF         = "strict-origin-when-cross-origin";
const HEADER_PP         = "geolocation=(), microphone=(), camera=(), payment=(), xr-spatial-tracking=(), magnetometer=()";
const HEADER_FP         = "geolocation 'none'; microphone 'none'; camera 'none'; payment 'none'; xr-spatial-tracking 'none'; magnetometer 'none';";
const HEADER_COEP       = "unsafe-none";
const HEADER_COOP       = "unsafe-none";
const HEADER_CORP       = "cross-origin";

exports.handler = async (event) => {
    //Get contents of response
    const response = event.Records[0].cf.response;
    let headers = response.headers;

    const currentHeaderKeys = Object.keys(headers);

    if (DELETE_SRV_HEADER == 'true' && 'server' in headers) {
        delete headers['server'];
    }
    if (DELETE_SRV_HEADER == 'true' && 'x-powered-by' in headers) {
        delete headers['x-powered-by'];
    }

    const report_to = {"group":"csp-endpoint","max_age":86400,"endpoints":[{"url":"https://browser-listener-10c8e3692d0a.cloudapps.digital/csp-reports"}]};
    headers['report-to'] = [{key: 'Report-To', value: JSON.stringify(report_to)}];

    if (HEADER_STS != 'NULL' && !currentHeaderKeys.includes('strict-transport-security')) {
      headers['strict-transport-security'] = [{key: 'Strict-Transport-Security', value: HEADER_STS}];
    }

    if (HEADER_EXPECTCT != 'NULL' && !currentHeaderKeys.includes('expect-ct')) {
      headers['expect-ct'] = [{key: 'Expect-CT', value: HEADER_EXPECTCT}];
    }

    if (HEADER_CSP != 'NULL' && !currentHeaderKeys.includes('content-security-policy')) {
      headers['content-security-policy'] = [{key: 'Content-Security-Policy', value: HEADER_CSP}];
    }

    if (HEADER_CSPRO != 'NULL' && !currentHeaderKeys.includes('content-security-policy-report-only')) {
      headers['content-security-policy-report-only'] = [{key: 'Content-Security-Policy-Report-Only', value: HEADER_CSPRO}];
    }

    if (HEADER_XCTO != 'NULL' && !currentHeaderKeys.includes('x-content-type-options')) {
      headers['x-content-type-options'] = [{key: 'X-Content-Type-Options', value: HEADER_XCTO}];
    }

    if (HEADER_XFO != 'NULL' && !currentHeaderKeys.includes('x-frame-options')) {
      headers['x-frame-options'] = [{key: 'X-Frame-Options', value: HEADER_XFO}];
    }

    if (HEADER_XSSP != 'NULL' && !currentHeaderKeys.includes('x-xss-protection')) {
      headers['x-xss-protection'] = [{key: 'X-XSS-Protection', value: HEADER_XSSP}];
    }

    if (HEADER_RF != 'NULL' && !currentHeaderKeys.includes('referrer-policy')) {
      headers['referrer-policy'] = [{key: 'Referrer-Policy', value: HEADER_RF}];
    }

    if (HEADER_PP != 'NULL' && !currentHeaderKeys.includes('permissions-policy')) {
      headers['permissions-policy'] = [{key: 'Permissions-Policy', value: HEADER_PP}];
    }

    if (HEADER_FP != 'NULL' && !currentHeaderKeys.includes('feature-policy')) {
      headers['feature-policy'] = [{key: 'Feature-Policy', value: HEADER_FP}];
    }

    if (HEADER_COEP != 'NULL' && !currentHeaderKeys.includes('cross-origin-embedder-policy')) {
      headers['cross-origin-embedder-policy'] = [{key: 'Cross-Origin-Embedder-Policy', value: HEADER_COEP}];
    }

    if (HEADER_COOP != 'NULL' && !currentHeaderKeys.includes('cross-origin-opener-policy')) {
      headers['cross-origin-opener-policy'] = [{key: 'Cross-Origin-Opener-Policy', value: HEADER_COOP}];
    }

    if (HEADER_CORP != 'NULL' && !currentHeaderKeys.includes('cross-origin-resource-policy')) {
      headers['cross-origin-resource-policy'] = [{key: 'Cross-Origin-Resource-Policy', value: HEADER_CORP}];
    }

    //Return modified response
    return response;
};
