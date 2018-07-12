const yaml = require('js-yaml');
const fs = require('fs');
const path = require('path');
const langPath = path.join(__dirname, './langs');

const langArr = fs.readdirSync(langPath);
const langObj = {};

if (langArr.length) {
  langArr.forEach(el => {
    let fileStr = fs.readFileSync(`${langPath}/${el}`, 'utf8');

    langObj[path.parse(el).name] = yaml.safeLoad(fileStr);
  });
}

// example:
// {
//   'zh-CN': [Object],
//   'en': [Object]
// }
export default langObj;
