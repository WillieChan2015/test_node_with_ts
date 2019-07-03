import koa from 'koa';
import Router from 'koa-router';
import fs from 'fs';
import path from 'path';
import logger from '../util/logger';

const route = new Router();

type Context = koa.ParameterizedContext;
type Next = () => Promise<any>;

const check = async (ctx: Context, next: Next): Promise<any> => {
    // logger.info('method: ' + ctx.method);
    // logger.info('request path: ' + ctx.path);
    // logger.info("request time: " + new Date());
    return next();
};

const about = (ctx: Context) => {
    ctx.response.type = 'html';
    ctx.response.body = '<a href="/">Index Page</a>';
};

const main = (ctx: Context, next: Next) => {
    // ctx.response.type = 'html';
    // ctx.response.body = `
    //     Hello World
    //     <br>
    //     <a href="/about">About Page</a>
    //     <br>
    //     <a href="/get_name">get name</a>
    //     <br>
    //     <a href="/test_post">Test post</a>
    // `;
    ctx.cookies.set(
        'cid', 
        'hello world',
        {
            domain: 'localhost',  // 写cookie所在的域名
            path: '/',       // 写cookie所在的路径
            maxAge: 10 * 60 * 1000, // cookie有效时长
            expires: new Date('2019-08-15'),  // cookie失效时间
            httpOnly: false,  // 是否只用于http请求中获取
            overwrite: false  // 是否允许重写
        }
    );
    let content = fs.readFileSync(path.join(__dirname, "../../static/index.html"), 'binary');
    ctx.body = content;
};

const testPost = (ctx: Context) => {
    if (  ctx.method === 'GET' ) {
        // 当GET请求时候返回表单页面
        let html = `
          <h1>koa2 request post demo</h1>
          <form method="POST" action="/test_post">
            <p>userName</p>
            <input name="userName" /><br/>
            <p>nickName</p>
            <input name="nickName" /><br/>
            <p>email</p>
            <input name="email" /><br/>
            <button type="submit">submit</button>
          </form>
        `;
        ctx.body = html
    } else if (  ctx.method === 'POST' ) {
        // 当POST请求的时候，中间件koa-bodyparser解析POST表单里的数据，并显示出来
        let postData = ctx.request.body;
        console.log(postData);
        ctx.body = postData;
    } else {
        // 其他请求显示404
        ctx.body = '<h1>404！！！ o(╯□╰)o</h1>'
    }
};

const getName = (ctx: Context) => {
    // if (ctx.method.toLowerCase() === 'get') {
    //     ctx.response.status = 403;
    //     ctx.response.type = 'json';
    //     ctx.response.body = {
    //         code: 2000,
    //         msg: 'method not allowed'
    //     };
    //     return
    // }
    ctx.response.type = 'json';
    ctx.response.body = {
        name: 'Jack'
    };
};


route.all("*", check);
route.get('/', main);
route.get('/about', about);
route.get('/get_name', getName);
route.all('/test_post', testPost);
route.all("*", (ctx) => {
    ctx.status = 404;
    ctx.body = '404 Not Found'
});

export default route;