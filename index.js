const fs = require('fs')
const path = require('path')

global.EXCLUDE_DIR = 'components,common,api,store,service'.split(',')
global.ROOT = path.join(__dirname, '../../src/pages')
global.ROUTE_PATH = path.join(__dirname, '../../src/router/_router_list.js')

const { getDirTree } = require('./fileTree.js')

/**
 * 处理树状结构类 路由结构
 * @method dealWithHomeList
 * @param {Object, Array, String}
 * @return {Array}
 */
function dealWithHomeList(obj, homes = [], root = '/') {
  if (obj.childFiles && obj.childFiles.length) { // 处理第一层的文件
    const fd = obj.childFiles.find(item => item.path === 'index')
    if (fd) { // 属于子集的时候
      homes.push({
        ...fd,
        path: root,
        url: fd.url,
        children: []
      })
    }
    obj.childFiles.forEach(item => {
      if (fd && item.path !== 'index') {
        homes[homes.length-1].children.push({
          ...item,
          children: []
        })
      } else if (!fd) {
        homes.push({
          ...item,
          path: root + '/' + item.path,
          url: item.url,
          children: []
        })
      }
    })
    // 处理 childDir 里面数据的时候
    if (obj.childDir && JSON.stringify(obj.childDir) !== '{}') {
      const keys = Object.keys(obj.childDir)
      keys.forEach(item => {
        if (fd) {
          dealWithHomeList(obj.childDir[item], homes[homes.length-1].children, item)
        } else {
          dealWithHomeList(obj.childDir[item], homes, root + '/' + item)
        }
      })
    }
  }
  return homes
}

// 生成文件最后使用
// 生成文件最后使用
function createFile() {
  getDirTree(global.ROOT).then(data => {
    if (data) {
      const homes = dealWithHomeList(data)
      const outData = 'import { dealWithRouterList } from "vue-router-auto-pack/common"' +
        ';\t const router = ' + JSON.stringify(homes, '', '\t') +
        ';\t const routerList = dealWithRouterList(router)' +
        ';\t export { routerList , router }'
      fs.writeFile(global.ROUTE_PATH, outData, 'utf8', (err) => {
        if (err) throw err;
      });
    }
  })
}

let lastUpdateTime = 0
let timeOut = 0
function watch(dir = global.ROOT) {
  fs.watch(dir, (event, filename)=> {
    if (global.EXCLUDE_DIR.includes(filename)) return
    const diff = Date.now() - lastUpdateTime
    lastUpdateTime = Date.now()
    if (diff < 100) return
    console.log('event is: ' + ' now:' + new Date());
    clearTimeout(timeOut)
    timeOut = setTimeout(() => {
      createFile()
    }, 100)
  })

  // 原生监控不能监控到子文件夹中的文件改变事件，遍历之
  const files = fs.readdirSync(dir);
  for (let i = 0; i < files.length; i++) {
    if (global.EXCLUDE_DIR.includes(files[i])) continue
    const file = dir + '/' + files[i]
    const stat = fs.statSync(file)
    if (stat.isDirectory() == true) {
      watch(file);
    }
  }
}

// 修改配置的函数
function packConfig(options = {}) {
  global.EXCLUDE_DIR =  options.exclude || 'components,common,api,store,service'.split(',')
  global.ROOT = options.root || path.join(__dirname, '../../src/pages')
  global.ROUTE_PATH = options.route_path || path.join(__dirname, '../../src/router/_router_list.js')
}

createFile()
watch()

module.exports = {
  packConfig,
  createFile,
  watch
}
