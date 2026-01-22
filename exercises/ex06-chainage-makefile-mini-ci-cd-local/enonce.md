# Ex06 — Chaînage : Makefile (mini CI/CD local)

## 🎯 Objectif
Créer un **Makefile** qui orchestre tout le cycle de vie de l'infrastructure :
- Provisionner (Terraform)
- Configurer (Ansible)
- Déployer (tout en une commande)
- Détruire (cleanup complet)

Cet exercice simule un **pipeline CI/CD local** simplifié.

## 📝 Énoncé

### Contexte
Actuellement, vous devez exécuter plusieurs commandes manuellement :
1. `docker build ...`
2. `cd infra/terraform && terraform apply`
3. `cd ../ansible && ansible-playbook ...`

L'objectif est de **tout automatiser** avec un Makefile.

### Étape 1 : Créer le Makefile racine
**Fichier : `Makefile` (à la racine du projet)**

```makefile
.PHONY: help build infra configure deploy destroy clean status

# Variables
WORKSPACE ?= dev
APP_IMAGE = devops-local-lab-flask:latest
TERRAFORM_DIR = infra/terraform
ANSIBLE_DIR = infra/ansible

help: ## Affiche l'aide
	@echo "Commandes disponibles :"
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | awk 'BEGIN {FS = ":.*?## "}; {printf "  \033[36m%-15s\033[0m %s\n", $$1, $$2}'

build: ## Build l'image Docker de l'app
	@echo "🔨 Building application image..."
	docker build -t $(APP_IMAGE) app/

infra: build ## Provisionne l'infrastructure avec Terraform
	@echo "🚀 Provisioning infrastructure (workspace: $(WORKSPACE))..."
	cd $(TERRAFORM_DIR) && \
		terraform workspace select $(WORKSPACE) || terraform workspace new $(WORKSPACE) && \
		terraform init -upgrade && \
		terraform apply -auto-approve

configure: ## Configure la VM avec Ansible
	@echo "⚙️  Configuring VM with Ansible..."
	cd $(ANSIBLE_DIR) && \
		ansible-playbook -i inventory.ini site.yml

deploy: infra configure ## Déploie tout (infra + config)
	@echo "✅ Deployment complete!"
	@echo "Test with: curl http://localhost:8080/health"

destroy: ## Détruit l'infrastructure
	@echo "🗑️  Destroying infrastructure..."
	cd $(TERRAFORM_DIR) && \
		terraform workspace select $(WORKSPACE) && \
		terraform destroy -auto-approve

clean: destroy ## Nettoyage complet (destroy + cleanup Docker)
	@echo "🧹 Cleaning up..."
	docker system prune -f
	@echo "✅ Cleanup complete!"

status: ## Affiche le statut de l'infra
	@echo "📊 Infrastructure status:"
	@echo "\nDocker containers:"
	@docker ps --filter "name=devops-local-lab" --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"
	@echo "\nTerraform workspace:"
	@cd $(TERRAFORM_DIR) && terraform workspace show
	@echo "\nTerraform state:"
	@cd $(TERRAFORM_DIR) && terraform state list 2>/dev/null || echo "No state found"

test: ## Teste l'application déployée
	@echo "🧪 Testing deployed application..."
	@curl -s http://localhost:8080/health | jq . || echo "❌ App not responding"
	@curl -s http://localhost:8080/ | grep -q "Hello" && echo "✅ App is healthy" || echo "❌ App unhealthy"
```

### Étape 2 : Tester les commandes individuelles

#### a) Afficher l'aide
```bash
make help
```

**Résultat attendu** : Liste des commandes disponibles avec descriptions.

#### b) Build de l'image
```bash
make build
```

**Résultat attendu** : Image Docker `devops-local-lab-flask:latest` créée.

#### c) Provisionner l'infra
```bash
make infra
```

**Résultat attendu** : Terraform crée les ressources.

#### d) Configurer avec Ansible
```bash
make configure
```

**Résultat attendu** : Ansible exécute le playbook.

### Étape 3 : Déploiement complet en une commande
```bash
make deploy
```

**Résultat attendu** :
1. Build de l'image
2. Provisionnement Terraform
3. Configuration Ansible
4. Message de succès avec commande de test

