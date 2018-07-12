function formatTimestamp(timestamp) {
  let time = Number.parseInt(timestamp, 10);
  let date = new Date(time);

  let year = date.getFullYear();
  let month = date.getMonth() + 1;
  let day = date.getDate();
  // let hour = date.getHours();
  // let minute = date.getMinutes();
  // let second = date.getSeconds();

  month = month > 9 ? month : `0${month}`;
  day = day > 9 ? day : `0${day}`;
  // hour = hour > 9 ? hour : `0${hour}`;
  // minute = minute > 9 ? minute : `0${minute}`;
  // second = second > 9 ? second : `0${second}`;

  // return `${year}/${month}/${day} ${hour}:${minute}:${second}`;
  return `${year}/${month}/${day}`;
}

function generateUUID() {
  let s4 = function() {
    return Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1);
  };

  return `${s4() + s4()}-${new Date().getTime()}`;
}

function capitalizeFirstLetter(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function mergeObjects(targetObj, ...objArr) {
  if (targetObj.toString() !== '[object Object]') {
    return targetObj;
  }

  if (objArr.length) {
    objArr.forEach(obj => {
      if (obj.toString() !== '[object Object]') {
        return;
      }

      Object.keys(obj).forEach(key => {
        if (targetObj.hasOwnProperty(key)) {
          targetObj[key] = obj[key];
        }
      });
    });
  }

  return targetObj;
}

export default {
  formatTimestamp,
  generateUUID,
  capitalizeFirstLetter,
  mergeObjects
};
