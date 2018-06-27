import {createStore} from 'redux';
import {IRouterContext} from 'koa-router';
import * as ReactDOMServer from 'react-dom/server';
import ssr from '../web/src/ssr';
import reducers from '../web/src/reducers/reducers';
import * as fs from 'fs';
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
    /*if (context.url) {
        ctx.res.writeHead(302, {
          Location: context.url
        })
       return ctx.res.end()
     } */
      
      let renderPage = myHtml.replace(/(\<div\s+id\="root"\>)(.|\n|\r)*(\<\/div\>)/i, "$1" + html + "$3" + initState);
      ctx.type = 'html';
      ctx.body = renderPage;
}

export default renderFullPage;