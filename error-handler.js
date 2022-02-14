//---- Custom error handler -----
exports.handleCustomErrors = (err, req, res, next) => {
	const { status, msg } = err
	if (status) {
		res.status(status).send({ msg })
	} else next(err)
}

//---- Psql error handler -----
exports.handlePslErrors = (err, req, res, next) => {
	console.log(err)
	if (err.code === "22P02") {
		res.status(400).send({ msg: "Bad request" })
	} else {
		next(err)
	}
}

//--- 500s Server Errors
exports.handle500s = (err, req, res, next) => {
	console.log(err)
	res.status(500).send({ msg: "server error" })
}
