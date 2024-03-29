SHELL := /usr/bin/env bash
DEFAULT_GOAL := test
PHONY = clean

install:
	cd origin_response && npm install
	cd origin_request && npm install

test: install clean
	cd origin_response && npm test
	cd origin_request && npm test
	cd terraform && terraform init -backend=false
	cd terraform && terraform validate

plan: test
	cd terraform && terraform plan -var-file="production.tfvars"

apply: test
	cd terraform && terraform apply -var-file="production.tfvars"

ghapply:
	cd terraform && terraform init
	cd terraform && terraform apply -var-file="production.tfvars" -auto-approve

clean:
	cd terraform && rm .terraform.* || echo "No tf files to clean"
	rm *.zip || echo "No zip files to clean"
