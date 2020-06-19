const path = require('path')
const {getDirName, isFile, readDir, readOneLinData} = require("./utils");
/**
 * .vue文件生成树状结构
 * @method getDirTree
 * @param {String} dir 文件路径
 * @return {Boolean} true是文件, 否则是文件夹
 */
async function getDirTree(dir) {
  const obj = {
    childFiles: [], // 子文件
    childDir: {}   // 子目录
  };
  if (isFile(dir)) return console.log(`${dir}: 不是文件夹`);
  const files = readDir(dir);

  for (let file of files) { //  循环文件目录
    if (!global.EXCLUDE_DIR.includes(file)) { // 排除一些文件夹 不生成路由
      const fileDir = `${dir}/${file}`;
      if (isFile(fileDir) && path.extname(fileDir) === '.vue') { // 只处理 .vue 文件
        const data = await readOneLinData(fileDir);
        obj.childFiles.push({
          path: file.replace('.vue', ''), // 路由名称
          url: fileDir.replace(global.ROOT, ''), // 处理成在某个文件夹下面的原始路径
          ...data
        })
      } else if(!isFile(fileDir)) {
        const name = getDirName(fileDir);
        obj.childDir[name] = await getDirTree(fileDir)
      }
    }
  }
  return obj;
}

module.exports = {
  getDirTree
}
