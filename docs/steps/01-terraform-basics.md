# 3. Terraform : Cycle de vie (Init, Plan, Apply)

<!-- INSTRUCTOR:START -->
## Notes formateur
- Timing recommandé : 10 min démo + 15 min pratique
- Piège : `terraform workspace select` oublié → state sur mauvais env
- À insister : `plan` avant `apply`
<!-- INSTRUCTOR:END -->

**Objectif** : Provisionner une infrastructure de base (réseau + conteneurs) via Terraform.

## Contexte

Nous voulons créer :
- Un réseau Docker isolé : `devops-local-lab-dev-net`
- Un conteneur pour l'application (Python)
- Un conteneur pour le serveur web (Nginx)

## Instructions

### 1. Build de l'image applicative

Terraform va déployer des conteneurs basés sur une image. Construisons l'image de notre application Flask d'abord.

```bash
# Depuis la racine du projet
docker build -t devops-local-lab-flask:latest app/
```

### 2. Initialisation de Terraform

Rendez-vous dans le dossier infrastructure :

```bash
cd infra/terraform
```

Initialisez le projet (téléchargement des providers) :

```bash
terraform init
```

### 3. Planifier le déploiement

Vérifiez ce que Terraform compte faire sans rien modifier :

```bash
terraform plan
```
> **Attention** : Observez la sortie. Terraform doit annoncer la création de `docker_network`, `docker_container.app`, etc.

### 4. Appliquer les changements

Lancez le provisionning :

```bash
terraform apply
# Répondez 'yes' à la confirmation
```

### 5. Vérification

Testez si les conteneurs tournent. L'application expose une route de santé :

```bash
curl http://localhost:8080/health
# Résultat attendu : {"status":"ok"}
```

Vous pouvez aussi voir les conteneurs via Docker :
```bash
docker ps --format "table {{.Names}}\t{{.Ports}}"
```

### 6. Nettoyage

Pour s'entraîner au cycle de vie complet, détruisons l'infrastructure :

```bash
terraform destroy
# Répondez 'yes'
```

***

## Critères de succès
- [ ] La commande `terraform plan` ne retourne pas d'erreur.
- [ ] Après le `apply`, l'URL `http://localhost:8080/health` répond un JSON.
- [ ] Après le `destroy`, `docker ps` ne montre plus les conteneurs du lab.

> 📚 **Pour aller plus loin** : Consultez l'[exercice détaillé Ex01](https://github.com/othila-academy/workshop-terraform-ansible/tree/main/exercises/ex01-terraform-hello-infra-plan-apply-destroy/enonce.md) avec critères de validation complets.

