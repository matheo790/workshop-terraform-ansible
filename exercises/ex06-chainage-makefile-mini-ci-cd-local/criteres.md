# Critères de réussite — Ex06

## Commandes de vérification

```bash
# Aide
make help

# Build
make build
docker images | grep devops-local-lab-flask

# Infra
make infra
docker ps

# Configure
make configure

# Deploy complet
make deploy WORKSPACE=dev

# Status
make status

# Test
make test

# Destroy
make destroy WORKSPACE=dev

# Clean
make clean
```

## Résultats attendus

### ✅ Structure du Makefile
- [ ] Fichier `Makefile` à la racine du projet
- [ ] Toutes les targets sont `.PHONY`
- [ ] Variables définies en haut : `WORKSPACE`, `APP_IMAGE`, etc.

### ✅ Target `help`
- [ ] `make help` affiche la liste des commandes
- [ ] Chaque commande a une description
- [ ] Formatage clair et lisible

### ✅ Target `build`
- [ ] `make build` construit l'image Docker
- [ ] Image `devops-local-lab-flask:latest` créée
- [ ] Aucune erreur de build

### ✅ Target `infra`
- [ ] `make infra` provisionne avec Terraform
- [ ] Dépendance : exécute `build` avant
- [ ] Workspace créé/sélectionné automatiquement
- [ ] `terraform init` et `apply` exécutés
- [ ] Flag `-auto-approve` utilisé

### ✅ Target `configure`
- [ ] `make configure` exécute Ansible
- [ ] Playbook `site.yml` appliqué
- [ ] Inventory `inventory.ini` utilisé

### ✅ Target `deploy`
- [ ] `make deploy` orchestre tout
- [ ] Dépendances : `infra` puis `configure`
- [ ] Exécution séquentielle correcte
- [ ] Message de succès affiché
- [ ] Suggestion de test incluse

### ✅ Target `status`
- [ ] `make status` affiche les conteneurs Docker
- [ ] Workspace Terraform actif affiché
- [ ] État Terraform listé
- [ ] Formatage clair

### ✅ Target `test`
- [ ] `make test` teste l'application
- [ ] Requête vers `/health`
- [ ] Vérification du statut de réponse
- [ ] Message de succès/échec clair

### ✅ Target `destroy`
- [ ] `make destroy` supprime l'infra
- [ ] Workspace correct sélectionné
- [ ] `terraform destroy -auto-approve`
- [ ] Confirmation de destruction

### ✅ Target `clean`
- [ ] `make clean` nettoie complètement
- [ ] Exécute `destroy` d'abord
- [ ] Pruning Docker (`docker system prune`)
- [ ] Message de confirmation

### ✅ Gestion des workspaces
- [ ] Variable `WORKSPACE` configurable
- [ ] `make deploy WORKSPACE=prod` fonctionne
- [ ] Workspaces créés automatiquement si inexistants
- [ ] Pas de conflit entre environnements

### ✅ Gestion des erreurs
- [ ] Échec d'une étape = arrêt du pipeline
- [ ] Messages d'erreur clairs
- [ ] Utilisation de `&&` pour chaîner les commandes
- [ ] Fallback avec `||` pour créations de workspace

### ✅ Pipeline complet
- [ ] `make deploy` → infrastructure complète déployée
- [ ] `make test` → application répond correctement
- [ ] `make status` → état cohérent
- [ ] `make destroy` → nettoyage propre

### ✅ Bonnes pratiques
- [ ] Indentation avec tabulations (pas espaces)
- [ ] Commandes précédées de `@` pour output propre
- [ ] Variables en MAJUSCULES
- [ ] Commentaires explicatifs
- [ ] Ordre logique des targets
