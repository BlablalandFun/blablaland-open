# Installer le projet sur Linux

Voici une liste d'instructions à suivre pour installer le projet sur un VPS.

Pour gérer les versions de Node.js, nous allons utiliser l'outil [fnm](https://github.com/Schniz/fnm#installation) qui est écrit en Rust et est très simple d'utilisation.

Pour commencer, récupérez le projet avec la commande :

```bash
git clone https://github.com/BlablalandFun/blablaland-open.git
```

Rendez-vous dans le répertoire du code

```bash
  cd blablaland-open
```

Installez les dépendences NPM

```bash
  npm install
```

Initialisez le projet (base de données, etc.)

```bash
  npm run init
```

Créez un fichier `.env` basé sur le fichier `.env.example`

```bash
cp .env.example .env
```

Modifier la variable `SERVER_IP` avec l'**IP de votre VPS** puis démarrez le projet

```bash
  npm run start
```

### Problèmes

Si vous rencontrez un problème de droit pour ouvrir le port 843 avec Node.js, merci de taper la commande suivante :

```bash
sudo setcap 'cap_net_bind_service=+ep' `which node`
```
