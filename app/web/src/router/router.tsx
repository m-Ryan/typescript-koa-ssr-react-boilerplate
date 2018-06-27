import * as React from 'react';
import { Route, Switch } from 'react-router';
import AsyncPage from '../components/AsyncPage';

//服务端渲染
import Home from '../page/home/Home';

//按需加载
const About = ()=><AsyncPage component={import('../page/about/About')} />
const Hello = ()=><AsyncPage component={import('../page/hello/Hello')} />


function RouterConfig() {
  return (
    <Switch>
      <Route path="/" exact={true} component={Home} />
      <Route path="/about" component={About} />
      <Route path="/hello" component={Hello} />
    </Switch>
  );
}

export default RouterConfig;
