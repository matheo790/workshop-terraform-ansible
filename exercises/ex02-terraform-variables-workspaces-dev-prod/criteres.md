# Critères de réussite — Ex02

## Commandes de vérification

### Workspace dev
```bash
cd infra/terraform
terraform workspace select dev
terraform state list
curl http://localhost:8080/health
docker ps --filter "name=dev"
```

### Workspace prod
```bash
terraform workspace select prod
terraform state list
curl http://localhost:80/health
docker ps --filter "name=prod"
```

## Résultats attendus

### ✅ Workspaces
- [ ] `terraform workspace list` affiche `dev` et `prod`
- [ ] Chaque workspace a son propre fichier d'état

### ✅ Environnement dev
- [ ] Nginx accessible sur port **8080**
- [ ] `curl http://localhost:8080/health` → `{"status":"ok"}`
- [ ] Conteneurs nommés avec suffixe `-dev`

### ✅ Environnement prod
- [ ] Nginx accessible sur port **80**
- [ ] `curl http://localhost:80/health` → `{"status":"ok"}`
- [ ] Conteneurs nommés avec suffixe `-prod`

### ✅ Coexistence
- [ ] Les deux environnements fonctionnent simultanément
- [ ] Pas de conflit de ports ou de noms
- [ ] `docker ps` montre 4 conteneurs (2 dev + 2 prod)

### ✅ Code Terraform
- [ ] Variables ou locals définissent les ports par environnement
- [ ] `terraform.workspace` utilisé pour déterminer l'environnement
- [ ] Noms de ressources incluent `${local.env}` ou similaire
- [ ] `terraform fmt` et `terraform validate` passent sans erreur
