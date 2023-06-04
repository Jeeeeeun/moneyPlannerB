/*
@swagger
/getCurrency:
	get:
		summary: Returns a list of currency data.
		description:
		produces:
			- application/json
			responses:
				200:
					description: A list of currency.
					schema:
						type: array
						items:
							$ref: '#/definitions/Currency'
*/