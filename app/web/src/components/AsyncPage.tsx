import * as React from 'react';
import * as Loadable from 'react-loadable';
const Loading=()=><div>加载中</div>

interface AsyncProps extends React.Props<AsyncProps> {
    component: any;
 }



const AsyncPage = (props: AsyncProps)=>{
    const LoadableComponent = Loadable({
        loader: () => props.component,
        loading: Loading,
      });
    return <LoadableComponent/>;
}

export default AsyncPage;
