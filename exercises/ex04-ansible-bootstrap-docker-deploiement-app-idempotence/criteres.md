# Critères de réussite — Ex04

## Commandes de vérification

```bash
# Première exécution
cd infra/ansible
ansible-playbook -i inventory.ini site.yml

# Vérifier l'idempotence (deuxième exécution)
ansible-playbook -i inventory.ini site.yml

# Vérifier l'application
curl http://localhost:5000/health
docker ps --filter "name=flask_app"

# Vérifier Docker
ansible vm -i inventory.ini -m shell -a "docker --version" --become
```

## Résultats attendus

### ✅ Première exécution
- [ ] Playbook s'exécute sans erreur
- [ ] Tous les rôles sont appliqués : `bootstrap`, `docker`, `app`
- [ ] Compteur `changed` > 0 dans le PLAY RECAP
- [ ] Aucune task `failed`

### ✅ Idempotence (deuxième exécution)
- [ ] Playbook s'exécute sans erreur
- [ ] PLAY RECAP affiche `changed=0` ou très peu de changements
- [ ] Message : `ok=X changed=0 unreachable=0 failed=0`
- [ ] Aucune réinstallation de packages

### ✅ Installation Docker
- [ ] Docker est installé sur la VM
- [ ] `docker --version` retourne une version valide
- [ ] Service Docker actif : `systemctl status docker` → `active (running)`
- [ ] Docker Compose installé

### ✅ Déploiement de l'app
- [ ] Conteneur `flask_app` actif
- [ ] `curl http://localhost:5000/health` → `{"status":"ok"}`
- [ ] Fichier `/opt/devops-lab-app/docker-compose.yml` présent
- [ ] App accessible et répond correctement

### ✅ Structure des rôles Ansible
- [ ] Rôle `bootstrap` : installe packages de base
- [ ] Rôle `docker` : installe Docker et Docker Compose
- [ ] Rôle `app` : déploie l'application
- [ ] Playbook `site.yml` : orchestre tous les rôles

### ✅ Bonnes pratiques
- [ ] Utilisation de modules Ansible (pas de `shell`/`command` sauf nécessaire)
- [ ] `become: yes` utilisé pour les tâches nécessitant sudo
- [ ] Templates Jinja2 (`.j2`) pour les fichiers de configuration
- [ ] Handlers définis si nécessaire
- [ ] Collection `community.docker` installée et utilisée
