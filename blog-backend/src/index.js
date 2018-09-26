require('dotenv').config();

const mongoose = require('mongoose');
const session = require('koa-session');
const ssr = require('./ssr');

const {
  PORT: port = 4000,
  MONGO_URI: mongoURI,
  COOKIE_SIGN_KEY: signKey
} = process.env;

// Node의 Promise를 사용하도록 설정
mongoose.Promise = global.Promise;
mongoose.connect(mongoURI).then(() => {
  console.log('connected to mongodb');
}).catch((e) => {
  console.error(e);
});

const Koa = require('koa');
const Router = require('koa-router');
const bodyParser = require('koa-bodyparser');

const api = require('./api');

const app = new Koa();
const router = new Router();

const path = require('path');
const serve = require('koa-static');
const staticPath = path.join(__dirname, '../../blog-frontend/build');

// 라우터 설정
router.use('/api', api.routes());
router.get('/', ssr);

// 라우터 적용 전에 bodyParser 적용
app.use(bodyParser());

// 세션/키 적용
const sessionConfig = {
  maxAge: 86400000, // 하루
  // signed: true (기본으로 설정)
};

app.use(session(sessionConfig, app));
app.keys = [signKey];

// app 인스턴스에 라우터 적용
app.use(router.routes()).use(router.allowedMethods());

// 주의: serve가 ssr전에 와야됩니다
app.use(serve(staticPath));
app.use(ssr);

app.listen(port, () => {
  console.log('listening to port', port);
});