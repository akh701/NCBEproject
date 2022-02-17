const db = require("../db/connection")

//-----#3 endpoint model  ----------
exports.fetchTopics = () => {
	let queryStr = `SELECT * FROM topics`
	return db.query(queryStr).then(({ rows: topics }) => {
		return topics
	})
}

//-----#14 GET api/articles/:article_id endpoint controller -----
exports.fetchArticleById = id => {
	let queryStr = `SELECT *, comment_count FROM articles
	RIGHT JOIN (SELECT article_id, COUNT(*) AS comment_count FROM comments GROUP BY article_id) comments 
	ON comments.article_id = articles.article_id 
	WHERE articles.article_id = $1;`

	return db.query(queryStr, [id]).then(({ rows }) => {
		if (rows.length === 0) {
			return Promise.reject({ status: 404, msg: "Article not found" })
		}
		return rows[0]
	})
}

//-----#7 PATCH api/articles/:article_id endpoint model -----
exports.patchArticleById = (article_id, inc_votes) => {
	let queryStr = `UPDATE articles SET votes = votes + $1
WHERE article_id = $2 RETURNING* ;`
	return db.query(queryStr, [inc_votes, article_id]).then(({ rows }) => {
		return rows[0]
	})
}

//-----#21 GET api/users endpoint controller -----
exports.fetchUsers = () => {
	let queryStr = `SELECT username FROM users`
	return db.query(queryStr).then(({ rows: users }) => {
		return users
	})
}

//-----#9 GET /api/articles endpoint ----------
exports.fetchArticles = (sort_by = "created_at", order = "desc", topic) => {
	const valideSortBy = ["created_at", "votes"]
	const valideOrderBy = ["asc", "desc"]

	if (!valideSortBy.includes(sort_by)) {
		return Promise.reject({ status: 400, msg: "Bad request" })
	}

	if (!valideOrderBy.includes(order)) {
		return Promise.reject({ status: 400, msg: "Bad request" })
	}

	let queryStr = `SELECT author, title, article_id, topic, created_at, c, COUNT(comments.article_id) AS comment_count 
	FROM articles
	JOIN comments ON comments.article_id = articles.article_id`

	const queryVales = []
	if (topic) {
		queryStr += `WHERE topic = $1`
		queryVales.push(topic)
	}

	queryStr += `GROUP BY articles.article_id
	ORDER BY ${sort_by} ${order} ;`

	return db.query(queryStr).then(({ rows: articles }) => {
		console.log(articles, "<<<<<<")
		return articles
	})
}

//-----#15 GET /api/articles/:article_id/comments endpoint ----------
exports.fetchCommentsById = id => {
	let queryStr = `SELECT comment_id, votes, created_at, author, body FROM comments
	WHERE article_id = $1;`

	return db.query(queryStr, [id]).then(({ rows: comments }) => {
		if (comments.length === 0) {
			return Promise.reject({ status: 404, msg: "Article not found" })
		}
		return comments
	})
}
