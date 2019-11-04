# Smol

Static site generator with a bare minimum set of features.

* Generate html from markdown sources
* Support for ejs templates
* Page metadata (front-matter)
* Default theme
* Admin panel with authentication
* Online markdown editor
* Image upload
* No database, everthing is file based

For a more complete feature set see [smolpress](https://github.com/mihaifm/smolpress).

### Install

Requires node.js >= 10.0

    npm install -g smol
    cd blog
    smol init
    export SMOL_VAULT_PASSWORD=yourpassword
    smol start

Alternate installation (that doesn't involve the global `smol` command):

    git clone https://github.com/mihaifm/smol blog
    cd blog
    npm install
    export SMOL_VAULT_PASSWORD=yourpassword
    node index.js

Visit `localhost:3939` to view your blog and `localhost:3939/admin` to manage posts.

###  Authentication

Smol provides a single user that is created when visiting `/admin`. User data is stored in a text file `(data/vault.txt`) which is encrypted with the password available in the 
SMOL_VAULT_PASSWORD environment variable.

### Environment variables

* __SMOL_VAULT_PASSWORD__ -  encryption password for the "vault" containing user data.
* __SMOL_PORT__ - server port. Default: `3939`
* __SMOL_SRC_PATH__ - path to the markdown page sources. Default: `source`
* __SMOL_OUTPUT_PATH__ - path to the generated static files. Default: `public`
* __SMOL_DATA_PATH__ - path to the data folder. Default: `data`