### Étape 4 : Vérifier le statut
```bash
make status
```

**Résultat attendu** :
- Liste des conteneurs Docker actifs
- Workspace Terraform actif
- Ressources dans le state Terraform

### Étape 5 : Tester l'application
```bash
make test
```

**Résultat attendu** :
```
🧪 Testing deployed application...
{
  "status": "ok"
}
✅ App is healthy
```

### Étape 6 : Déployer un environnement prod
```bash
make deploy WORKSPACE=prod
```

**Résultat attendu** : Déploiement dans le workspace `prod`.

### Étape 7 : Détruire l'infrastructure
```bash
make destroy WORKSPACE=dev
make destroy WORKSPACE=prod
```

### Étape 8 : Cleanup complet
```bash
make clean
```

**Résultat attendu** : Tout nettoyé (images, conteneurs, volumes).

## ✅ Critères de réussite
- [ ] `make help` affiche toutes les commandes avec descriptions
- [ ] `make build` crée l'image Docker
- [ ] `make infra` provisionne avec Terraform
- [ ] `make configure` exécute Ansible
- [ ] `make deploy` exécute tout le pipeline en une commande
- [ ] `make test` vérifie que l'app répond correctement
- [ ] `make status` affiche l'état de l'infra
- [ ] `make destroy` nettoie proprement
- [ ] `make deploy WORKSPACE=prod` fonctionne
- [ ] Les dépendances entre targets sont respectées (ex: `deploy` → `infra` → `build`)

## 💡 Points clés à retenir
- **Makefile** = orchestration simple et universelle
- `.PHONY` = cible qui n'est pas un fichier
- Variables Makefile (`WORKSPACE ?= dev`) = configurables
- `@echo` = affichage sans montrer la commande
- Chaînage de targets : `deploy: infra configure`
- `||` = fallback (ex: créer workspace si inexistant)

## 🚨 Pièges courants
- Utiliser espaces au lieu de tabulations → erreur Makefile
- Oublier `.PHONY` → Make cherche un fichier
- Chemins relatifs incorrects dans les `cd`
- Oublier `&&` entre commandes → échec silencieux
- Ne pas gérer les workspaces → collision entre envs

## 🎨 Bonus : Ajouter des targets avancées

### Logs en temps réel
```makefile
logs: ## Affiche les logs de l'app
	docker logs -f devops-local-lab-app
```

### Backup du state Terraform
```makefile
backup: ## Sauvegarde le state Terraform
	@mkdir -p backups
	cd $(TERRAFORM_DIR) && \
		terraform state pull > ../../backups/terraform-$(WORKSPACE)-$(shell date +%Y%m%d-%H%M%S).tfstate
	@echo "✅ State backed up"
```

### CI simulation
```makefile
ci: ## Simule un pipeline CI/CD
	@echo "🔄 Running CI pipeline..."
	make build
	make infra WORKSPACE=ci
	make configure
	make test
	make destroy WORKSPACE=ci
	@echo "✅ CI pipeline complete"
```

### Validation pré-deploy
```makefile
validate: ## Valide la config avant deploy
	@echo "🔍 Validating Terraform..."
	cd $(TERRAFORM_DIR) && terraform fmt -check && terraform validate
	@echo "🔍 Validating Ansible..."
	cd $(ANSIBLE_DIR) && ansible-playbook --syntax-check site.yml
	@echo "✅ Validation passed"
```

## 📊 Workflow recommandé

### Développement
```bash
make deploy WORKSPACE=dev
make test
# ... développement ...
make destroy WORKSPACE=dev
```

### Production
```bash
make validate
make deploy WORKSPACE=prod
make test
make status
```

### CI/CD
```bash
make ci  # Lance tout le cycle en environnement isolé
```

## 🔗 Intégration avec Git hooks
Créez `.git/hooks/pre-push` :

```bash
#!/bin/bash
echo "Running pre-push checks..."
make validate || exit 1
```

Rendez-le exécutable :
```bash
chmod +x .git/hooks/pre-push
```

## 📚 Ressources
- [GNU Make Manual](https://www.gnu.org/software/make/manual/)
- [Makefile Tutorial](https://makefiletutorial.com/)
- [Best Practices for Makefiles](https://tech.davis-hansson.com/p/make/)
