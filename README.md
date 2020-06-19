### 自动加载路由打包器

##### 安装和使用（install and use）
```javascript
npm install vue-router-auto-pack -D
```

##### 如果使用的是vue-cli3
```javascript
// 在 vue.config.js 文件
const { watch } = require("vue-router-auto-pack");
watch();

// 启动项目，注意该插件默认是src/pages 文件夹中的.vue文件进行加载
// 如果想修改路径可以
const { watch, packConfig } = require("vue-router-auto-pack"); 
packConfig({
  exclude: 'components,common,api,store,service'.split(','), // 排除加载的文件夹，以上是默认的
  root: path.join(__dirname, '../../src/pages'), // 默认加载文件的路径
  route_path: path.join(__dirname, '../../src/router/_router_list.js') // 打包生成的路由列表文件所在的位置
})
watch()
```
##### 在路由中使用

```javascript
// 路由文件 router/index.js
import Vue from "vue";
import Router from "vue-router";
import { routerList } from "./_router_list"; // 生成的文件

Vue.use(Router);

const routes = new Router({
  mode: "",
  routes: [...routerList]
});

export default routes;
```
##### 设置路由的name和meta
> 在.vue文件的第一行加上注释如下：
```javascript
// { name: 'test', meta: { icon: 'good' } }
```


