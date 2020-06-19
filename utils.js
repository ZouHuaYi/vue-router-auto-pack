const fs = require('fs')
const readline = require('readline')

/**
 * 查找某文件夹下面的所有文件
 * @method readDir
 * @param {String} dir 文件路径
 * @return {Array} 文件结构的数组
 */
function readDir(dir) {
  return fs.readdirSync(dir, (err, files) => {
    if (err) throw err;
    return files;
  })
}

/**
 * 判断是否是文件
 * @method isFile
 * @param {String} dir 文件路径
 * @return {Boolean} true是文件, 否则是文件夹
 */
function isFile(dir) {
  return fs.statSync(dir).isFile();
}

/**
 * 获取文件夹名称
 * @method getDirName
 * @param {String} dir 文件路径
 * @return {String}
 */
function getDirName(dir) {
  const name = dir.substr(dir.lastIndexOf('/')+1, dir.length);
  return name;
}

/**
 * 获取.vue文件第一行的注释 注释开头是 '//'
 * @method readOneLinData
 * @param {String} dir 文件路径
 * @return {Object<Promise>}
 */
function readOneLinData(dir) {
  const rf = readline.createInterface({
    input: fs.createReadStream(dir)
  });
  return new Promise(resolve => {
    rf.question('获取文件第一行数据', data => {
      let obj = {};
      try {
        if (data.indexOf('//') === 0) {
          const str = data.replace('//', '')
            .replace(/\s/g, '')
          const dat = eval('(' + str + ')')
          obj = typeof dat === 'object' ? dat : {}
        }
      } catch (e) {
        console.log(`出错文件：${file}-${data}`)
      }
      resolve(obj)
      rf.close()
    })
  })
}

module.exports = {
  readDir,
  isFile,
  readOneLinData,
  getDirName
}
