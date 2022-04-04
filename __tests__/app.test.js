const request = require("supertest");
const app = require("../app.js");
const seed = require("../db/seeds/seed");
const data = require("../db/data");
const db = require("../db/connection");

afterAll(() => db.end());
beforeEach(() => seed(data));

describe("All endpoints", () => {
	test("Return a 404, when given an invalid path", () => {
		return request(app)
			.get("/an-invalid-endpoint-path")
			.expect(404)
			.then(({ body: { msg } }) => {
				expect(msg).toBe("Path not found");
			});
	});

	describe("GET - /api/topics", () => {
		test("status: 200, have lenth of 3", () => {
			return request(app)
				.get("/api/topics")
				.expect(200)
				.then(({ body: { topics } }) => {
					expect(topics).toHaveLength(3);
				});
		});

		test("Status 200, responds with an array of topic objects ", () => {
			return request(app)
				.get("/api/topics")
				.expect(200)
				.then(({ body: { topics } }) => {
					topics.forEach(topic => {
						expect(topic).toEqual(
							expect.objectContaining({
								slug: expect.any(String),
								description: expect.any(String),
							})
						);
					});
				});
		});
	});

	describe("GET - /api/articles/:article_id", () => {
		test("Status 200, responds with comment count ", () => {
			return request(app)
				.get("/api/articles/1")
				.expect(200)
				.then(({ body: { article } }) => {
					expect(article.comment_count).toBe("11");
				});
		});

		test("Status 200, responds with a specific article object ", () => {
			return request(app)
				.get("/api/articles/1")
				.expect(200)
				.then(({ body: { article } }) => {
					expect(article).toEqual({
						title: expect.any(String),
						article_id: expect.any(Number),
						topic: expect.any(String),
						author: expect.any(String),
						body: expect.any(String),
						created_at: expect.any(String),
						votes: expect.any(Number),
						comment_count: expect.any(String),
					});
				});
		});

		test("400 response with an error message for invalid article_id", () => {
			return request(app)
				.get("/api/articles/an-invalid-id")
				.expect(400)
				.then(({ body: { msg } }) => {
					expect(msg).toBe("Bad request");
				});
		});

		test("404 response with an error message for valid but non existing article_id", () => {
			return request(app)
				.get("/api/articles/99")
				.expect(404)
				.then(({ body: { msg } }) => {
					expect(msg).toBe("Article not found");
				});
		});
	});

	describe("Patch - /api/articles/:article_id", () => {
		test(`Status 200 - Responds with votes incremented by inc_votes`, () => {
			const newVote = { inc_votes: 10 };
			return request(app)
				.patch("/api/articles/1")
				.send(newVote)
				.expect(200)
				.then(({ body: { article } }) => {
					expect(article.votes).toBe(110);
				});
		});

		test(`Status 200 - Responds with votes decremented by inc_votes`, () => {
			const newVote = { inc_votes: -10 };
			return request(app)
				.patch("/api/articles/1")
				.send(newVote)
				.expect(200)
				.then(({ body: { article } }) => {
					expect(article.votes).toBe(90);
				});
		});

		test(`Status 200 - responds with an article object with the updated votes.`, () => {
			const newVote = { inc_votes: 10 };
			return request(app)
				.patch("/api/articles/1")
				.send(newVote)
				.expect(200)
				.then(({ body: { article } }) => {
					expect(article).toEqual({
						title: expect.any(String),
						article_id: expect.any(Number),
						topic: expect.any(String),
						author: expect.any(String),
						body: expect.any(String),
						created_at: expect.any(String),
						votes: 110,
					});
				});
		});

		test("400 response with an error message for invalid votes", () => {
			const newVote = { inc_votes: "ten" };
			return request(app)
				.patch("/api/articles/3")
				.send(newVote)
				.expect(400)
				.then(({ body: { msg } }) => {
					expect(msg).toBe("Bad request");
				});
		});

		test(`Status 400 - responds with error msg when passed an empty object`, () => {
			const newVote = {};
			return request(app)
				.patch("/api/articles/3")
				.send(newVote)
				.expect(400)
				.then(({ body: { msg } }) => {
					expect(msg).toBe("Bad request");
				});
		});
	});

	describe("GET - /api/users", () => {
		test("status: 200, have lenth of 4", () => {
			return request(app)
				.get("/api/users")
				.expect(200)
				.then(({ body: { users } }) => {
					expect(users).toHaveLength(4);
				});
		});

		test("Status 200, responds with an array of user objects ", () => {
			return request(app)
				.get("/api/users")
				.expect(200)
				.then(({ body: { users } }) => {
					users.forEach(user => {
						expect(user).toEqual(
							expect.objectContaining({
								username: expect.any(String),
							})
						);
					});
				});
		});
	});

	describe("GET - /api/articles", () => {
		test("status: 200, have length of 12", () => {
			return request(app)
				.get("/api/articles")
				.expect(200)
				.then(({ body: { articles } }) => {
					expect(articles).toHaveLength(12);
				});
		});

		test("Status 200, responds with an array of Article objects with comment count ", () => {
			return request(app)
				.get("/api/articles")
				.expect(200)
				.then(({ body: { articles } }) => {
					articles.forEach(article => {
						expect(article).toEqual(
							expect.objectContaining({
								title: expect.any(String),
								article_id: expect.any(Number),
								topic: expect.any(String),
								author: expect.any(String),
								created_at: expect.any(String),
								votes: expect.any(Number),
								comment_count: expect.any(String),
							})
						);
					});
				});
		});

		test("status: 200, articles sorted by date created, in descending order ", () => {
			return request(app)
				.get("/api/articles?sort_by=created_at")
				.expect(200)
				.then(({ body: { articles } }) => {
					expect(articles).toBeSortedBy("created_at", { descending: true });
				});
		});

		test("status: 200, articles sorted by votes, in descending order ", () => {
			return request(app)
				.get("/api/articles?sort_by=votes")
				.expect(200)
				.then(({ body: { articles } }) => {
					expect(articles).toBeSortedBy("votes", { descending: true });
				});
		});

		test("status: 200, articles sorted by votes, in ascending order ", () => {
			return request(app)
				.get("/api/articles?sort_by=votes&order=asc")
				.expect(200)
				.then(({ body: { articles } }) => {
					expect(articles).toBeSortedBy("votes");
				});
		});

		test("status: 200, returns an array of Article objects that are filtered by topic ", () => {
			return request(app)
				.get("/api/articles?topic=cats")
				.expect(200)
				.then(({ body: { articles } }) => {
					articles.forEach(article => {
						expect(article).toEqual(
							expect.objectContaining({
								title: expect.any(String),
								article_id: expect.any(Number),
								topic: "cats",
								author: expect.any(String),
								created_at: expect.any(String),
								votes: expect.any(Number),
								comment_count: expect.any(String),
							})
						);
					});
				});
		});

		test("400 response with an error message for invalid sort_by", () => {
			return request(app)
				.get("/api/articles?sort_by=RandomVote")
				.expect(400)
				.then(({ body: { msg } }) => {
					expect(msg).toBe("Bad request");
				});
		});

		test("400 response with an error message for invalid order", () => {
			return request(app)
				.get("/api/articles?order=RandomOrder")
				.expect(400)
				.then(({ body: { msg } }) => {
					expect(msg).toBe("Bad request");
				});
		});

		test("404 response with an error message for invalid topic", () => {
			return request(app)
				.get("/api/articles?topic=randomTopic")
				.expect(404)
				.then(({ body: { msg } }) => {
					expect(msg).toBe("Topic not found");
				});
		});
	});

	describe("GET - /api/articles/:article_id/comments", () => {
		test("status: 200, have length of 12", () => {
			return request(app)
				.get("/api/articles/1/comments")
				.expect(200)
				.then(({ body: { comments } }) => {
					expect(comments).toHaveLength(11);
				});
		});

		test("Status 200, responds with an array of comments objects ", () => {
			return request(app)
				.get("/api/articles/1/comments")
				.expect(200)
				.then(({ body: { comments } }) => {
					comments.forEach(comment => {
						expect(comment).toEqual(
							expect.objectContaining({
								comment_id: expect.any(Number),
								body: expect.any(String),
								votes: expect.any(Number),
								author: expect.any(String),
								created_at: expect.any(String),
							})
						);
					});
				});
		});

		test("400 response with an error message for invalid article_id", () => {
			return request(app)
				.get("/api/articles/an-invalid-id/comments")
				.expect(400)
				.then(({ body: { msg } }) => {
					expect(msg).toBe("Bad request");
				});
		});

		test("404 response with an error message for valid but non existing article_id", () => {
			return request(app)
				.get("/api/articles/99/comments")
				.expect(404)
				.then(({ body: { msg } }) => {
					expect(msg).toBe("Article not found");
				});
		});
	});

	describe("POST - /api/articles/:article_id/comments", () => {
		test(`Status 201 - responds with a comment for a particular article.`, () => {
			const newComment = { username: "butter_bridge", body: "Greate Article" };
			return request(app)
				.post("/api/articles/1/comments")
				.send(newComment)
				.expect(201)
				.then(({ body: { comment } }) => {
					expect(comment.body).toEqual("Greate Article");
				});
		});

		test("404 response with an error message for non existing  username", () => {
			const newComment = { username: "someuser", body: "Greate Article" };
			return request(app)
				.post("/api/articles/1/comments")
				.send(newComment)
				.expect(404)
				.then(({ body: { msg } }) => {
					expect(msg).toBe("User/Id not found");
				});
		});

		test(`Status 400 - responds with error msg when passed an empty object`, () => {
			const newComment = {};
			return request(app)
				.post("/api/articles/1/comments")
				.send(newComment)
				.expect(400)
				.then(({ body: { msg } }) => {
					expect(msg).toBe("Bad request");
				});
		});

		test("400 response with an error message for invalid article_id", () => {
			const newComment = { username: "butter_bridge", body: "Greate Article" };
			return request(app)
				.post("/api/articles/an-invalid-id/comments")
				.send(newComment)
				.expect(400)
				.then(({ body: { msg } }) => {
					expect(msg).toBe("Bad request");
				});
		});

		test("404 response with an error message for valid but non existing article_id", () => {
			const newComment = { username: "butter_bridge", body: "Greate Article" };
			return request(app)
				.post("/api/articles/99/comments")
				.send(newComment)
				.expect(404)
				.then(({ body: { msg } }) => {
					expect(msg).toBe("User/Id not found");
				});
		});
	});

	describe("DELETE - /api/comments/:comment_id", () => {
		test("Status 204 responds with empty body ", () => {
			return request(app)
				.delete("/api/comments/1")
				.expect(204)
				.then(({ body }) => {
					expect(body).toEqual({});
				});
		});

		test("400 response with an error message for invalid comment_id", () => {
			return request(app)
				.delete("/api/comments/an-invalid-id")
				.expect(400)
				.then(({ body: { msg } }) => {
					expect(msg).toBe("Bad request");
				});
		});

		test("404 response with an error message for valid but non existing comment_id", () => {
			return request(app)
				.delete("/api/comments/99")
				.expect(404)
				.then(({ body: { msg } }) => {
					expect(msg).toBe("Comment not found");
				});
		});
	});

	describe("Get /api", () => {
		test(`Status 200 - responds with an object of all api endpoints.`, () => {
			return request(app)
				.get("/api")
				.expect(200)
				.then(({ body: { endpoints } }) => {
					expect(endpoints).toEqual(
						expect.objectContaining({
							"GET /api": expect.any(Object),
							"GET /api/topics": expect.any(Object),
							"GET /api/articles": expect.any(Object),
							"GET /api/articles/:article_id": expect.any(Object),
							"GET /api/users": expect.any(Object),
							"GET /api/articles/:article_id/comments": expect.any(Object),
							"PATCH /api/articles/:article_id": expect.any(Object),
							"POST /api/articles/:article_id/comments": expect.any(Object),
						})
					);
				});
		});
	});
});
