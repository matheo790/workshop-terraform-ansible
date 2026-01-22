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

---

# 2. Prérequis & Setup

> **🧭 Progression : Étape 1/8**
>
> ✅ À la fin, je valide avec : `curl http://localhost:8080/health` (si applicable)


<!-- INSTRUCTOR:START -->
## Notes formateur
- Timing recommandé : 10 min démo + 15 min pratique
- Piège : `terraform workspace select` oublié → state sur mauvais env
- À insister : `plan` avant `apply`
<!-- INSTRUCTOR:END -->

Avant de commencer, assurons-nous que votre environnement est prêt.

## Outils nécessaires

Vous devez avoir installé sur votre machine :

1. **Docker Desktop** (ou Docker Engine sous Linux).
   - Vérification : `docker version`
2. **Terraform** (v1.0+).
   - Vérification : `terraform -version`
3. **Ansible**.
   - Vérification : `ansible --version`
4. **Make** (généralement présent sur Linux/macOS, installable via Chocolatey/Scoop sur Windows ou via WSL2).
5. **Python 3** (pour l'application de test).

> **Note pour les utilisateurs Windows** : Il est fortement recommandé d'utiliser **WSL2** (Ubuntu) pour ce workshop afin d'éviter les problèmes de compatibilité, notamment avec Ansible.

## Préparation du projet

1. Clonez ce dépôt (si ce n'est pas déjà fait) :
   ```bash
   git clone <url-du-repo> devops-local-lab
   cd devops-local-lab
   ```

2. Vérifiez la structure :
   ```bash
   ls -F
   # Devrait afficher : app/  docs/  exercises/  infra/  Makefile ...
   ```

3. Testez votre environnement Docker :
   ```bash
   docker run --rm hello-world
   ```
   *Vous devez voir un message de succès.*

## Nettoyage préventif

Si vous avez déjà des conteneurs qui tournent sur les ports `8080`, `2222` ou `5000`, arrêtez-les pour éviter les conflits.

```bash
# Lister les ports utilisés
lsof -i :8080
lsof -i :2222
```

## Prochaine étape

Une fois les outils installés, nous pouvons attaquer l'infrastructure.

---

# 3. Terraform : Cycle de vie (Init, Plan, Apply)

> **🧭 Progression : Étape 2/8**
>
> ✅ À la fin, je valide avec : `curl http://localhost:8080/health` (si applicable)


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

> 📚 **Pour aller plus loin** : Consultez l'[exercice détaillé Ex01](../../exercises/ex01-terraform-hello-infra-plan-apply-destroy/enonce.md) avec critères de validation complets.

---

# 4. Terraform : Variables & Workspaces

> **🧭 Progression : Étape 3/8**
>
> ✅ À la fin, je valide avec : `curl http://localhost:8080/health` (si applicable)


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

> 📚 **Pour aller plus loin** : Consultez l'[exercice détaillé Ex02](../../exercises/ex02-terraform-variables-workspaces-dev-prod/enonce.md) avec exemples de code HCL complets.

---

# 5. Terraform → Ansible : Inventaire Dynamique

> **🧭 Progression : Étape 4/8**
>
> ✅ À la fin, je valide avec : `curl http://localhost:8080/health` (si applicable)


**Objectif** : Connecter l'IaC (Terraform) à la Gestion de Config (Ansible) en générant automatiquement le fichier d'inventaire.

## Contexte

Pour qu'Ansible puisse configurer nos serveurs, il doit connaître leurs adresses IP. Dans un monde dynamique (Cloud/Docker), ces IP changent. Terraform connaît ces infos après le déploiement.

Nous allons utiliser un **Output** Terraform et un template pour générer `inventory.ini`.

## Instructions

### 1. Déployer l'infrastructure

Si ce n'est pas fait (depuis l'étape précédente), assurez-vous d'avoir une infra qui tourne (workspace `dev` recommandé).

```bash
cd infra/terraform
terraform workspace select dev
terraform apply -auto-approve
```

### 2. Vérifier la génération

Terraform a été configuré (via `local_file` ou `template_file` dans le code existant) pour créer un fichier `infra/ansible/inventory.ini`.

Vérifiez son contenu :

```bash
cat ../ansible/inventory.ini
```

Il doit ressembler à ceci :
```ini
[vm]
127.0.0.1 ansible_port=2222 ansible_user=ansible ansible_password=ansible ansible_become=true
```
*(L'IP et le port dépendent de votre mapping Docker).*

### 3. Tester la connectivité Ansible

Maintenant qu'Ansible sait où taper, testons la connexion SSH.
Cette "VM" simulée est en fait un conteneur Docker avec un serveur SSH.

```bash
cd ../ansible
ansible -i inventory.ini vm -m ping
```

**Succès attendu** :
```json
127.0.0.1 | SUCCESS => {
    "changed": false,
    "ping": "pong"
}
```

> **Troubleshooting** : Si le ping échoue avec "Connection refused", vérifiez que le conteneur SSH tourne (`docker ps`) et que le port 2222 est bien mappé.

> 📚 **Pour aller plus loin** : Consultez l'[exercice détaillé Ex03](../../exercises/ex03-terraform-ansible-generer-inventory-ini-automatiquement/enonce.md) pour comprendre la génération dynamique d'inventory.

---

# 6. Ansible : Bootstrap & Déploiement App

> **🧭 Progression : Étape 5/8**
>
> ✅ À la fin, je valide avec : `curl http://localhost:8080/health` (si applicable)


**Objectif** : Configurer le serveur (conteneur) et y déployer l'application de manière idempotente.

## Contexte

Notre infra est là (`terraform`), notre inventaire est prêt. Maintenant, Ansible entre en scène pour :
1. **Bootstrap** : Installer les dépendances système (Docker, Python, curl...).
2. **Déployer** : Lancer l'application via Docker Compose (piloté par Ansible).

## Instructions

### 1. Analyse du Playbook

Regardez le fichier `infra/ansible/site.yml`. Il orchestre les rôles.
Les rôles sont dans `infra/ansible/roles/`.

### 2. Exécuter le Playbook

Lancez la configuration :

```bash
cd infra/ansible
ansible-playbook -i inventory.ini site.yml
```

Observez les tâches :
- `TASK [bootstrap : install packages]`
- `TASK [app : copy docker-compose]`
- `TASK [app : start application]`

### 3. Vérifier l'Idempotence

La force d'Ansible est l'idempotence : relancer le même script ne doit rien casser et ne rien changer si tout est déjà OK.

Relancez la commande :
```bash
ansible-playbook -i inventory.ini site.yml
```

Regardez le récapitulatif `PLAY RECAP` à la fin.
- `changed=0` : C'est parfait !
- `changed > 0` : Quelque chose a été modifié, ce n'est pas idempotent.

### 4. Vérifier l'application

Si le playbook est passé, l'application devrait tourner *dans* le conteneur cible (ou sur la machine hôte selon le mode de déploiement choisi dans le lab).

Dans ce lab spécifique, Ansible configure un conteneur qui lui-même lance des conteneurs (Docker-in-Docker ou socket mapping) ou configure le service.

***

## Critères de succès
- [ ] Le premier run Ansible termine sans erreur (`failed=0`).
- [ ] Le second run indique `changed=0`.

> 📚 **Pour aller plus loin** : Consultez l'[exercice détaillé Ex04](../../exercises/ex04-ansible-bootstrap-docker-deploiement-app-idempotence/enonce.md) avec exemples complets de rôles Ansible.

---

# 7. Ansible : Nginx & Handlers

> **🧭 Progression : Étape 6/8**
>
> ✅ À la fin, je valide avec : `curl http://localhost:8080/health` (si applicable)


**Objectif** : Configurer un Reverse Proxy Nginx devant notre application et maîtriser les handlers Ansible.

## Contexte

Plutôt que d'exposer l'application Flask directement, nous mettons Nginx devant.
Si nous changeons la configuration Nginx, le service doit redémarrer. Si nous ne changeons rien, il ne doit pas redémarrer inutilement. C'est le rôle des **Handlers**.

## Instructions

### 1. Le Rôle Nginx

Le rôle `infra/ansible/roles/nginx` déploie :
- Le paquet/conteneur Nginx.
- Le fichier de configuration `default.conf` via un template Jinja2.

### 2. Déployer (si ce n'est pas déjà inclus dans site.yml)

Dans ce lab, le rôle nginx est généralement inclus dans `site.yml`. Assurez-vous qu'il est activé.

```bash
cd infra/ansible
ansible-playbook -i inventory.ini site.yml
```
*(Si vous l'avez déjà lancé à l'étape précédente, Ansible va vérifier la config Nginx).*

### 3. Tester le Handler

Pour voir le handler en action ("restart nginx"), modifions artificiellement la configuration ou simulons un changement.

Ou, plus simple, observez la première exécution :
- Si la config change (`template: default.conf.j2`), Ansible notifie le handler.
- À la fin du play, le handler s'exécute : `RUNNING HANDLER [nginx : restart nginx]`.

Si vous relancez le playbook sans rien changer, le handler ne s'exécute pas.

### 4. Vérification du Service

L'accès à l'application doit fonctionner à travers Nginx.
Selon votre map de ports Terraform :

```bash
curl http://localhost:8080
```
(Ou le port défini pour le load balancer/proxy).

> 📚 **Pour aller plus loin** : Consultez l'[exercice détaillé Ex05](../../exercises/ex05-ansible-nginx-reverse-proxy-handlers/enonce.md) pour maîtriser les handlers et templates Jinja2.

---

# 8. Automatisation : CI/CD Local

> **🧭 Progression : Étape 7/8**
>
> ✅ À la fin, je valide avec : `curl http://localhost:8080/health` (si applicable)


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

> 📚 **Pour aller plus loin** : Consultez l'[exercice détaillé Ex06](../../exercises/ex06-chainage-makefile-mini-ci-cd-local/enonce.md) avec un Makefile complet et des targets avancées.

---

# Troubleshooting

> **🧭 Progression : Étape 8/8**
>
> ✅ À la fin, je valide avec : `curl http://localhost:8080/health` (si applicable)


Guide de résolution des problèmes courants rencontrés lors de ce workshop.

> 💡 **Astuce** : Chaque exercice détaillé contient une section "Pièges courants" intégrée. Consultez le dossier [`exercises/`](../../exercises/) pour plus de détails.

## 1. Conflits de Ports (Address already in use)

**Symptôme** : Terraform échoue avec `Error: Bind for 0.0.0.0:8080 failed: port is already allocated`.

**Solution** :
Un autre processus utilise le port.
```bash
# Identifier le coupable
lsof -i :8080
# Le tuer (remplacez PID)
kill -9 <PID>
```
Souvent, c'est un vieux conteneur Docker oublié.
```bash
docker rm -f $(docker ps -aq)
# Attention, cela supprime TOUS vos conteneurs locaux.
```

## 2. Docker Provider Error

**Symptôme** : Terraform ne parvient pas à se connecter au socket Docker.

**Solution** :
- Vérifiez que Docker Desktop est lancé.
- Sous Linux/WSL, vérifiez les droits : `sudo usermod -aG docker $USER` (nécessite un relogin).

## 3. Ansible "Connection refused" (SSH)

**Symptôme** : `fatal: [vm]: UNREACHABLE! => {"changed": false, "msg": "Failed to connect to the host via ssh: ssh: connect to host 127.0.0.1 port 2222: Connection refused"}`

**Solution** :
- Le conteneur cible n'est peut-être pas démarré. Vérifiez `docker ps`.
- Le port mapping est incorrect. Vérifiez `infra/terraform/main.tf` et le fichier `inventory.ini` généré.
- Attendez quelques secondes que le service SSH du conteneur soit prêt après le `terraform apply`.

## 4. Terraform State Lock

**Symptôme** : `Error: Error acquiring the state lock`.

**Solution** :
Cela arrive si un `apply` précédent a crashé.
```bash
terraform force-unlock <LOCK_ID>
```
*(L'ID est donné dans le message d'erreur).*

## 5. SSH Host Key Verification Failed

**Symptôme** : Ansible se plaint que la clé d'hôte a changé (fréquent car on recrée les conteneurs souvent).

**Solution** :
Le `ansible.cfg` fourni dans ce lab devrait contenir `host_key_checking = False`.
Vérifiez que vous executez bien ansible depuis le dossier `infra/ansible` où se trouve ce fichier de config.