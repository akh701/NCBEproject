const db = require("../db/connection");

exports.fetchTopics = () => {
	let queryStr = `SELECT * FROM topics`;
	return db.query(queryStr).then(({ rows: topics }) => {
		return topics;
	});
};

exports.fetchArticleById = id => {
	let queryStr = `SELECT *, comment_count FROM articles
	RIGHT JOIN (SELECT article_id, COUNT(*) AS comment_count FROM comments GROUP BY article_id) comments 
	ON comments.article_id = articles.article_id 
	WHERE articles.article_id = $1;`;

	return db.query(queryStr, [id]).then(({ rows }) => {
		if (rows.length === 0) {
			return Promise.reject({ status: 404, msg: "Article not found" });
		}
		return rows[0];
	});
};

exports.updateArticleById = (article_id, inc_votes) => {
	let queryStr = `UPDATE articles SET votes = votes + $1
WHERE article_id = $2 RETURNING* ;`;
	return db.query(queryStr, [inc_votes, article_id]).then(({ rows }) => {
		return rows[0];
	});
};

exports.fetchUsers = () => {
	let queryStr = `SELECT username FROM users`;
	return db.query(queryStr).then(({ rows: users }) => {
		return users;
	});
};

exports.fetchArticles = (sort_by = "created_at", order = "desc", topic) => {
	const valideSortBy = ["created_at", "votes"];
	const valideOrderBy = ["asc", "desc"];

	if (!valideSortBy.includes(sort_by)) {
		return Promise.reject({ status: 400, msg: "Bad request" });
	}

	if (!valideOrderBy.includes(order)) {
		return Promise.reject({ status: 400, msg: "Bad request" });
	}

	let queryStr = `SELECT articles.author, articles.title, articles.article_id, articles.topic, articles.created_at, articles.votes, 
	COUNT(comments.article_id) AS comment_count 
	FROM articles
	LEFT JOIN comments ON comments.article_id = articles.article_id`;

	const queryVales = [];
	if (topic) {
		queryStr += ` WHERE articles.topic ILIKE $1`;
		queryVales.push(topic);
	}

	queryStr += ` GROUP BY articles.article_id
	ORDER BY ${sort_by} ${order} ;`;

	return db.query(queryStr, queryVales).then(({ rows: articles }) => {
		return articles;
	});
};

exports.fetchCommentsById = id => {
	let queryStr = `SELECT comment_id, votes, created_at, author, body FROM comments
	WHERE article_id = $1;`;

	return db.query(queryStr, [id]).then(({ rows: comments }) => {
		if (comments.length === 0) {
			return Promise.reject({ status: 404, msg: "Article not found" });
		}
		return comments;
	});
};

exports.insertCommentById = (id, comment) => {
	const { username, body } = comment;
	let queryStr = `INSERT INTO comments (author, body, article_id) 
	VALUES ($1, $2, $3)  RETURNING * ;`;
	return db.query(queryStr, [username, body, id]).then(({ rows }) => {
		if (rows.length === 0) {
			return Promise.reject({ status: 404, msg: "Article not found" });
		}
		return rows[0];
	});
};

exports.deleteCommentById = id => {
	let queryStr = `DELETE FROM comments
	WHERE comment_id = $1  ;`;

	return db.query(queryStr, [id]);
};
