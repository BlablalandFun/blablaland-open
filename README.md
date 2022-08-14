![Logo de Blablaland](https://raw.githubusercontent.com/BlablalandFun/blablaland-open/main/docs/logo.png)

# Blablaland

Un projet open-source visant à créer un serveur Blablaland performant et léger.

Développé par l'équipe de [Blablaland.fun](https://github.com/BlablalandFun), le projet a pour objectif de proposer un serveur destiné aux créateurs de contenus, développeurs et autres personnes souhaitant faire des tests en solo.

**ATTENTION**\
Le projet n'est pas destiné à être utilisé en production pour le moment étant donné le code n'est pas sécurisé.

Merci au joueur "Mathieu" d'avoir réalisé le logo de Blablaland.fun

## Conditions d'utilisation

Nécessite au minimum la version **v16.14.0** de Node.js

## Exécuter localement

Récupérer le code du projet

```bash
git clone https://github.com/BlablalandFun/blablaland-open.git
```

Rendez-vous dans le répertoire du code

```bash
  cd blablaland-open
```

Installer les dépendences NPM

```bash
  npm install
```

Initialiser le projet (base de données, etc.)

```bash
  npm run init
```

Démarrer le projet

```bash
  npm run start
```

## Se connecter via le launcher de Blablaland.fun

1. Il faut tout d'abord télécharger le launcher disponible [ici](https://github.com/BlablalandFun/blablaland-desktop/releases/latest)
2. Ensuite, il faut créer un raccourci du launcher avec l'argument `target` défini à l'adresse du site. Dans le cas de ce projet, il faut ajouter l'argument comme ceci : `target=http://localhost:8080/`\
   \
   **Exemple:** `"C:\Users\Blablaland\AppData\Local\Programs\blablaland-desktop\Blablaland Desktop.exe" --target=http://localhost:3000/`)

## Support

Si vous rencontrez un quelconque problème, merci de créer une issue
