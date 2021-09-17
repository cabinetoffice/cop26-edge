provider "aws" {
  region = "eu-west-2"
}

provider "aws" {
  alias  = "us_east_1"
  region = "us-east-1"
}

terraform {
  backend "s3" {
    bucket = "co-cop-twentysix-edge-tfstate"
    key    = "edge.tfstate"
    region = "eu-west-2"
  }
}
