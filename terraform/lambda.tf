// --- origin response ---

data "archive_file" "lambda_zip_origin_response" {
  type        = "zip"
  output_path = "lambda_zip_file_int.zip"
  source {
    content  = file("../origin_response/src/origin_response.js")
    filename = "origin_response.js"
  }
}

resource "aws_lambda_function" "cop26_origin_response" {
  filename         = data.archive_file.lambda_zip_origin_response.output_path
  source_code_hash = data.archive_file.lambda_zip_origin_response.output_base64sha256
  handler          = "origin_response.handler"

  function_name = "lambda-at-edge-cop26-origin_response"

  runtime = "nodejs12.x"

  role = aws_iam_role.lambda_edge_exec.arn

  # us-east-1 is important, this is where Lambda@Edge are deployed from:
  provider = aws.us_east_1

  # versions are required, so publish needs to be true:
  publish = true

  # Lambda@Edge doesn't support environment variables.
}

// --- origin request ---

data "archive_file" "lambda_zip_origin_request" {
  type        = "zip"
  output_path = "lambda_zip_file_int_1.zip"
  source {
    content  = file("../origin_request/src/origin_request.js")
    filename = "origin_request.js"
  }
}

resource "aws_lambda_function" "cop26_origin_request" {
  filename         = data.archive_file.lambda_zip_origin_request.output_path
  source_code_hash = data.archive_file.lambda_zip_origin_request.output_base64sha256
  handler          = "origin_request.handler"

  function_name = "lambda-at-edge-cop26-origin_request"

  runtime = "nodejs12.x"

  role = aws_iam_role.lambda_edge_exec.arn

  # us-east-1 is important, this is where Lambda@Edge are deployed from:
  provider = aws.us_east_1

  # versions are required, so publish needs to be true:
  publish = true

  # Lambda@Edge doesn't support environment variables.
}
