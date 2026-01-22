# Ex03 — Terraform → Ansible : Générer inventory.ini automatiquement

## 🎯 Objectif
Connecter Terraform et Ansible en générant automatiquement l'inventaire Ansible depuis Terraform.  
Cela illustre le principe **IaC end-to-end** : provisionner (Terraform) puis configurer (Ansible).

## 📝 Énoncé

### Contexte
Actuellement, vous devez créer manuellement le fichier `infra/ansible/inventory.ini`.  
L'objectif est que **Terraform le génère automatiquement** après chaque `apply`.

### Étape 1 : Comprendre la structure de l'inventory
Un inventory Ansible basique ressemble à :

```ini
[vm]
127.0.0.1 ansible_port=2222 ansible_user=ansible ansible_password=ansible ansible_connection=ssh

[vm:vars]
ansible_python_interpreter=/usr/bin/python3
ansible_become=yes
ansible_become_method=sudo
ansible_become_pass=ansible
```

**Détails** :
- `[vm]` : nom du groupe d'hôtes
- `127.0.0.1` : cible SSH (conteneur local)
- `ansible_port=2222` : port SSH mappé
- Variables d'authentification pour se connecter

### Étape 2 : Créer une ressource `local_file` dans Terraform
Dans `infra/terraform/main.tf`, ajoutez :

```hcl
resource "local_file" "ansible_inventory" {
  filename = "${path.module}/../ansible/inventory.ini"
  
  content = <<-EOT
    [vm]
    127.0.0.1 ansible_port=2222 ansible_user=ansible ansible_password=ansible ansible_connection=ssh

    [vm:vars]
    ansible_python_interpreter=/usr/bin/python3
    ansible_become=yes
    ansible_become_method=sudo
    ansible_become_pass=ansible
  EOT
  
  file_permission = "0644"
}
```

**Note** : `${path.module}/../ansible/` remonte d'un niveau depuis `terraform/` pour atteindre `ansible/`.

### Étape 3 : Appliquer Terraform
Depuis `infra/terraform/` :

```bash
terraform workspace select dev  # ou créez-le si nécessaire
terraform apply
```

**Vérification** : Le fichier `infra/ansible/inventory.ini` doit être créé automatiquement.

### Étape 4 : Tester la connexion Ansible
Depuis `infra/ansible/` :

```bash
cd ../ansible
ansible -i inventory.ini vm -m ping
```

**Résultat attendu** :
```
127.0.0.1 | SUCCESS => {
    "changed": false,
    "ping": "pong"
}
```

### Étape 5 : Vérifier l'idempotence
Relancez `terraform apply` plusieurs fois :

```bash
cd ../terraform
terraform apply
terraform apply
```

**Résultat attendu** : Terraform doit indiquer `No changes. Infrastructure is up-to-date.` sauf si le contenu de l'inventory a changé.

### Étape 6 : Nettoyer
```bash
terraform destroy
```

Vérifiez que `inventory.ini` persiste (Terraform ne le supprime que si explicitement configuré avec `destroy_provisioner`).

## ✅ Critères de réussite
- [ ] `terraform apply` génère automatiquement `infra/ansible/inventory.ini`
- [ ] Le fichier contient le groupe `[vm]` avec les bonnes variables
- [ ] `ansible -i inventory.ini vm -m ping` retourne `SUCCESS`
- [ ] Le contenu du fichier est identique à chaque `apply` (idempotence)
- [ ] Les permissions du fichier sont `0644`
- [ ] La connexion SSH fonctionne sans erreur

## 💡 Points clés à retenir
- `local_file` permet de générer des fichiers depuis Terraform
- `${path.module}` = chemin du dossier contenant le fichier `.tf`
- L'inventory peut être dynamique (IPs, ports variables)
- **IaC Pipeline** : Terraform → génère inventory → Ansible configure

## 🚨 Pièges courants
- Chemins relatifs incorrects (`path.module` vs `path.cwd`)
- Oublier `ansible_connection=ssh` → Ansible tente local
- Conteneur SSH pas démarré → ping échoue
- Indentation dans le heredoc `<<-EOT` qui casse le format INI

## 🔄 Bonus (optionnel)
Pour aller plus loin, rendez l'inventory dynamique avec des variables :

```hcl
locals {
  ssh_port = 2222
  ssh_user = "ansible"
  ssh_pass = "ansible"
}

resource "local_file" "ansible_inventory" {
  content = templatefile("${path.module}/templates/inventory.tpl", {
    ssh_port = local.ssh_port
    ssh_user = local.ssh_user
    ssh_pass = local.ssh_pass
  })
  
  filename = "${path.module}/../ansible/inventory.ini"
}
```

Créez `templates/inventory.tpl` avec des placeholders `${ssh_port}`.

## 📚 Ressources
- [Terraform local_file](https://registry.terraform.io/providers/hashicorp/local/latest/docs/resources/file)
- [Ansible Inventory Format](https://docs.ansible.com/ansible/latest/user_guide/intro_inventory.html)
- [Terraform templatefile](https://www.terraform.io/docs/language/functions/templatefile.html)
