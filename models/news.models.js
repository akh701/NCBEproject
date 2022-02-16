const db = require("../db/connection")

//-----#3 endpoint model  ----------
exports.fetchTopics = () => {
	let queryStr = `SELECT * FROM topics`
	return db.query(queryStr).then(({ rows: topics }) => {
		return topics
	})
}

//-----#14 endpoint model  ----------
exports.fetchArticleById = id => {
	let queryStr = `SELECT * FROM articles
    WHERE article_id = $1`
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
exports.fetchUsers = () => {
	let queryStr = `SELECT username FROM users`
	return db.query(queryStr).then(({ rows: users }) => {
		return users
	})
}

//-----#9 GET /api/articles endpoint ----------
exports.fetchArticles = () => {
	let queryStr = `SELECT * FROM articles
	ORDER BY created_at desc;`
	return db.query(queryStr).then(({ rows: articles }) => {
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
