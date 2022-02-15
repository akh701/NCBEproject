const {
	fetchTopics,
	fetchArticleById,

	patchArticleById,
	fetchUsers,
	fetchArticles,
} = require("../models/news.models")

//-----#3 GET api/topics endpoint controller ----------
exports.getTopics = (req, res, next) => {
	fetchTopics()
		.then(topics => {
			res.status(200).send({ topics })
		})
		.catch(err => {
			console.log(err)
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
			console.log(err)
			next(err)
		})
}

//-----#7 PATCH api/articles/:article_id endpoint controller -----

exports.patchArticleById = (req, res, next) => {
	const { article_id } = req.params
	const { inc_votes } = req.body

	patchArticleById(article_id, inc_votes)
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
	fetchArticles()
		.then(articles => {
			res.status(200).send({ articles })
		})
		.catch(err => {
			next(err)
		})
}
