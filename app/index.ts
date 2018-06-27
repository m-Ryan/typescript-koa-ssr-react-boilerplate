import * as Koa from 'koa';
import * as morgan from 'koa-morgan'
import * as lessParser from 'postcss-less';
import * as path from 'path';
import * as hook  from 'css-modules-require-hook';

hook({
    generateScopedName: '[name]__[local]',
    extensions: ['.css', '.less', '.scss'],
    processorOpts: {parser: lessParser.parse},
  });

  
const app = new Koa();

app.use(morgan('dev')); //日志
app.use(require('koa-static')(path.join(__dirname, '/web/assets'),{
  maxage: 365 * 60 * 60 * 24,
}));


app.use(require('./router').default.routes());// 这个必须在 hook 后面导入
app.listen(3000); 
console.log('server running on port 3000');
