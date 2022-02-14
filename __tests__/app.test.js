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
})
