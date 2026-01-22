# Correction — Ex02 (exemple de patch)

Ajouter dans `infra/terraform/main.tf` :

```hcl
locals {
  workspace      = terraform.workspace
  effective_env  = local.workspace != "default" ? local.workspace : var.env_name
  effective_port = local.effective_env == "prod" ? 80 : 8080
}
```

Puis remplacer :
- `var.env_name` par `local.effective_env`
- `var.host_http_port` par `local.effective_port`

Commandes :
```bash
terraform workspace select dev
terraform apply -auto-approve
curl http://localhost:8080/health

terraform workspace select prod
terraform apply -auto-approve
curl http://localhost/health
```
