# Exercices DevOps Local Lab

## 📚 Vue d'ensemble

Ce dossier contient 6 exercices progressifs pour apprendre l'Infrastructure as Code (IaC) avec Terraform et Ansible en environnement local.

### 🔗 Lien avec le Workshop MOAW

Ces exercices sont la **version détaillée et autonome** du [Workshop MOAW](../docs/) disponible en ligne. 

**Correspondance** :
| Workshop MOAW | Exercice | Contenu |
|---------------|----------|----------|
| [Step 01: Terraform Basics](../docs/steps/01-terraform-basics.md) | [Ex01](ex01-terraform-hello-infra-plan-apply-destroy/) | Cycle de vie Terraform |
| [Step 02: Variables & Workspaces](../docs/steps/02-terraform-variables.md) | [Ex02](ex02-terraform-variables-workspaces-dev-prod/) | Multi-environnements |
| [Step 03: Inventory](../docs/steps/03-inventory.md) | [Ex03](ex03-terraform-ansible-generer-inventory-ini-automatiquement/) | Intégration T+A |
| [Step 04: Ansible Basics](../docs/steps/04-ansible-basics.md) | [Ex04](ex04-ansible-bootstrap-docker-deploiement-app-idempotence/) | Playbooks & Rôles |
| [Step 05: Services](../docs/steps/05-services.md) | [Ex05](ex05-ansible-nginx-reverse-proxy-handlers/) | Nginx & Handlers |
| [Step 06: CI/CD](../docs/steps/06-cicd.md) | [Ex06](ex06-chainage-makefile-mini-ci-cd-local/) | Pipeline Makefile |

## 🗂️ Structure de chaque exercice

```
exXX-nom-exercice/
├── enonce.md           # Énoncé détaillé avec étapes guidées
├── criteres.md         # Critères de réussite vérifiables
└── correction/
    └── README.md       # Solution et explications
```

## 🎯 Parcours d'apprentissage

### Ex01 — Terraform : Hello Infra (plan/apply/destroy)
**Concepts** : Cycle de vie Terraform, providers, ressources Docker  
**Durée** : ~15 minutes  
**Objectif** : Déployer une première infrastructure avec Terraform

### Ex02 — Terraform : Variables + Workspaces (dev/prod)
**Concepts** : Workspaces, variables, locals, multi-environnements  
**Durée** : ~25 minutes  
**Objectif** : Gérer plusieurs environnements avec états isolés

### Ex03 — Terraform → Ansible : Générer inventory.ini automatiquement
**Concepts** : Intégration Terraform/Ansible, local_file, automation  
**Durée** : ~20 minutes  
**Objectif** : Connecter le provisioning à la configuration

### Ex04 — Ansible : Bootstrap + Docker + Déploiement app (idempotence)
**Concepts** : Playbooks, rôles, modules, idempotence, Docker  
**Durée** : ~35 minutes  
**Objectif** : Configurer une VM et déployer une application

### Ex05 — Ansible : Nginx reverse proxy + handlers
**Concepts** : Handlers, templates Jinja2, reverse proxy, reload graceful  
**Durée** : ~30 minutes  
**Objectif** : Mettre en place un reverse proxy intelligent

### Ex06 — Chaînage : Makefile (mini CI/CD local)
**Concepts** : Orchestration, automation, pipeline, Makefile  
**Durée** : ~25 minutes  
**Objectif** : Créer un pipeline de déploiement complet

## 🚀 Ordre recommandé

**Parcours standard** : Ex01 → Ex02 → Ex03 → Ex04 → Ex05 → Ex06

**Parcours accéléré** (si vous connaissez déjà Terraform) : Ex03 → Ex04 → Ex05 → Ex06

**Parcours Ansible uniquement** (si infra déjà provisionnée) : Ex04 → Ex05

## ✅ Prérequis

- Docker installé et actif
- Terraform >= 1.0
- Ansible >= 2.9
- Make (GNU Make)
- curl, jq (pour les tests)

## 🎓 Compétences acquises

À la fin de ce workshop, vous saurez :
- ✅ Provisionner des ressources avec Terraform
- ✅ Gérer plusieurs environnements (workspaces)
- ✅ Générer des fichiers dynamiquement (IaC end-to-end)
- ✅ Écrire des playbooks Ansible idempotents
- ✅ Utiliser les rôles et handlers Ansible
- ✅ Automatiser tout le pipeline avec Makefile
- ✅ Appliquer les bonnes pratiques DevOps

## 💡 Conseils

- **Lisez l'énoncé en entier** avant de commencer
- **Testez à chaque étape** plutôt qu'à la fin
- **L'idempotence est clé** : vos scripts doivent pouvoir s'exécuter N fois
- **Les erreurs sont normales** : utilisez les logs pour debugger
- **Validez avec les critères** : ce sont vos tests de réussite

## 🆘 Besoin d'aide ?

1. Consultez les critères de réussite (`criteres.md`)
2. Vérifiez les logs des outils (Terraform, Ansible, Docker)
3. Testez les commandes isolément
4. Consultez la correction en dernier recours

## 📖 Ressources

- [Documentation Terraform](https://www.terraform.io/docs)
- [Documentation Ansible](https://docs.ansible.com/)
- [GNU Make Manual](https://www.gnu.org/software/make/manual/)
- [Docker Documentation](https://docs.docker.com/)

Bon workshop ! 🚀
