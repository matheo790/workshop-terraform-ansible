SHELL := /bin/bash
.PHONY: infra configure deploy destroy outputs lint

infra:
	cd infra/terraform && terraform init && terraform apply -auto-approve

configure:
	cd infra/ansible && ansible-playbook -i inventory.ini site.yml

deploy: infra configure

destroy:
	cd infra/terraform && terraform destroy -auto-approve

outputs:
	cd infra/terraform && terraform output

lint:
	@echo "TODO: terraform fmt/validate + ansible-lint + python lint"
