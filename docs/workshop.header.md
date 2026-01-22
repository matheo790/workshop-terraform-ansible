---
published: true
type: workshop
title: DevOps Lab
short_title: DevOps Lab
description: Workshop DevOps local avec Terraform, Ansible et Docker
level: beginner
authors:
  - Quentin Nicolle
duration_minutes: 120
tags:
  - devops
  - terraform
  - ansible
  - docker

sections_title:
  - "🏁 — Bienvenue"
  - "🧰 — Setup & Prérequis"
  - "🧱 — Terraform : Fondamentaux"
  - "🧩 — Terraform : Variables & Environnements"
  - "🔗 — Terraform → Ansible (Inventory)"
  - "⚙️ — Ansible : Bases"
  - "🌐 — Ansible : Services & Nginx"
  - "🧪 — CI/CD local"
  - "🧯 — Troubleshooting"
---

# DevOps Local Lab Workshop

Bienvenue dans ce workshop **DevOps Local** ! 
Ce laboratoire pratique a pour but de démystifier les concepts de l'Infrastructure as Code (IaC) et de la gestion de configuration.

## Objectif

Construire et gérer une infrastructure complète en local, en utilisant des outils standards de l'industrie :
- **Terraform** pour provisionner l'infrastructure (ici, simulée par des conteneurs Docker).
- **Ansible** pour configurer les serveurs et déployer les applications.
- **Docker** pour héberger nos environnements (pas de coût Cloud !).

Vous allez construire un pipeline de déploiement simulant un environnement réel, mais tournant entièrement sur votre machine.

## Progression

Ce workshop est découpé en étapes progressives :

1. Prérequis & Installation
2. Terraform : Bases & Cycle de vie
3. Terraform : Variables & Workspaces
4. Terraform → Ansible : Inventaire dynamique
5. Ansible : Bootstrap & Docker
6. Ansible : Nginx & Handlers
7. Automatisation : CI/CD Local

## Architecture Cible

À la fin de ce workshop, vous aurez :
- Un réseau Docker géré par Terraform.
- Un conteneur "simulant" une machine virtuelle (accès SSH).
- Une application Python Flask déployée par Ansible.
- Un serveur Nginx configuré comme reverse proxy.
- Un workflow `make deploy` complet.


