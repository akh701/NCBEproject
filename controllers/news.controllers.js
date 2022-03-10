const {
	fetchTopics,
	fetchArticleById,

	updateArticleById,
	fetchUsers,
	fetchArticles,
	fetchCommentsById,
	insertCommentById,
	deleteCommentById,
} = require("../models/news.models")

const {
	checkUserExists,
	checkCommentIdExists,
	checkTopicExists,
} = require("../models/utils")

const endpointApi = require("../endpoints.json")

//-----#3 GET api/topics endpoint controller ----------
exports.getTopics = (req, res, next) => {
	fetchTopics()
		.then(topics => {
			res.status(200).send({ topics })
		})
		.catch(err => {
			next(err)
		})
}

//-----#14 GET api/articles/:article_id endpoint controller -----
exports.getArticle = (req, res, next) => {
	const { article_id } = req.params
	fetchArticleById(article_id)
		.then(article => {
			res.status(200).send({ article })
		})
		.catch(err => {
			next(err)
		})
}

//-----#7 PATCH api/articles/:article_id endpoint controller -----

exports.patchArticleById = (req, res, next) => {
	const { article_id } = req.params
	const { inc_votes } = req.body

	updateArticleById(article_id, inc_votes)
		.then(article => {
			res.status(200).send({ article })
		})
		.catch(err => {
			next(err)
		})
}
//-----#21 GET api/users endpoint controller -----
exports.getUsers = (req, res, next) => {
	fetchUsers()
		.then(users => {
			res.status(200).send({ users })
		})
		.catch(err => {
			next(err)
		})
}
//-----#9 GET /api/articles endpoint ----------
exports.getArticles = (req, res, next) => {
	const { sort_by, order, topic } = req.query

	return Promise.all([
		fetchArticles(sort_by, order, topic),
		topic ? checkTopicExists(topic) : null,
	])
		.then(([articles]) => {
			res.status(200).send({ articles })
		})
		.catch(err => {
			next(err)
		})
}

//-----#15 GET /api/articles/:article_id/comments endpoint ----------
exports.getCommentsById = (req, res, next) => {
	const { article_id: articleId } = req.params
	fetchCommentsById(articleId)
		.then(comments => {
			res.status(200).send({ comments })
		})
		.catch(err => {
			next(err)
		})
}

//-----#11 POST /api/articles/:article_id/comments endpoint ----------
exports.postCommentById = (req, res, next) => {
	const { article_id: articleId } = req.params

	insertCommentById(articleId, req.body)
		.then(comment => {
			res.status(201).send({ comment })
		})
		.catch(err => {
			next(err)
		})
}

//-----#12 Delete /api/comments/:comment_id endpoint ----------
exports.removeCommentById = (req, res, next) => {
	const { comment_id } = req.params
	return Promise.all([
		checkCommentIdExists(comment_id),
		deleteCommentById(comment_id),
	])
		.then(() => {
			res.sendStatus(204)
		})
		.catch(err => {
			next(err)
		})
}
//-----#13 GET /api endpoint ----------
exports.getApi = (req, res, next) => {
	return Promise.resolve(endpointApi)
		.then(endpoints => {
			res.status(200).send({ endpoints })
		})
		.catch(err => {
			next(err)
		})
}
