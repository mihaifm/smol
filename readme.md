# Smol

Smol is a small website builder. It aims to be an alternative to the increasingly complex static site generators and content managers available today.

With Smol you would just write your posts in markdown using the built-in online editor. The markdown content is saved on the disk and converted to html on the spot.
No database is required, everything is file based.    

It can be used for personal websites, blogs, quick prototypes or as a baseline for more complex sites.

Smol uses a node.js server to provide some dynamic content like comments, image upload and markdown editing.

## Main Features

* All content statically generated
* No database
* Online markdown editor
* Image resize and optimization
* Extremely lightweight

## FAQ

### How does it compare to a static site generator (SSG) ?

Smol is also a static site generator and supports ejs templates in addition to markdown files. To statically generate the site simply start the server.
While Smol runs on a node.js server to provide some dynamic features, your posts are statically generated at all time so you can move them to a different web server if you feel the need.

Compared to an SSG, Smol provides an online markdown editor so you can edit your posts using your own website rather than using an external editor and fiddling with live-reload or deploy scripts.

### How does it compare to a content management system (CMS) ?

Smol is very similar to a CMS, in the sense that you can manage your content from an online interface. However it is smaller, much smaller than a real CMS like Wordpress.

With Smol all posts sit nicely on the disk written in Markdown and are not deeply burried inside a database. In fact Smol does not even require a database.

## Getting started

    npm install -g smol
    cd blog
    smol init
    export SMOL_VAULT_PASSWORD=yourpassword
    smol start

If you're running Windows replace the `export` command above with `set`.

Alternate installation (that doesn't require the global `smol` command):

    git clone https://github.com/mihaifm/smol blog
    cd blog
    npm install
    export SMOL_VAULT_PASSWORD=yourpassword
    node index.js

Now simply visit `localhost:3939` to view your blog and `localhost:3939/admin` to create a new post.

## Usage

###  Authentication

Smol provides a single user that is created when visiting `/admin`. User data is stored in a text file `(data/vault.txt`) which is encrypted with the password available in the 
SMOL_VAULT_PASSWORD environment variable. User password is also hashed with sha512.

### Markdown editing

You can edit any post by visiting the `/admin` panel and clicking the `Edit` link for any post. The [SimpleMDE](https://simplemde.com/) editor will help you get the job done. Click `Save` to have the post converted to html.

### Page front matter

Smol uses [front-matter](https://jekyllrb.com/docs/front-matter/) to add metadata to your pages. Any property name is supported and can be later used in the theme for customization.
The `layout`, `title` and `date` properties are supported by the default theme.

### Comments

The comments system is simple and smol. Comments are saved as json files and converted to html when the site is generated. 
There is no anti-spam protection so use it at your own risk. However it should be fairly straightforward to install something like [Akismet](https://www.npmjs.com/package/akismet-api) to prevent spam.

### Themes

Themes are based on [ejs](https://ejs.co/) templates and are placed in the `themes` folder. Smol has a default theme called `tiny`. Changing the theme can be done in the `/settings`
panel.     
It is recommended to make a copy of the default theme and naming it to something else before making and customizations to the site. This way you won't lose any changes when updating Smol.

### Images

Images can be uploaded via the `/media` link (or from the admin panel). New images are stored in `source/media` and copied to `public/media` when the site in generated.

### RSS

RSS feed is generated automatically for the entire site. RSS fields can be configured by editing `feedconfig.json`. This file is generated with some placeholder values when the server
is first started.

## Config

#### Environment variables

* __SMOL_VAULT_PASSWORD__ -  encryption password for the "vault" containing user data. See [authentication](https://github.com/mihaifm/smol#authentication)
* __SMOL_PORT__ - server port. Default: `3939`
* __SMOL_SRC_PATH__ - path to the markdown page sources. Default: `source`
* __SMOL_OUTPUT_PATH__ - path to the generated static files. Default: `public`
* __SMOL_DATA_PATH__ - path to the data folder. Default: `data`

#### Site metadata

A smol number of options like site title and description are available in the `config.json` file (stored in the `data` folder).
You can edit the file manually or use the `/settings` panel of your website.



