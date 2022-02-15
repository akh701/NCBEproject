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
})
