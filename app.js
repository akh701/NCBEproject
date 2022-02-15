const express = require("express")
const {
	getTopics,
	getArticle,
	getArticles,
} = require("./controllers/news.controllers")
const {
	handlePslErrors,
	handleCustomErrors,
	handle500s,
} = require("./error-handler")

const app = new express()

//-----#3 endpoint ----------
app.get("/api/topics", getTopics)

//-----#14 endpoint ----------
app.get("/api/articles/:article_id", getArticle)

//-----#7 endpoint ----------
// app.patch("/api/articles/:article_id", patchArticle)

//-----#9 GET /api/articles endpoint ----------
app.get("/api/articles", getArticles)

//////////////--Error Handler--/////////////////////

//---- Custom error handler -----
app.use(handleCustomErrors)

//---- Psql error handler -----
app.use(handlePslErrors)

app.use(handle500s)

//---- 404-Path not found error handler -----
app.all("/*", (req, res) => {
	res.status(404).send({ msg: "Path not found" })
})
module.exports = app
