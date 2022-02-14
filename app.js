const express = require("express")
const { getTopics } = require("./controllers/news.controllers")

const app = new express()

//-----#3 endpoint ----------
app.get("/api/topics", getTopics)

//---- Path not found error handler -----
app.all("/*", (req, res) => {
	res.status(404).send({ msg: "Path not found" })
})
module.exports = app
