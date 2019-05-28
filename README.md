
HikeMap Web Application
===================
> Ce code est soumis à une licence [GPLv3](LICENSE.md), This code is licensed under [GPLv3](LICENSE.md).

Ce dépot contient les source de l'application web [Hikemap](https://hikemap.blondeau.me), dont le but est de proposer des itinéaires de randonnée à but récreative ou de découverte partimoniale.

Dépendences
--------------------
### Librairies :
- [Materializecss](https://materializecss.com/) version : 1.4.0
- [LeafletJS](https://leafletjs.com/) version : 1.0.0
- [leaflet-color-markers](https://github.com/pointhi/leaflet-color-markers)

### APIs REST :
- [Nominatim](https://nominatim.openstreetmap.org/)
- Hikemap-API : [hébergée](https://hikemap-api.blondeau.me) ou [à démarrer soit-même](https://github.com/nd4pa/hikemap-api) 
> Attention ! En cas d'auto hébergement de l'API Hikemap il est de votre responsabilité de modifier la variable ```url``` dans le fichier ```js/script.js```

Pré-requis
-------------------
- Un serveur web capable de servir en https.
- Un sous-domaine

Installation
------------------------
L'installation est relativement simple, elle peut être réalisé à l'aide de n'importe quelle serveur web capable de fournir du https.
> Le HTTPS est requis pour pouvoir utiliser le GPS dans l'application

par volonté de simplification, ce tutoriel sera réaliser à l'aide de [Caddy Server](https://caddyserver.com/).

> Ce tutoriel à été réalisé et testé sous Ubuntu et Debian uniquement et est prévu uniquement pour des installations sous Linux.

### Installation de sources
Déplacez-vous dans le dossier de vôtre choix et clonez le dépot.
```bash
cd /chemin/vers/mon/dossier
git clone https://github.com/nd4pa/hikemap-front.git
```
### Installation de Caddy   
```bash
curl https://getcaddy.com | bash -s personal
```
### Création du fichier de configuration
```bash
mkdir /etc/caddy
vim /etc/caddy/Caddyfile
```
Ajouter la configuration en remplaçant ```@@NOM_DE_DOMAINE@@``` par le nom de domaine que vous avez choisi et ```@@CHEMIN_DES_SOURCES@@```par le chemin vers l'endroit ou vous avez cloner le dépôt

```
@@NOM_DE_DOMAINE@@ {
	root @@CHEMIN_DES_SOURCES@@
}
```
### Démarrage du serveur
```bash
caddy -conf /etc/caddy/Caddyfile
```

### Configuration du serveur comme démon
Afin d'éxecuter le serveur comme démon, il faut créer un service systemd, recharger systemd et activer le démarrage du serveur au boot :

```
vim /etc/systemd/system/caddy.service
```
Ajouter :
```
[Unit]
Description=Caddy HTTP/2 web server
Documentation=https://caddyserver.com/docs
After=network-online.target
Wants=network-online.target systemd-networkd-wait-online.service

[Service]
Restart=on-abnormal

; User and group the process will run as.
User=root

; Always set "-root" to something safe in case it gets forgotten in the Caddyfile.
ExecStart=/usr/local/bin/caddy -log stdout -agree=true -conf=/etc/caddy/Caddyfile 

[Install]
WantedBy=multi-user.target
```

Puis exécutez :
```
systemctl daemon-reload
systemctl start caddy.service
systemctl enable caddy.service
```
Configuration de développement
----------------------------------------
Pour lancer l'application, il suffit de la cloner, et de l'ouvrir dans une navigateur à l'aide du préfixe ```file:///```

Contribution
--------------------
Tout fork, contribution ou issue est le/la bienvenue.
