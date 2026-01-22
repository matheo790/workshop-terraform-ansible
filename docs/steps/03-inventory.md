# 5. Terraform → Ansible : Inventaire Dynamique

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

> 📚 **Pour aller plus loin** : Consultez l'[exercice détaillé Ex03](https://github.com/othila-academy/workshop-terraform-ansible/tree/main/exercises/ex03-terraform-ansible-generer-inventory-ini-automatiquement/enonce.md) pour comprendre la génération dynamique d'inventory.
