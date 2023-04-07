//handle email or username duplicates
const handleDuplicateKeyError = (err, res) => {
	const field = Object.keys(err.keyValue);
	const code = 409;
	const error = `This ${field} already exists.`;
	res.status(code).send({ message: error, fields: field });
};

const handleValidationError = (err, res) => {
	let errors = Object.values(err.errors).map((el) => el.message);
    console.log(errors)
	let fields = Object.values(err.errors).map((el) => el.path);
	let code = 400;
	if (errors.length > 1) {
		const formattedErrors = errors.join(' ');
		res.status(code).send({ message: formattedErrors, fields: fields });
	} else {
		res.status(code).send({ message: errors, fields: fields });
	}
};

const errorHandler = (err, req, res, next) => {
	const statusCode = err.statusCode ? err.statusCode : 500;
	console.log(err);
	try {
		console.log('congrats you hit the error middleware',statusCode);
		if (err.name === 'ValidationError') return (err = handleValidationError(err, res));
		if (err.code && err.code == 11000) return (err = handleDuplicateKeyError(err, res));

		res.status(statusCode);
		res.json({
			message: err.message,
			stack: process.env.NODE_ENV === 'production' ? null : err.stack
		});
	} catch (err) {
		res.status(500).send('An unknown error occurred.');
	}
};

export default errorHandler;
