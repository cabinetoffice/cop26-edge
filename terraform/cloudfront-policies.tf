/* --- Request Policies (Origin) --- */

resource "aws_cloudfront_origin_request_policy" "cf_dynamic_rp" {
  name    = "COP26-Dynamic-RequestPolicy"
  comment = "Dynamic request policy for the COP26 WordPress site"
  cookies_config {
    cookie_behavior = "whitelist"
    cookies {
      items = [
        "wordpress_*",
        "comment_*",
        "wp-settings-*"
      ]
    }
  }
  headers_config {
    header_behavior = "allViewer"
  }
  query_strings_config {
    query_string_behavior = "all"
  }
}

resource "aws_cloudfront_origin_request_policy" "cf_static_rp" {
  name    = "COP26-Static-RequestPolicy"
  comment = "Static request policy for the COP26 WordPress site"
  cookies_config {
    cookie_behavior = "none"
  }
  headers_config {
    header_behavior = "whitelist"
    headers {
      items = [
        "Origin",
        "Host",
        "CloudFront-*"
      ]
    }
  }
  query_strings_config {
    query_string_behavior = "whitelist"
    query_strings {
      items = [
        "p",
        "page_id",
        "post",
        "post_type"
      ]
    }
  }
}

/* --- Cache Policies (Viewer) --- */

resource "aws_cloudfront_cache_policy" "cf_dynamic_cp" {
  name        = "COP26-Dynamic-CachePolicy"
  comment     = "Dynamic cache policy for the COP26 WordPress site"
  default_ttl = 300
  max_ttl     = 600
  min_ttl     = 1

  parameters_in_cache_key_and_forwarded_to_origin {
    enable_accept_encoding_brotli = true
    enable_accept_encoding_gzip   = true

    cookies_config {
      cookie_behavior = "whitelist"
      cookies {
        items = [
          "wordpress_*",
          "comment_*",
          "wp-settings-*"
        ]
      }
    }
    headers_config {
      header_behavior = "whitelist"
      headers {
        items = [
          "Origin",
          "Host",
          "Authorization"
        ]
      }
    }
    query_strings_config {
      query_string_behavior = "all"
    }
  }
}

resource "aws_cloudfront_cache_policy" "cf_static_cp" {
  name        = "COP26-Static-CachePolicy"
  comment     = "Static cache policy for the COP26 WordPress site"
  default_ttl = 86400
  max_ttl     = 604800
  min_ttl     = 1

  parameters_in_cache_key_and_forwarded_to_origin {
    enable_accept_encoding_brotli = true
    enable_accept_encoding_gzip   = true

    cookies_config {
      cookie_behavior = "none"
    }
    headers_config {
      header_behavior = "whitelist"
      headers {
        items = [
          "Origin",
          "Host",
          "Authorization"
        ]
      }
    }
    query_strings_config {
      query_string_behavior = "whitelist"
      query_strings {
        items = [
          "p",
          "page_id",
          "post",
          "post_type"
        ]
      }
    }
  }
}
