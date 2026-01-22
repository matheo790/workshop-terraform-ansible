# Ex04 — Ansible : Bootstrap + Docker + Déploiement app (idempotence)

## 🎯 Objectif
Utiliser Ansible pour configurer une machine cible (conteneur SSH) :
1. Installer Docker
2. Déployer l'application Flask via Docker Compose
3. Prouver l'**idempotence** : relancer le playbook ne doit rien changer

## 📝 Énoncé

### Contexte
Vous avez une cible SSH accessible (conteneur "vm") et un inventory généré par Terraform.  
Vous allez créer un playbook Ansible qui :
- Prépare l'environnement (bootstrap)
- Installe Docker
- Déploie l'app via un `docker-compose.yml`

### Étape 1 : Préparer l'infrastructure
Assurez-vous que Terraform a déployé l'infra et généré l'inventory :

```bash
cd infra/terraform
terraform workspace select dev
terraform apply
```

Vérifiez la connexion Ansible :
```bash
cd ../ansible
ansible -i inventory.ini vm -m ping
```

### Étape 2 : Créer le rôle `bootstrap`
Ce rôle prépare la machine (mises à jour, dépendances système).

**Fichier : `infra/ansible/roles/bootstrap/tasks/main.yml`**
```yaml
---
- name: Update apt cache
  ansible.builtin.apt:
    update_cache: yes
    cache_valid_time: 3600
  become: yes

- name: Install basic packages
  ansible.builtin.apt:
    name:
      - curl
      - git
      - python3-pip
    state: present
  become: yes
```

### Étape 3 : Créer le rôle `docker`
Ce rôle installe Docker et Docker Compose.

**Fichier : `infra/ansible/roles/docker/tasks/main.yml`**
```yaml
---
- name: Install Docker dependencies
  ansible.builtin.apt:
    name:
      - apt-transport-https
      - ca-certificates
      - gnupg
      - lsb-release
    state: present
  become: yes

- name: Add Docker GPG key
  ansible.builtin.apt_key:
    url: https://download.docker.com/linux/ubuntu/gpg
    state: present
  become: yes

- name: Add Docker repository
  ansible.builtin.apt_repository:
    repo: "deb [arch=amd64] https://download.docker.com/linux/ubuntu {{ ansible_distribution_release }} stable"
    state: present
  become: yes

- name: Install Docker
  ansible.builtin.apt:
    name:
      - docker-ce
      - docker-ce-cli
      - containerd.io
    state: present
    update_cache: yes
  become: yes

- name: Install Docker Compose
  ansible.builtin.pip:
    name: docker-compose
    state: present
  become: yes

- name: Ensure Docker service is running
  ansible.builtin.systemd:
    name: docker
    state: started
    enabled: yes
  become: yes
```

### Étape 4 : Créer le rôle `app`
Ce rôle déploie l'app via Docker Compose.

**Fichier : `infra/ansible/roles/app/tasks/main.yml`**
```yaml
---
- name: Create app directory
  ansible.builtin.file:
    path: /opt/devops-lab-app
    state: directory
    mode: '0755'
  become: yes

- name: Deploy docker-compose.yml
  ansible.builtin.template:
    src: docker-compose.yml.j2
    dest: /opt/devops-lab-app/docker-compose.yml
    mode: '0644'
  become: yes
  notify: Restart app containers

- name: Start app with Docker Compose
  community.docker.docker_compose:
    project_src: /opt/devops-lab-app
    state: present
  become: yes
```

**Fichier : `infra/ansible/roles/app/templates/docker-compose.yml.j2`**
```yaml
version: '3.8'

services:
  flask_app:
    image: devops-local-lab-flask:latest
    container_name: flask_app
    ports:
      - "5000:5000"
    restart: unless-stopped
```

**Fichier : `infra/ansible/roles/app/handlers/main.yml`**
```yaml
---
- name: Restart app containers
  community.docker.docker_compose:
    project_src: /opt/devops-lab-app
    state: restarted
  become: yes
```

### Étape 5 : Créer le playbook principal
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
```

### Étape 6 : Exécuter le playbook
```bash
cd infra/ansible
ansible-playbook -i inventory.ini site.yml
```

**Résultat attendu** :
- Installation de packages
- Installation de Docker
- Déploiement de l'app
- Pas d'erreur

### Étape 7 : Prouver l'idempotence
Relancez le playbook :

```bash
ansible-playbook -i inventory.ini site.yml
```

**Résultat attendu** :
```
PLAY RECAP *************************************************************
127.0.0.1  ok=X  changed=0  unreachable=0  failed=0  skipped=0  rescued=0  ignored=0
```

Le compteur `changed=0` prouve que rien n'a été modifié.

### Étape 8 : Vérifier l'application
```bash
curl http://localhost:5000/health
```

**Résultat attendu** : `{"status":"ok"}`

## ✅ Critères de réussite
- [ ] `ansible-playbook -i inventory.ini site.yml` s'exécute sans erreur
- [ ] La première exécution affiche `changed > 0`
- [ ] La deuxième exécution affiche `changed=0` (idempotence)
- [ ] `curl http://localhost:5000/health` retourne `{"status":"ok"}`
- [ ] `docker ps` montre le conteneur `flask_app` actif
- [ ] Aucune commande shell (`shell` ou `command`) utilisée (sauf si nécessaire)

## 💡 Points clés à retenir
- **Idempotence** : Exécuter N fois = même résultat qu'une fois
- Modules Ansible > commandes shell (plus sûr, plus maintenable)
- `become: yes` = sudo
- Handlers = actions déclenchées uniquement si changement
- `notify` déclenche un handler

## 🚨 Pièges courants
- Oublier `become: yes` → Permission denied
- Utiliser `command` au lieu de modules dédiés → Pas idempotent
- Ne pas installer `community.docker` collection → Module introuvable
- Cache apt périmé → Échec d'installation de packages

## 🔧 Installation des collections nécessaires
Si `community.docker` manque :

```bash
ansible-galaxy collection install community.docker
```

## 📚 Ressources
- [Ansible Best Practices](https://docs.ansible.com/ansible/latest/user_guide/playbooks_best_practices.html)
- [Ansible Docker Modules](https://docs.ansible.com/ansible/latest/collections/community/docker/index.html)
- [Idempotence Explained](https://docs.ansible.com/ansible/latest/reference_appendices/glossary.html#term-Idempotency)
