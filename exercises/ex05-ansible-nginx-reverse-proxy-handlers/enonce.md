# Ex05 — Ansible : Nginx reverse proxy + handlers

## 🎯 Objectif
Installer et configurer Nginx comme reverse proxy devant l'application Flask.  
Utiliser les **handlers** pour redémarrer Nginx uniquement lorsque la configuration change.

## 📝 Énoncé

### Contexte
Votre app Flask tourne en direct sur le port 5000.  
Vous allez mettre en place Nginx pour :
- Servir l'app sur le port 80
- Gérer les headers HTTP proprement
- Avoir un point d'entrée unique pour l'app

### Étape 1 : Créer le rôle `nginx`
Structure attendue :
```
infra/ansible/roles/nginx/
├── tasks/
│   └── main.yml
├── templates/
│   └── default.conf.j2
└── handlers/
    └── main.yml
```

### Étape 2 : Installer Nginx
**Fichier : `infra/ansible/roles/nginx/tasks/main.yml`**
```yaml
---
- name: Install Nginx
  ansible.builtin.apt:
    name: nginx
    state: present
    update_cache: yes
  become: yes

- name: Ensure Nginx is started and enabled
  ansible.builtin.systemd:
    name: nginx
    state: started
    enabled: yes
  become: yes

- name: Deploy Nginx configuration
  ansible.builtin.template:
    src: default.conf.j2
    dest: /etc/nginx/sites-available/default
    mode: '0644'
  become: yes
  notify: Reload Nginx

- name: Remove default Nginx welcome page
  ansible.builtin.file:
    path: /var/www/html/index.nginx-debian.html
    state: absent
  become: yes
```

### Étape 3 : Créer le template de configuration Nginx
**Fichier : `infra/ansible/roles/nginx/templates/default.conf.j2`**
```nginx
server {
    listen 80;
    server_name _;

    location / {
        proxy_pass http://flask_app:5000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    location /health {
        proxy_pass http://flask_app:5000/health;
        access_log off;
    }
}
```

**Note** : `flask_app` doit être le nom du conteneur Docker (résolution DNS interne).

### Étape 4 : Créer le handler
**Fichier : `infra/ansible/roles/nginx/handlers/main.yml`**
```yaml
---
- name: Reload Nginx
  ansible.builtin.systemd:
    name: nginx
    state: reloaded
  become: yes

- name: Restart Nginx
  ansible.builtin.systemd:
    name: nginx
    state: restarted
  become: yes
```

### Étape 5 : Ajouter le rôle au playbook
**Fichier : `infra/ansible/site.yml`**
```yaml
---
- name: Configure VM and deploy app
  hosts: vm
  become: yes
  
  roles:
    - bootstrap
    - docker
    - app
    - nginx  # <-- Ajout du rôle nginx
```

### Étape 6 : Exécuter le playbook
```bash
cd infra/ansible
ansible-playbook -i inventory.ini site.yml
```

**Résultat attendu** :
- Installation de Nginx
- Déploiement de la configuration
- Handler `Reload Nginx` déclenché

### Étape 7 : Tester le reverse proxy
```bash
curl http://localhost:80/health
```

**Résultat attendu** :
```json
{"status":"ok"}
```

### Étape 8 : Prouver l'utilité des handlers
Relancez le playbook **sans modifier la config** :

```bash
ansible-playbook -i inventory.ini site.yml
```

**Résultat attendu** :
- Task `Deploy Nginx configuration` : `ok` (pas `changed`)
- Handler `Reload Nginx` : **NON déclenché**

Maintenant, modifiez le template (ajoutez un commentaire) :

```nginx
# Updated config
server {
    listen 80;
    ...
}
```

Relancez le playbook :

**Résultat attendu** :
- Task `Deploy Nginx configuration` : `changed`
- Handler `Reload Nginx` : **déclenché**

### Étape 9 : Vérifier les logs Nginx
```bash
ansible vm -i inventory.ini -m shell -a "tail -20 /var/log/nginx/access.log" --become
```

Vous devriez voir les requêtes vers `/health`.

## ✅ Critères de réussite
- [ ] Nginx est installé et actif sur la VM
- [ ] `curl http://localhost:80/health` retourne `{"status":"ok"}`
- [ ] Le handler `Reload Nginx` est déclenché uniquement si la config change
- [ ] Une deuxième exécution sans changement ne recharge pas Nginx
- [ ] La configuration utilise des variables proxy correctes (`X-Real-IP`, etc.)
- [ ] Aucun downtime lors du reload (Nginx reload = graceful)

## 💡 Points clés à retenir
- **Handlers** = tâches déclenchées par `notify` uniquement si changement
- `notify` peut être appelé plusieurs fois → handler exécuté **une seule fois** à la fin
- `reload` vs `restart` : reload = graceful (pas de downtime)
- Templates Jinja2 (`.j2`) permettent de générer des configs dynamiques
- Nginx reverse proxy = point d'entrée unique + gestion headers + cache

## 🚨 Pièges courants
- Oublier `notify: Reload Nginx` → config déployée mais pas appliquée
- Utiliser `restart` au lieu de `reload` → downtime inutile
- Proxy vers `localhost` au lieu du nom de conteneur → échec de connexion
- Handler mal nommé (nom différent entre `notify` et handler)

## 🔧 Débug : Tester la config Nginx manuellement
Sur la VM :
```bash
ansible vm -i inventory.ini -m shell -a "nginx -t" --become
```

Doit retourner `syntax is ok`.

## 🎨 Bonus : Ajouter un cache statique
Ajoutez dans le template :

```nginx
location ~* \.(jpg|jpeg|png|css|js)$ {
    proxy_pass http://flask_app:5000;
    proxy_cache_valid 200 1h;
    expires 1h;
    add_header Cache-Control "public";
}
```

## 📚 Ressources
- [Ansible Handlers](https://docs.ansible.com/ansible/latest/user_guide/playbooks_handlers.html)
- [Nginx Reverse Proxy Guide](https://docs.nginx.com/nginx/admin-guide/web-server/reverse-proxy/)
- [Ansible Template Module](https://docs.ansible.com/ansible/latest/collections/ansible/builtin/template_module.html)
