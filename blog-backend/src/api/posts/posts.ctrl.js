const { ObjectId } = require('mongoose').Types;

exports.checkObjectid = (ctx, next) => {
  const { id } = ctx.params;

  // 검증 실패
  if (!ObjectId.isValid(id)) {
    // 400 Bad Request
    ctx.status = 400;
    return null;
  }

  // next를 리턴해야 ctx.body가 제대로 설정됩니다.
  return next();
};

const Post = require('modules/post');
const Joi = require('joi');

/*
  POST /api/posts
  { title, body, tags }
*/
exports.write = async (ctx) => {
  const schema = Joi.object().keys({
    title: Joi.string().required(),
    body: Joi.string().required(),
    tags: Joi.array().items(Joi.string()).required()
  });

  // 첫 번째 파라미터는 검증할 객체, 두 번째는 스키마
  const result = Joi.validate(ctx.request.body, schema);

  if (result.error) {
    ctx.status = 400;
    ctx.body = result.error;
    return;
  }

  const { title, body, tags } = ctx.request.body;

  const post = new Post({
    title, body, tags
  });

  try {
    // 데이터베이스에 등록
    await post.save();
    // 저장된 결과를 반환
    ctx.body = post;
  } catch(e) {
    // 데이터베이스의 오류가 발생
    ctx.throw(e, 500);
  }
};

/*
  GET /api/posts
*/
exports.list = async (ctx) => {
  // page가 주어지지 않았다면 1로 간주
  // query는 문자열 형태로 받아 오므로 숫자로 변환
  const page = parseInt(ctx.query.page || 1, 10);
  const { tag } = ctx.query;

  const query = tag ? {
    tags: tag // tags 배열에 tag를 가진 포스트 찾기
  } : {};
  
  // 잘못된 페이지가 주어졌다면 오류
  if (page < 1) {
    ctx.status = 400;
    return;
  }

  try {
    const posts = await Post.find(query)
      .sort({_id: -1})
      .limit(10)
      .skip((page - 1) * 10)
      .lean()
      .exec();

    const postCount = await Post.count(query).exec();
    // 마지막 페이지 알려주기
    // ctx.set은 request header를 설정
    ctx.set('Last-Page', Math.ceil(postCount / 10));

    const limitBodyLength = post => ({
      ...post,
      body: post.body.length < 200 ? post.body : `${post.body.slice(0, 200)}...`
    });
    ctx.body = posts.map(limitBodyLength);
  } catch(e) {
    ctx.throw(500, e);
  }
};

/*
  GET /api/posts/:id
*/
exports.read = async (ctx) => {
  const { id } = ctx.params;
  try {
    const post = await Post.findById(id).exec();
    if (!post) {
      ctx.status = 404;
      return;
    }
    ctx.body = post;
  } catch(e) {
    ctx.throw(e, 500);
  }
};

/*
  DELETE /api/posts/:id
*/
exports.remove = async (ctx) => {
  const { id } = ctx.params;
  try {
    await Post.findByIdAndRemove(id).exec();
    ctx.status = 204;
  } catch(e) {
    ctx.throw(e, 500);
  }
};

/*
  PATCH /api/posts/:id
  { title, body, tags }
*/
exports.update = async (ctx) => {
  const { id } = ctx.params;
  try {
    const post = await Post.findByIdAndUpdate(id, ctx.request.body, {
      // 이 값을 설정해야 업데이트된 객체를 반환합니다.
      // 설정하지 않으면 업데이트되기 전의 객체를 반환합니다.
      new: true
    }).exec();
    if(!post) {
      ctx.status = 404;
      return;
    }
    ctx.body = post;
  } catch(e) {
    throw(e, 500);
  }
};