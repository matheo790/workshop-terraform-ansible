# 7. Ansible : Nginx & Handlers

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

> 📚 **Pour aller plus loin** : Consultez l'[exercice détaillé Ex05](https://github.com/othila-academy/workshop-terraform-ansible/tree/main/exercises/ex05-ansible-nginx-reverse-proxy-handlers/enonce.md) pour maîtriser les handlers et templates Jinja2.

