
export function dealWithRouterList (homesList, pages = 'pages', homes = []) {
  homesList.forEach(item => {
    // import 是静态导入， 不能传入变量和表达式
    const url = `${pages}${item.url}`;
    item.component = () => import(`@/${url}`);
    homes.push(item)
    if (item.children && item.children.length) {
      dealWithRouterList(item.children, pages, homes[homes.length -1].children)
    }
  })
  return homes
}
