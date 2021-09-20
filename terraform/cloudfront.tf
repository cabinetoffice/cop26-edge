locals {
  origin_id            = "WPENGINE"
  origin_shield_region = "eu-west-2"
}

resource "aws_cloudfront_distribution" "distribution" {
  aliases = [
    "www.ukcop26.org",
    "staging.ukcop26.org",
    "ukcop26.org",
    "together-for-our-planet.ukcop26.org"
  ]

  enabled             = true
  is_ipv6_enabled     = true
  comment             = "COP26-${var.environment}"
  price_class         = "PriceClass_100"
  web_acl_id          = var.web_acl_id

  logging_config {
    include_cookies = false
    bucket          = "cyber-security-cloudfront.s3.amazonaws.com"
    prefix          = "cop26-website-${var.environment}"
  }

  restrictions {
    geo_restriction {
      restriction_type = "none"
    }
  }

  origin {
    connection_timeout = 3
    domain_name        = var.origin_domain
    origin_id          = local.origin_id

    custom_origin_config {
      http_port                = 80
      https_port               = 443
      origin_protocol_policy   = "https-only"
      origin_ssl_protocols     = ["TLSv1.2"]
      origin_keepalive_timeout = 60
      origin_read_timeout      = 10
    }

    origin_shield {
      enabled              = true
      origin_shield_region = local.origin_shield_region
    }

    custom_header {
      name = "cf-id"
      value = var.cf_id_value
    }
  }

  viewer_certificate {
    acm_certificate_arn      = var.acm_certificate_arn
    minimum_protocol_version = "TLSv1.2_2019"
    ssl_support_method       = "sni-only"
  }

  ordered_cache_behavior {
    path_pattern     = "wp-login.php"
    allowed_methods  = ["GET", "HEAD", "OPTIONS", "PUT", "POST", "PATCH", "DELETE"]
    cached_methods   = ["GET", "HEAD"]
    compress         = false
    target_origin_id = local.origin_id

    viewer_protocol_policy = "redirect-to-https"

    forwarded_values {
      query_string = "true"
      headers = ["*"]
      cookies {
        forward = "all"
      }
    }

    lambda_function_association {
      event_type = "origin-response"
      lambda_arn = aws_lambda_function.cop26_origin_response.qualified_arn
    }

    lambda_function_association {
      event_type = "origin-request"
      lambda_arn = aws_lambda_function.cop26_origin_request.qualified_arn
    }
  }

  ordered_cache_behavior {
    path_pattern     = "wp-admin/*"
    allowed_methods  = ["GET", "HEAD", "OPTIONS", "PUT", "POST", "PATCH", "DELETE"]
    cached_methods   = ["GET", "HEAD"]
    compress         = false
    target_origin_id = local.origin_id

    viewer_protocol_policy = "redirect-to-https"

    forwarded_values {
      query_string = "true"
      headers = ["*"]
      cookies {
        forward = "all"
      }
    }

    lambda_function_association {
      event_type = "origin-response"
      lambda_arn = aws_lambda_function.cop26_origin_response.qualified_arn
    }

    lambda_function_association {
      event_type = "origin-request"
      lambda_arn = aws_lambda_function.cop26_origin_request.qualified_arn
    }
  }

  ordered_cache_behavior {
    path_pattern     = "wp-content/*"
    allowed_methods  = ["GET", "HEAD"]
    cached_methods   = ["GET", "HEAD"]
    compress         = true
    target_origin_id = local.origin_id

    viewer_protocol_policy = "redirect-to-https"

    origin_request_policy_id = aws_cloudfront_origin_request_policy.cf_static_rp.id
    cache_policy_id          = aws_cloudfront_cache_policy.cf_static_cp.id

    lambda_function_association {
      event_type = "origin-response"
      lambda_arn = aws_lambda_function.cop26_origin_response.qualified_arn
    }

    lambda_function_association {
      event_type = "origin-request"
      lambda_arn = aws_lambda_function.cop26_origin_request.qualified_arn
    }
  }

  ordered_cache_behavior {
    path_pattern     = "wp-includes/*"
    allowed_methods  = ["GET", "HEAD"]
    cached_methods   = ["GET", "HEAD"]
    compress         = true
    target_origin_id = local.origin_id

    viewer_protocol_policy = "redirect-to-https"

    origin_request_policy_id = aws_cloudfront_origin_request_policy.cf_static_rp.id
    cache_policy_id          = aws_cloudfront_cache_policy.cf_static_cp.id

    lambda_function_association {
      event_type = "origin-response"
      lambda_arn = aws_lambda_function.cop26_origin_response.qualified_arn
    }

    lambda_function_association {
      event_type = "origin-request"
      lambda_arn = aws_lambda_function.cop26_origin_request.qualified_arn
    }
  }

  ordered_cache_behavior {
    path_pattern     = "/"
    allowed_methods  = ["GET", "HEAD"]
    cached_methods   = ["GET", "HEAD"]
    compress         = true
    target_origin_id = local.origin_id

    viewer_protocol_policy = "redirect-to-https"

    origin_request_policy_id = aws_cloudfront_origin_request_policy.cf_static_rp.id
    cache_policy_id          = aws_cloudfront_cache_policy.cf_static_cp.id

    lambda_function_association {
      event_type = "origin-response"
      lambda_arn = aws_lambda_function.cop26_origin_response.qualified_arn
    }

    lambda_function_association {
      event_type = "origin-request"
      lambda_arn = aws_lambda_function.cop26_origin_request.qualified_arn
    }
  }

  default_cache_behavior {
    allowed_methods  = ["GET", "HEAD", "OPTIONS", "PUT", "POST", "PATCH", "DELETE"]
    cached_methods   = ["GET", "HEAD"]
    compress         = true
    target_origin_id = local.origin_id

    viewer_protocol_policy = "redirect-to-https"

    origin_request_policy_id = aws_cloudfront_origin_request_policy.cf_dynamic_rp.id
    cache_policy_id          = aws_cloudfront_cache_policy.cf_dynamic_cp.id

    lambda_function_association {
      event_type = "origin-response"
      lambda_arn = aws_lambda_function.cop26_origin_response.qualified_arn
    }

    lambda_function_association {
      event_type = "origin-request"
      lambda_arn = aws_lambda_function.cop26_origin_request.qualified_arn
    }
  }
}
