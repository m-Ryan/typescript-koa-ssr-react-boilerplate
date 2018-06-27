import * as React from 'react';

import * as Loadable from 'react-loadable';

const Loading=()=><div>加载中</div>

const DynamicLoad = (component) => {
  return Loadable({
    loader: () => component,
    loading: Loading,
  });
};


export default DynamicLoad;
