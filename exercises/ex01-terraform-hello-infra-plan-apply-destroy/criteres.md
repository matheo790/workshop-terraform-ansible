# Critères — Ex01
- `terraform plan` annonce `docker_network` + conteneurs `app` et `nginx`
- `curl http://localhost:8080/health` renvoie `{"status":"ok"}`
- `terraform destroy` supprime tout
