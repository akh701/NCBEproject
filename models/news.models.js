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

//-----#9 GET /api/articles endpoint ----------
exports.fetchArticles = () => {
	let queryStr = `SELECT * FROM articles
	ORDER BY created_at desc`
	return db.query(queryStr).then(({ rows: articles }) => {
		return articles
	})
}
