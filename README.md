# typescript-koa-ssr-react-boilerplate

## typescript版的前后端开发脚手架

### 虽然这是最常见的做法，但不再推荐这种做法，非常的不优雅。提供一个思路
- 1.服务端模拟浏览器环境，直接在服务端调用 ReactDOMServer.render 渲染组件收集状态
- 2.将收集的状态重新注入回组件，调用 renderToStaticMarkup 获取渲染内容
- 类似
    ```js
    axiosInstance.defaults.baseURL = `http://localhost:${SERVER_PORT}`;
    const { store } = createStore(modelsMap, initProps);
    // 收集依赖数据
    const initComponent = getApp(url, {
        store,
    });

    render(initComponent, document.createElement('div'));
    await store.awaitSSR(10000);
    const injectProps = JSON.stringify(store.getState());
    // 渲染注入数据的组件
    const component = getApp(url, {
        store,
    });

    const renderContent = ReactDOMServer.renderToStaticMarkup(component);
    const htmlTemplete = await getHtmlTemplete();

    // 注入内容
    const renderHtml = injectTemplete(htmlTemplete, {
        'SSR_THEME_CSS': store.getState().themeColor.currentStyle,
        'SSR_INJECT_PROPS': `window.__INITIAL_STATE__ = ${injectProps}`,
        'SSR_DOCUMENT_TITLE': document.title,
        'SSR_META_DESCRIPTION': window.__META_DESCRIPTION__,
        'SSR_RENDER_CONTENT': renderContent
    });
    console.log(`renderFullPage end. time：${(dayjs().unix() - beginTime)}ms`);
    return renderHtml;
```

完整的SSR项目 [https://github.com/m-Ryan/RyanCMS](https://github.com/m-Ryan/RyanCMS)


## 特色
> * [x] 前后端分离
> * [x] typeScript
> * [x] 服务端渲染
> * [x] react-router按需加载
> * [x] redux
> * [x] 使用最新的react v.16.4

---

>  webpack 没有升级到最新（目前是3.8）。由于一些webpack插件原因，导致只能回退。刚开始配置是最新的webpack，但是babel-plugin-import 引入antd 的时候，有部分组件不能正常使用。


## 服务端渲染实现

router.tsx 路由
```
    ...
    function RouterConfig() {
        return (
            <Switch>
                <Route path="/" exact={true} component={Home} />
                <Route path="/about" component={About} />
                <Route path="/hello" component={Hello} />
            </Switch>
        );
    }
```

---

ssr.tsx 匹配路径
```
...
export default (url: string | Object, context: any,store: any)=>{
   return  <Provider store={store}>
            <StaticRouter location={url} context={context}>
                <Routes/>
              </StaticRouter>
          </Provider>
}


```

---

renderFullPage.ts 渲染页面

```
...
const renderFullPage = (ctx : IRouterContext, newState:Object ) => {
    let context  = {}
    const myHtml = fs.readFileSync("app/web/assets/dist/templete.html", 'utf-8');
    // 得到初始 state 创建新的 Redux store 实例
    const store = createStore(reducers, newState);
    // 从 Redux store 得到初始 state,注入到window
    const finalState = store.getState()
    let initState = `<script> window.__INITIAL_STATE__ = ${JSON.stringify(finalState)}</script>`;
    //根据路由获取html并注入到<div id="root"></div>，将 initState 插到该节点后面
    const html = ReactDOMServer.renderToString(ssr(ctx.req.url, context, store));
    let renderPage = myHtml.replace(/(\<div\s+id\="root"\>)(.|\n|\r)*(\<\/div\>)/i, "$1" + html + "$3" + initState);
    ctx.type = 'html';
    ctx.body = renderPage;
}

export default renderFullPage;
```

index.tsx 前端的路由处理
```
...
const preloadedState =  window.__INITIAL_STATE__ || {} //
// 使用初始 state 创建 Redux store
const store = createStore(reducers, preloadedState)
render(
  <Provider  store={store}>
    <BrowserRouter>
        <Routes/>
    </BrowserRouter>
  </Provider>,
  document.getElementById('root')  as HTMLElement
)


```

---

> #### 1..redux方面，先创建新的 Redux store 实例，将我们需要初始的state合并到 store
> #### 2.通过 store.getState() 获取最终的finalState
> #### 3.通过 StaticRouter 可以获取路径匹配的页面组件，并通过 ReactDOMServer.renderToString 转化为HTML元素
    ssr.tsx 主要做了两件事：
    1.将初始的 store 注入redux
    2.返回带有 store 数据的路径匹配的页面组件，也就是说这个页面已经是有初始数据了

> #### 4.将读取的html模板注入数据，在这里我们需要通过简单的正则替换一下
    在 <div id="root"></div> 中插入我们的html元素
    在 <div id="root"></div> 后面插入 `<script> window.__INITIAL_STATE__ = ${JSON.stringify(finalState)}</script>`
> #### 5.将这个页面发送出去
> #### 6.js加载的时候会读取 `window.__INITIAL_STATE__` 的数据，合并到 store



### 注意：这里 我们是用 fs模块 读取 html模板，而不是直接使用 类似以下函数

```
export default (html, finalState)=>(
    `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width,initial-scale=1,minimum-scale=1,maximum-scale=1,user-scalable=no">
        <meta http-equiv="X-UA-Compatible" content="IE=edge, chrome=1" />
        <meta name="renderer" content="webkit">
        <title>typeScript-koa-ssr-antd</title>
        <link href="/dist/index.076a9ad74b9f609c4d81.css" rel="stylesheet">
    </head>

    <body>
        <div id="root">${html}</div>
        window.__INITIAL_STATE__ = ${JSON.stringify(finalState)}</script>
    </body>
    </html>

    `
)
```

### 原因主要是因为打包得到的 js、css 需要有hash值来管理版本缓存，所以是不能直接写死的


---

## 怎么使用

> git clone git@github.com:m-Ryan/typescript-koa-ssr-react-boilerplate.git
> cd typescript-koa-ssr-react-boilerplate

## 后台
> * 首次使用，先 npm install
> * 开发环境 npm start
> * 生产环境 npm run build

## 前端
> * cd app/web 首次使用，先 npm install
> * 开发环境 npm start
> * 生产环境 npm run build

### 考虑到前后端分离，这里没有使用 webpack-middleware
### 打算在之后的项目中使用，但目前还没开始。不确定有没有bug，仅供参考
