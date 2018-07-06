module.exports = {
  'store-image': storeImageFile
};

async function storeImageFile({
  base64Data
}, callback) {
  const fs = require('fs');
  const path = require('path');
  const uuid = generateUUID();
  const folder = 'images';
  const folderPath = path.join(__dirname, `../../upload/${folder}`);
  const filePath = path.join(__dirname, `../../upload/${folder}/${uuid}.png`);
  const url = `http://localhost:3000/upload/${folder}/${uuid}.png`;

  if (!fs.existsSync(folderPath)) {
    fs.mkdirSync(folderPath);
  }

  base64Data = base64Data.replace(/^data:image\/.+?;base64,/, '');

  fs.writeFileSync(filePath, base64Data, 'base64');

  callback({
    code: 0,
    data: {
      url
    },
    message: '上传图片成功'
  });
}

function generateUUID() {
  let s4 = function() {
    return Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1);
  };

  return `${s4() + s4()}-${new Date().getTime()}`;
}
