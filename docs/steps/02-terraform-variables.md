# 4. Terraform : Variables & Workspaces

<!-- INSTRUCTOR:START -->
## Notes formateur
- Timing recommandé : 10 min démo + 15 min pratique
- Piège : `terraform workspace select` oublié → state sur mauvais env
- À insister : `plan` avant `apply`
<!-- INSTRUCTOR:END -->

**Objectif** : Gérer plusieurs environnements (Dev et Prod) avec le même code Terraform.

## Contexte

Nous voulons simuler deux environnements distincts :
- **dev** : Accessible sur le port `8080`.
- **prod** : Accessible sur le port `80` (standard HTTP).

Au lieu de dupliquer les fichiers `.tf`, nous utiliserons les **Terraform Workspaces**.

## Instructions

### 1. Création des workspaces

Par défaut, vous êtes dans le workspace `default`. Créons-en d'autres :

```bash
cd infra/terraform

# Créer l'environnement de dev
terraform workspace new dev

# Créer l'environnement de prod
terraform workspace new prod
```

### 2. Lister et basculer

Pour voir où vous êtes :
```bash
terraform workspace list
terraform workspace show
```

Pour changer d'environnement :
```bash
terraform workspace select dev
```

### 3. Application en Dev

Assurez-vous d'être sur `dev` et déployez :

```bash
terraform workspace select dev
terraform apply -auto-approve
```

> **Note** : Terraform utilise le nom du workspace pour suffixer les ressources ou choisir les variables (selon la configuration dans `main.tf` ou `variables.tf`).

Testez l'accès **Dev** :
```bash
curl http://localhost:8080/health
```

### 4. Application en Prod

Basculez sur prod et déployez :

```bash
terraform workspace select prod
terraform apply -auto-approve
```

Testez l'accès **Prod** :
```bash
curl http://localhost:80/health
```
*(Si le port 80 est protégé ou pris sur votre machine, cela peut échouer. Dans ce lab, nous assumons que le 80 est libre ou mappé différemment selon votre configuration `variables.tf`).*

***

## Points d'attention
- Chaque workspace a son propre fichier d'état (`terraform.tfstate.d/<workspace>/`).
- Une mauvaise gestion des workspaces peut écraser la prod avec une conf de dev si on ne fait pas attention au `select`.

> 📚 **Pour aller plus loin** : Consultez l'[exercice détaillé Ex02](https://github.com/othila-academy/workshop-terraform-ansible/tree/main/exercises/ex02-terraform-variables-workspaces-dev-prod) avec exemples de code HCL complets.

