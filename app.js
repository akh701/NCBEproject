const express = require("express")
const { getTopics, getArticle } = require("./controllers/news.controllers")
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

////////////////Error Handler////////////////////////////////

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
