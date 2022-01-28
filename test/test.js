
const request = require('supertest')
const app = require('../app.js')

describe ('post /login', function(){
	it('returns 200 with valid login', function(){
		const body = {
			"username":"cj",
			"password":"password"
		}
		return request(app)
			.post('/login')
			.send(body)
			.expect(200)
	})
})