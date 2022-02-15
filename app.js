const express = require("express")

const {
	getTopics,
	getArticle,
  getArticles,
  getUsers,
	patchArticleById,
} = require("./controllers/news.controllers")
const {
	handlePsqlErrors,
	handleCustomErrors,
	handle500s,
} = require("./error-handler")

const app = new express()
app.use(express.json())

//-----#3 endpoint ----------
app.get("/api/topics", getTopics)

//-----#14 endpoint ----------
app.get("/api/articles/:article_id", getArticle)

//-----#7 endpoint ----------
app.patch("/api/articles/:article_id", patchArticleById)

//-----#21 endpoint----------
app.get("/api/users", getUsers)

//-----#9 GET /api/articles endpoint ----------
app.get("/api/articles", getArticles)

//////////////--Error Handler--/////////////////////

app.use(handleCustomErrors)

app.use(handlePsqlErrors)

app.use(handle500s)

//---- 404-Path not found error handler -----
app.all("/*", (req, res) => {
	res.status(404).send({ msg: "Path not found" })
})

//-----------------//
module.exports = app
