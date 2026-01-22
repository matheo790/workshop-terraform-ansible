# Critères de réussite — Ex05

## Commandes de vérification

```bash
# Exécution du playbook
cd infra/ansible
ansible-playbook -i inventory.ini site.yml

# Vérifier Nginx
ansible vm -i inventory.ini -m shell -a "nginx -t" --become
ansible vm -i inventory.ini -m shell -a "systemctl status nginx" --become

# Tester le reverse proxy
curl http://localhost:80/health
curl -I http://localhost:80/

# Vérifier l'idempotence des handlers
ansible-playbook -i inventory.ini site.yml

# Modifier le template et relancer
# (ajouter un commentaire dans default.conf.j2)
ansible-playbook -i inventory.ini site.yml
```

## Résultats attendus

### ✅ Installation Nginx
- [ ] Nginx installé sur la VM
- [ ] Service Nginx actif : `systemctl status nginx` → `active (running)`
- [ ] Nginx démarre automatiquement au boot
- [ ] `nginx -t` → `syntax is ok`

### ✅ Configuration reverse proxy
- [ ] Fichier `/etc/nginx/sites-available/default` déployé
- [ ] Configuration pointe vers `flask_app:5000`
- [ ] Headers proxy configurés (X-Real-IP, X-Forwarded-For, etc.)
- [ ] Location `/health` configurée sans logs

### ✅ Fonctionnement du proxy
- [ ] `curl http://localhost:80/health` → `{"status":"ok"}`
- [ ] Requête transite par Nginx vers Flask
- [ ] Headers HTTP corrects dans les réponses
- [ ] Pas d'erreur 502 Bad Gateway

### ✅ Handlers
- [ ] Handler `Reload Nginx` défini dans `handlers/main.yml`
- [ ] Task de déploiement de config contient `notify: Reload Nginx`
- [ ] Première exécution : handler déclenché
- [ ] Deuxième exécution (sans changement) : handler NON déclenché
- [ ] Modification du template : handler déclenché

### ✅ Idempotence des handlers
- [ ] Relancer le playbook sans changer la config → `changed=0` pour la task de config
- [ ] Handler non déclenché si pas de changement
- [ ] Modifier la config → `changed=1` et handler déclenché
- [ ] Utilisation de `reload` plutôt que `restart` (graceful)

### ✅ Structure du rôle
- [ ] Rôle `nginx` créé avec structure complète
- [ ] `tasks/main.yml` : installation + déploiement config
- [ ] `templates/default.conf.j2` : template Nginx
- [ ] `handlers/main.yml` : handler de reload
- [ ] Rôle ajouté au `site.yml`

### ✅ Bonnes pratiques
- [ ] Utilisation du module `template` pour la config
- [ ] Handler nommé explicitement
- [ ] `notify` utilisé correctement
- [ ] Config Nginx validée avant reload (safe)
