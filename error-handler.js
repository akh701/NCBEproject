//---- Custom error handler -----
exports.handleCustomErrors = (err, req, res, next) => {
	const { status, msg } = err
	if (status) {
		res.status(status).send({ msg })
	} else next(err)
}

//---- Psql error handler -----
exports.handlePsqlErrors = (err, req, res, next) => {
	console.log(err)
	const code = ["22P02", "23502"]
	if (code.includes(err.code)) {
		res.status(400).send({ msg: "Bad request" })
	} else if (err.code === "23503") {
		res.status(404).send({ msg: "User/Id not found" })
	} else {
		next(err)
	}
}

//--- 500s Server Errors
exports.handle500s = (err, req, res, next) => {
	console.log(err)
	res.status(500).send({ msg: "server error" })
}
