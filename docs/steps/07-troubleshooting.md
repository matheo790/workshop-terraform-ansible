# Troubleshooting

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
