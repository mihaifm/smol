const path = require('path');
const ejs = require('ejs');
const marked = require('marked');
const frontMatter = require('front-matter');
const glob = require('glob');
const fs = require('fs');
const utils = require('./utils.js');

var pageDict = {};

var config = {
  title: "Your Smol Website",
  description: "Smol Description",
  author: "",
  theme: "tiny"
}

const dirs = {
  src: process.env['SMOL_SRC_PATH'] || 'source',
  out: process.env['SMOL_OUTPUT_PATH'] || 'public',
  db: process.env['SMOL_VAULT_PATH'] || 'db'
}

const loadLayout = (layout) => {
  const file = `themes/${config.theme}/layouts/${layout}.ejs`;
  const data = fs.readFileSync(file, 'utf-8');

  return { file, data };
}

function build() {
  utils.clearFolder(dirs.out);

  if (fs.existsSync(`themes/${config.theme}/assets`)) {
    utils.copyFolderSync(`themes/${config.theme}/assets`, dirs.out);
  }

  if (fs.existsSync(`${dirs.src}/media`)) {
    utils.copyFolderSync(`${dirs.src}/media`, `${dirs.out}/media`);
  }

  if (fs.existsSync(`${dirs.db}/config.json`)) {
    config = JSON.parse(fs.readFileSync(`${dirs.db}/config.json`));
  }
  
  const files = glob.sync('**/*.@(md|ejs|html)', { cwd: `${dirs.src}/pages` });

  files.forEach(file => buildPage(file));

  buildIndex();

  console.log('Site built succesfully');
}

function buildIndex() {
  const layoutName = 'index';
  const layout = loadLayout(layoutName);

  const completePage = ejs.render(
    layout.data,
    {
      filename: `themes/${config.theme}/layouts/${layoutName}`,
      pages: getPages(),
      config
    }
  );

  fs.writeFileSync(`${dirs.out}/index.html`, completePage);
}

function buildPage(file) {
  const filePath = path.parse(file);
  let destPath = path.join(dirs.out, filePath.dir);

  if (filePath.name == 'index')
    return;

  if (filePath.name !== 'index') {
    destPath = path.join(destPath, filePath.name);
  }

  fs.mkdirSync(destPath, { recursive: true });

  let fullFileName = `${dirs.src}/pages/${file}`;

  if (!fs.existsSync(fullFileName)) {
    console.log(`File does not exist: ${fullFileName}`);
    return;
  }

  const pageData = frontMatter(fs.readFileSync(fullFileName, 'utf-8'));
  const templateConfig = {
    page: pageData.attributes
  }

  let pageContent;

  switch (filePath.ext) {
    case '.md':
      pageContent = marked(pageData.body);
      break;
    case '.ejs':
      pageContent = ejs.render(pageData.body, templateConfig);
      break;
    default:
      pageContent = pageData.body;
  }

  const layoutName = pageData.attributes.layout || 'default';
  const layout = loadLayout(layoutName);

  var commentsFile = `${dirs.db}/${filePath.name}/comments.json`;
  var comments = [];
  if (fs.existsSync(commentsFile)) {
    comments = JSON.parse(fs.readFileSync(commentsFile), 'utf8');
  }

  var utctime = new Date(pageData.attributes.date).getTime();
  if (!utctime) {
    utctime = 0;
  }
  
  pageDict[filePath.name] = Object.assign({ utctime, url: filePath.name }, pageData.attributes);

  const completePage = ejs.render(
    layout.data,
    Object.assign({}, templateConfig, {
      body: pageContent,
      filename: `themes/${config.theme}/layouts/${layoutName}`,
      config,
      comments
    })
  );

  fs.writeFileSync(`${destPath}/index.html`, completePage);
}

function getPages() {
  let pg = [];
  for (var key in pageDict) {
    pg.push(Object.assign({name: key}, pageDict[key]));
  }

  return pg.sort((a, b) => a.utctime == b.utctime ? 0 : b.utctime - a.utctime);
}

function makeApp() {
  utils.copyFolderSync(`${__dirname}/..`, ".");

  if (!fs.existsSync(dirs.src))
    fs.mkdirSync(dirs.src);
  if (!fs.existsSync(dirs.db))
    fs.mkdirSync(dirs.db);

  fs.mkdirSync(`${dirs.src}/pages`);
  fs.mkdirSync(`${dirs.src}/media`);

  if (!fs.existsSync(`${dirs.db}/config.json`))
    fs.writeFileSync(`${dirs.db}/config.json`, JSON.stringify(config));

  console.log('Site initialized');
}

function getConfig() {
  return config;
}

function setConfig(obj) {
  status = "Settings updated";

  config.title = obj.title;
  config.description = obj.description;
  config.author = obj.author;

  if (obj.theme && fs.existsSync(`themes/${obj.theme}`)) {
    config.theme = obj.theme;
  }
  else {
    status = "Invalid theme";
  }

  fs.writeFileSync(`${dirs.db}/config.json`, JSON.stringify(config));

  return status;
}

module.exports = { build, buildPage, buildIndex, dirs, makeApp, getConfig, setConfig, getPages }