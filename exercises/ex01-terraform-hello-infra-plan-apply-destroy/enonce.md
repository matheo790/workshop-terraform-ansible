# Ex01 — Terraform : Hello Infra (plan/apply/destroy)

## 🎯 Objectif
Découvrir le cycle de vie Terraform de base : **init → plan → apply → destroy**.  
Vous allez provisionner une infrastructure Docker locale avec :
- Un réseau Docker
- Un conteneur Flask (l'app)
- Un conteneur Nginx (reverse proxy)

## 📝 Énoncé

### Étape 1 : Build de l'image Docker de l'app
Avant de provisionner l'infra, construisez l'image de l'application Flask :

```bash
docker build -t devops-local-lab-flask:latest app/
```

**Vérification** : `docker images | grep devops-local-lab-flask` doit afficher votre image.

### Étape 2 : Initialiser Terraform
Placez-vous dans le dossier Terraform et initialisez le provider :

```bash
cd infra/terraform
terraform init
```

**Résultat attendu** : Téléchargement du provider `kreuzwerker/docker` et création du dossier `.terraform/`.

### Étape 3 : Planifier les changements
Visualisez les ressources que Terraform va créer :

```bash
terraform plan
```

**Résultat attendu** : Plan affichant la création de :
- 1 réseau Docker (`docker_network.devops_local_lab_network`)
- 2 conteneurs (`docker_container.app`, `docker_container.nginx`)

### Étape 4 : Appliquer l'infrastructure
Créez les ressources :

```bash
terraform apply
```

Tapez `yes` pour confirmer.

**Vérification** : 
```bash
docker ps
```
Vous devez voir 2 conteneurs actifs : `devops-local-lab-app` et `devops-local-lab-nginx`.

### Étape 5 : Tester l'application
Testez le endpoint de santé de l'app via Nginx :

```bash
curl http://localhost:8080/health
```

**Résultat attendu** :
```json
{"status":"ok"}
```

### Étape 6 : Détruire l'infrastructure
Supprimez toutes les ressources créées :

```bash
terraform destroy
```

Tapez `yes` pour confirmer.

**Vérification** : `docker ps` ne doit plus afficher les conteneurs.

## ✅ Critères de réussite
- [ ] `terraform init` réussit sans erreur
- [ ] `terraform plan` affiche 3 ressources à créer (réseau + 2 conteneurs)
- [ ] `terraform apply` crée les ressources et affiche `Apply complete!`
- [ ] `curl http://localhost:8080/health` retourne `{"status":"ok"}`
- [ ] `docker ps` affiche 2 conteneurs : app et nginx
- [ ] `terraform destroy` supprime toutes les ressources
- [ ] Après destroy, `docker ps` ne montre plus les conteneurs

## 💡 Points clés à retenir
- **init** : Télécharge les providers nécessaires
- **plan** : Preview des changements (n'applique rien)
- **apply** : Crée/modifie les ressources
- **destroy** : Supprime tout ce que Terraform gère
- Le fichier `terraform.tfstate` stocke l'état actuel de l'infra

## 📚 Ressources
- [Terraform CLI Commands](https://www.terraform.io/cli/commands)
- [Docker Provider](https://registry.terraform.io/providers/kreuzwerker/docker/latest/docs)
