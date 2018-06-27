import * as React from 'react'
import { render } from 'react-dom'
import { createStore } from 'redux'
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import Routes from './router/router'
import reducers from './reducers/reducers'


// 通过服务端注入的全局变量得到初始 state
declare global {
  interface Window { __INITIAL_STATE__: Object; }
}

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
