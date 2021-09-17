SHELL := /usr/bin/env bash
DEFAULT_GOAL := test
PHONY = clean

test: clean
	cd origin_response && npm test
	cd origin_request && npm test
	cd terraform && terraform init
	cd terraform && terraform validate

plan: test
	cd terraform && terraform plan -var-file="production.tfvars"

apply: test
	cd terraform && terraform apply -var-file="production.tfvars"

clean:
	cd terraform && rm .terraform.* || echo "No tf files to clean"
	rm *.zip || echo "No zip files to clean"
