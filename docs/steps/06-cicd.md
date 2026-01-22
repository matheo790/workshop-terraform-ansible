# 8. Automatisation : CI/CD Local

**Objectif** : Chaîner toutes les étapes commandes via un `Makefile` pour simuler un pipeline CI/CD.

## Contexte

Dans la vraie vie (GitHub Actions, GitLab CI), nous ne tapons pas les commandes une par une. Nous appelons des scripts. Ici, `make` sera notre orchestrateur.

## Le Makefile

Analysez le fichier `Makefile` à la racine. Il contient :
- `make infra` : Init + Apply Terraform.
- `make configure` : Ansible Playbook.
- `make deploy` : Infra + Configure (le pipeline complet).
- `make destroy` : Nettoyage.

## Instructions

### 1. Tout détruire (Reset)

Repartons de zéro pour tester le pipeline complet.

```bash
make destroy
```

### 2. Déploiement "One-Click"

Lancez le déploiement complet :

```bash
make deploy
```

Observez l'enchaînement :
1. Terraform provisionne le réseau et les conteneurs.
2. Terraform génère l'inventaire.
3. Ansible se connecte et installe tout.

### 3. Validation

Une fois terminé, validez que l'application répond :

```bash
curl http://localhost:8080/health
```

### 4. La fin

Félicitations ! Vous avez déployé une infrastructure complète et une application configurée automatiquement, le tout en local.

Vous pouvez nettoyer :
```bash
make destroy
```

> 📚 **Pour aller plus loin** : Consultez l'[exercice détaillé Ex06](https://github.com/othila-academy/workshop-terraform-ansible/tree/main/exercises/ex06-chainage-makefile-mini-ci-cd-local/enonce.md) avec un Makefile complet et des targets avancées.
