# 6. Ansible : Bootstrap & Déploiement App

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

> 📚 **Pour aller plus loin** : Consultez l'[exercice détaillé Ex04](https://github.com/othila-academy/workshop-terraform-ansible/tree/main/exercises/ex04-ansible-bootstrap-docker-deploiement-app-idempotence/enonce.md) avec exemples complets de rôles Ansible.
