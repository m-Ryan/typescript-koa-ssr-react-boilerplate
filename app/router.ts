import * as Router from 'koa-router';
import  renderFullPage from './utils/renderFullPage';
const router = new Router();

router.get('/', async(ctx, next)=>{
    let books = [
            {
                id: 1,
                name: `书1`,
                price:  562
            },
            {
                id: 2,
                name: `书2`,
                price:  458
            },
        ]
    renderFullPage(ctx, { books });

})
router.get('/about', async(ctx, next)=>{
    let book = {
        id: 1,
        name: `书1`,
        price:  562
    }
    renderFullPage(ctx, { books: [book] });
})

router.get('/hello', async(ctx, next)=>{
    renderFullPage(ctx, {});
})


router.get('*', async(ctx)=>{
    ctx.res.write('404')
    ctx.res.end()
})

export default router;