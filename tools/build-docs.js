const { join, resolve } = require('path');
const { readdirSync, writeFileSync, readFileSync, existsSync } = require('fs');
const { name, version } = require('../package.json');

const RESOURCES_PATH = resolve('resources');
const DOCS_PATH = join(RESOURCES_PATH, 'docs');
const pages = [];

function capitalize(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

if (existsSync(DOCS_PATH)) {
  const docs = readdirSync(DOCS_PATH);
  docs.map(o => {
    pages.push({
      title: capitalize(o).replace('.md', ''),
      content: readFileSync(join(DOCS_PATH, o), 'utf8'),
    });
    return o;
  });
}

const result = JSON.stringify(
  {
    title: capitalize(name),
    version,
    pages,
  },
  null,
  4
);

writeFileSync(join(RESOURCES_PATH, 'docs.json'), result, 'utf8');
