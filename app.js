import express from 'express';
import config from 'config-lite';
import router from './routes/index.js';
import cookieParser from 'cookie-parser'
import session from 'express-session';
import connectMongo from 'connect-mongo';
import history from 'connect-history-api-fallback';
import chalk from 'chalk';

// 实例化express
const app = express();

// app.all('*')可以拦截所有请求 设置跨域
app.all('*', (req, res, next) => {
	res.header("Access-Control-Allow-Origin", req.headers.Origin || req.headers.origin);
	res.header("Access-Control-Allow-Headers", "Content-Type, Authorization, X-Requested-With");
	res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
  	res.header("Access-Control-Allow-Credentials", true); //可以带cookies
	res.header("X-Powered-By", '3.2.1')
	if (req.method == 'OPTIONS') {
	  	res.sendStatus(200);
	} else {
	    next();
	}
});

// session持久化保存到mongoDB的工具connect-mongo
const MongoStore = connectMongo(session);
app.use(
	session({
	    name: config.session.name,
		secret: config.session.secret,
		resave: true,
		saveUninitialized: false,
		cookie: config.session.cookie,
		store: new MongoStore({
			url: config.url
		})
	})
)


// 使用解析json的中间件
app.use(cookieParser());

// router是一个函数，需要传入app
router(app);

// app.use(expressWinston.errorLogger({
//     transports: [
//         new winston.transports.Console({
//           json: true,
//           colorize: true
//         }),
//         new winston.transports.File({
//           filename: 'logs/error.log'
//         })
//     ]
// }));

/** 
在express的静态文件夹设置为dist目录的时候，出现各种404错误，
发现当路由模式为history的时候，后端会直接请求地址栏中的文件，这样就会出现找不到的情况，需要结合express的connect-history-api-fallback来处理。总体思路就是： 
当请求满足以下条件的时候，该库会把请求地址转到默认（默认情况为index.html）:

1、请求方式为GET（前端路由请求的当然要是GET）
2、接受文件类型为text/html（即ajax请求中的dataType）
3、与options.rewrites中提供的模式不匹配（即自定义规则中没写到的）
*/
app.use(history({
    htmlAcceptHeaders: ['text/html', 'application/xhtml+xml']
}));


app.use(express.static('./public'));
app.listen(config.port, () => {
	// chalk是一个颜色的插件。可以通过chalk.blue(‘hello world’)来改变颜色
	console.log(chalk.green(`成功监听端口：${config.port}`))
});