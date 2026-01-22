# 2. Prérequis & Setup

<!-- INSTRUCTOR:START -->
## Notes formateur
- Timing recommandé : 10 min démo + 15 min pratique
- Piège : `terraform workspace select` oublié → state sur mauvais env
- À insister : `plan` avant `apply`
<!-- INSTRUCTOR:END -->

Avant de commencer, assurons-nous que votre environnement est prêt.

## Outils nécessaires

Vous devez avoir installé sur votre machine :

1. **Docker Desktop** (ou Docker Engine sous Linux).
   - Vérification : `docker version`
2. **Terraform** (v1.0+).
   - Vérification : `terraform -version`
3. **Ansible**.
   - Vérification : `ansible --version`
4. **Make** (généralement présent sur Linux/macOS, installable via Chocolatey/Scoop sur Windows ou via WSL2).
5. **Python 3** (pour l'application de test).

> **Note pour les utilisateurs Windows** : Il est fortement recommandé d'utiliser **WSL2** (Ubuntu) pour ce workshop afin d'éviter les problèmes de compatibilité, notamment avec Ansible.

## Préparation du projet

1. Clonez ce dépôt (si ce n'est pas déjà fait) :
   ```bash
   git clone <url-du-repo> devops-local-lab
   cd devops-local-lab
   ```

2. Vérifiez la structure :
   ```bash
   ls -F
   # Devrait afficher : app/  docs/  exercises/  infra/  Makefile ...
   ```

3. Testez votre environnement Docker :
   ```bash
   docker run --rm hello-world
   ```
   *Vous devez voir un message de succès.*

## Nettoyage préventif

Si vous avez déjà des conteneurs qui tournent sur les ports `8080`, `2222` ou `5000`, arrêtez-les pour éviter les conflits.

```bash
# Lister les ports utilisés
lsof -i :8080
lsof -i :2222
```

## Prochaine étape

Une fois les outils installés, nous pouvons attaquer l'infrastructure.
