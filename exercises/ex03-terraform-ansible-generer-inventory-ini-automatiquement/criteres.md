# Critères de réussite — Ex03

## Commandes de vérification

```bash
# Générer l'inventory
cd infra/terraform
terraform workspace select dev
terraform apply

# Vérifier le fichier généré
cat ../ansible/inventory.ini

# Tester la connexion
cd ../ansible
ansible -i inventory.ini vm -m ping

# Vérifier l'idempotence
cd ../terraform
terraform apply
```

## Résultats attendus

### ✅ Génération du fichier
- [ ] `infra/ansible/inventory.ini` existe après `terraform apply`
- [ ] Le fichier est généré automatiquement (pas créé manuellement)
- [ ] Permissions du fichier : `0644`

### ✅ Contenu du fichier
- [ ] Groupe `[vm]` présent
- [ ] Ligne d'hôte : `127.0.0.1 ansible_port=2222 ansible_user=ansible ...`
- [ ] Section `[vm:vars]` avec variables d'authentification
- [ ] `ansible_python_interpreter=/usr/bin/python3`
- [ ] Variables `ansible_become` correctement définies

### ✅ Connexion Ansible
- [ ] `ansible -i inventory.ini vm -m ping` retourne `SUCCESS`
- [ ] Message de retour contient `"ping": "pong"`
- [ ] Pas d'erreur de connexion SSH
- [ ] Pas d'erreur d'authentification

### ✅ Idempotence Terraform
- [ ] Deuxième `terraform apply` → `No changes` pour le fichier inventory
- [ ] Contenu du fichier identique entre deux apply consécutifs

### ✅ Intégration Terraform
- [ ] Ressource `local_file` définie dans `main.tf`
- [ ] Utilisation de `${path.module}` pour le chemin relatif
- [ ] Heredoc (`<<-EOT`) correctement formaté
