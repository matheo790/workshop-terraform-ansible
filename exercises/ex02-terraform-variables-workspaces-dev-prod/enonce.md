# Ex02 — Terraform : Variables + Workspaces (dev/prod)

## 🎯 Objectif
Apprendre à gérer plusieurs environnements (dev/prod) avec Terraform en utilisant :
- Les **workspaces** pour isoler les états
- Les **variables** et **locals** pour personnaliser chaque environnement

Vous allez créer deux environnements qui diffèrent par leurs ports et configurations.

## 📝 Énoncé

### Contexte
Actuellement, votre infrastructure utilise un port fixe (8080). Vous devez la rendre flexible pour supporter :
- **dev** : Nginx sur le port 8080
- **prod** : Nginx sur le port 80

### Étape 1 : Comprendre les workspaces Terraform
Les workspaces permettent de gérer plusieurs instances d'une même infrastructure avec des états séparés.

Listez les workspaces existants :
```bash
cd infra/terraform
terraform workspace list
```

Créez les workspaces `dev` et `prod` :
```bash
terraform workspace new dev
terraform workspace new prod
```

### Étape 2 : Ajouter des variables dynamiques
Modifiez votre code Terraform pour rendre le port configurable selon le workspace actif.

**Dans `variables.tf`**, ajoutez :
```hcl
variable "environment" {
  description = "Environnement (dev, prod)"
  type        = string
  default     = "dev"
}
```

**Dans `main.tf`**, utilisez des `locals` pour définir les configurations par environnement :
```hcl
locals {
  env = terraform.workspace
  
  ports = {
    dev  = 8080
    prod = 80
  }
  
  nginx_port = local.ports[local.env]
}
```

Modifiez le bloc `docker_container` pour Nginx :
```hcl
resource "docker_container" "nginx" {
  # ... existing config ...
  
  ports {
    internal = 80
    external = local.nginx_port
  }
  
  name = "devops-local-lab-nginx-${local.env}"
}
```

Adaptez également les noms des autres ressources avec `${local.env}`.

### Étape 3 : Déployer l'environnement dev
Basculez sur le workspace `dev` et déployez :

```bash
terraform workspace select dev
terraform plan
terraform apply
```

**Vérification** :
```bash
curl http://localhost:8080/health
docker ps --filter "name=nginx-dev"
```

### Étape 4 : Déployer l'environnement prod
Basculez sur `prod` et déployez :

```bash
terraform workspace select prod
terraform plan
terraform apply
```

**Vérification** :
```bash
curl http://localhost:80/health
docker ps --filter "name=nginx-prod"
```

**Note** : Vous devriez avoir maintenant 4 conteneurs : 2 pour dev, 2 pour prod.

### Étape 5 : Détruire les environnements
Nettoyez les deux environnements :

```bash
terraform workspace select dev
terraform destroy

terraform workspace select prod
terraform destroy
```

## ✅ Critères de réussite
- [ ] `terraform workspace list` affiche `dev` et `prod`
- [ ] Dans dev : `curl localhost:8080/health` retourne `{"status":"ok"}`
- [ ] Dans prod : `curl localhost:80/health` retourne `{"status":"ok"}`
- [ ] `docker ps` montre 4 conteneurs avec suffixes `-dev` et `-prod`
- [ ] Les deux environnements coexistent sans conflit
- [ ] Chaque workspace a son propre fichier d'état (`.tfstate`)
- [ ] `terraform destroy` dans chaque workspace nettoie correctement

## 💡 Points clés à retenir
- **Workspaces** = États isolés pour la même configuration
- `terraform.workspace` = variable système donnant le workspace actif
- **locals** = variables calculées réutilisables dans le code
- Nommer les ressources avec l'environnement évite les collisions
- Un workspace = un fichier `.tfstate` distinct

## 🚨 Pièges courants
- Oublier de `terraform workspace select` avant d'appliquer
- Conflits de ports si les deux environnements utilisent le même
- Ne pas inclure `${local.env}` dans les noms de ressources

## 📚 Ressources
- [Terraform Workspaces](https://www.terraform.io/docs/language/state/workspaces.html)
- [Local Values](https://www.terraform.io/docs/language/values/locals.html)
