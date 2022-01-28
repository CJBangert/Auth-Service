
const request = require('supertest')
const app = require('../app.js')

describe ('post /authenticate', function(){

	it('returns 200 with valid authentication', function(){

		const body = {

			"username":"cj",
			"password":"password"

		}

		return request(app)

			.post('/authenticate')

			.send(body)

			.expect(200)
	})
})