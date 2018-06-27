
import * as React from 'react';
import { StaticRouter } from 'react-router';
import Routes from './router/router';
import { Provider } from 'react-redux';
  // 创建新的 Redux store 实例
  // 通过服务端注入的全局变量得到初始 state
  const {
    JSDOM
  } = require('jsdom')
  const dom = new JSDOM('<!DOCTYPE html><html><body></body></html>')

  declare global {
    namespace NodeJS {
        interface  Global {
            window: any;
            document: any;
            navigator: any;
            localStorage: any;
            Element: any;
        }
    }
}

if (typeof window === 'undefined') {
    global.window = dom.window
    global.document = dom.window.document
    global.navigator = dom.window.navigator
    global.localStorage = {}
    global.Element = dom.window.Element
  }
export default (url: string | Object, context: any,store: any)=>{
   return  <Provider store={store}>
            <StaticRouter location={url} context={context}>
                <Routes/>
              </StaticRouter>
          </Provider>
}


