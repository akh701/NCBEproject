const request = require("supertest")
const app = require("../app.js")
const seed = require("../db/seeds/seed")
const data = require("../db/data")
const db = require("../db/connection")

afterAll(() => db.end())
beforeEach(() => seed(data))

describe("All endpoints", () => {
	// test for invalide path and give 404 error message
	test("Return a 404, when given an invalid path", () => {
		return request(app)
			.get("/an-invalid-endpoint-path")
			.expect(404)
			.then(({ body: { msg } }) => {
				expect(msg).toBe("Path not found")
			})
	})
	//-----#3 endpoint ----------
	describe("GET - /api/topics", () => {
		// tests the length of the array object
		test("status: 200, have lenth of 3", () => {
			return request(app)
				.get("/api/topics")
				.expect(200)
				.then(({ body: { topics } }) => {
					expect(topics).toHaveLength(3)
				})
		})
		// returns an array of topic objects
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
						)
					})
				})
		})
	})
	//-----#14 endpoint ----------
	describe("GET - /api/articles/:article_id", () => {
		// returns a specific article object
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
					})
				})
		})
		// tests for invlaide article_id
		test("400 response with an error message for invalid article_id", () => {
			return request(app)
				.get("/api/articles/an-invalid-id")
				.expect(400)
				.then(({ body: { msg } }) => {
					expect(msg).toBe("Bad request")
				})
		})
		// tests for Valid but non existing artice_id
		test("404 response with an error message for valid but non existing article_id", () => {
			return request(app)
				.get("/api/articles/99")
				.expect(404)
				.then(({ body: { msg } }) => {
					expect(msg).toBe("Article not found")
				})
		})
	})

	//-----#7 PATCH api/articles/:article_id endpoint controller -----
	describe("Patch - /api/articles/:article_id", () => {
		// tests if votes have been incremented with a positive vote
		test(`Status 200 - Responds with votes incremented by inc_votes`, () => {
			const newVote = { inc_votes: 10 }
			return request(app)
				.patch("/api/articles/1")
				.send(newVote)
				.expect(200)
				.then(({ body: { article } }) => {
					expect(article.votes).toBe(110)
				})
		})
		// tests if votes have been decremented with a negative vote
		test(`Status 200 - Responds with votes decremented by inc_votes`, () => {
			const newVote = { inc_votes: -10 }
			return request(app)
				.patch("/api/articles/1")
				.send(newVote)
				.expect(200)
				.then(({ body: { article } }) => {
					expect(article.votes).toBe(90)
				})
		})
		// returns a specific article object with the updated votes
		test(`Status 200 - responds with an article object with the updated votes.`, () => {
			const newVote = { inc_votes: 10 }
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
						votes: expect.any(Number),
					})
				})
		})
		// tests for invalid votes
		test("400 response with an error message for invalid votes", () => {
			const newVote = { inc_votes: "ten" }
			return request(app)
				.patch("/api/articles/3")
				.send(newVote)
				.expect(400)
				.then(({ body: { msg } }) => {
					expect(msg).toBe("Bad request")
				})
		})
		// tests for when user submits empty votes
		test(`Status 400 - responds with error msg when passed an empty object`, () => {
			const newVote = {}
			return request(app)
				.patch("/api/articles/3")
				.send(newVote)
				.expect(400)
				.then(({ body: { msg } }) => {
					expect(msg).toBe("Bad request")
				})
		})
	})
	//-----#21 endpoint----------
	describe("GET - /api/users", () => {
		// tests the length of the array object
		test("status: 200, have lenth of 4", () => {
			return request(app)
				.get("/api/users")
				.expect(200)
				.then(({ body: { users } }) => {
					expect(users).toHaveLength(4)
				})
		})
		// returns an array of user objects
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
						)
					})
				})
		})
	})
	//-----#9 GET /api/articles endpoint ----------
	describe("GET - /api/articles", () => {
		// tests the length of the array object
		test("status: 200, have length of 12", () => {
			return request(app)
				.get("/api/articles")
				.expect(200)
				.then(({ body: { articles } }) => {
					expect(articles).toHaveLength(12)
				})
		})
		// returns an array of Article objects
		test("Status 200, responds with an array of Article objects ", () => {
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
								body: expect.any(String),
								created_at: expect.any(String),
								votes: expect.any(Number),
							})
						)
					})
				})
		})
		// tests that articles are ordered by date in descending
		test("staus: 200, articles sorted by date created, in descending order ", () => {
			return request(app)
				.get("/api/articles")
				.then(({ body: { articles } }) => {
					expect(articles).toBeSortedBy("created_at", { descending: true })
				})
		})
	})
	//-----#15 GET /api/articles/:article_id/comments endpoint ----------
	describe.only("GET - /api/articles/:article_id/comments", () => {
		// tests the length of the array object
		test("status: 200, have length of 12", () => {
			return request(app)
				.get("/api/articles/1/comments")
				.expect(200)
				.then(({ body: { comments } }) => {
					expect(comments).toHaveLength(11)
				})
		})
		// returns an array of comments objects
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
						)
					})
				})
		})
		// tests for invlaide article_id
		test("400 response with an error message for invalid article_id", () => {
			return request(app)
				.get("/api/articles/an-invalid-id/comments")
				.expect(400)
				.then(({ body: { msg } }) => {
					expect(msg).toBe("Bad request")
				})
		})
		// tests for Valid but non existing artice_id
		test("404 response with an error message for valid but non existing article_id", () => {
			return request(app)
				.get("/api/articles/99/comments")
				.expect(404)
				.then(({ body: { msg } }) => {
					expect(msg).toBe("Article not found")
				})
		})
	})
})
