const Router = require('koa-router');
const postsCtrl = require('./posts.ctrl');

const posts = new Router();

posts.get('/', postsCtrl.list);
posts.post('/', postsCtrl.write);
posts.get('/:id', postsCtrl.checkObjectid, postsCtrl.read);
posts.delete('/:id', postsCtrl.checkObjectid, postsCtrl.remove);
posts.patch('/:id', postsCtrl.checkObjectid, postsCtrl.update);

module.exports = posts;