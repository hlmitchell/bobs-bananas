const { server, app } = require('../server/server.js');
const request = require('supertest');

describe("Test /totalCost route", () => {

  it('should respond with 200 if ok', async () => {
    const response = await request(app)
      .post('/findCost')
      .set('Accept', 'application/json')
      .send({
        startDate: '01/01/2001', 
        numberOfDays: 31
      })
    expect(response.statusCode).toBe(200);
  });

  it('should respond with 400 if wrong input', async () => {
    const response = await request(app)
      .post('/findCost')
      .set('Accept', 'application/json')
      .send({
        startDate: '01/01/200', 
        numberOfDays: 31
      })
    expect(response.statusCode).toBe(400);
  });

  it('should respond with 404 for any other route', async () => {
    const response = await request(app)
      .post('/hat')

    expect(response.statusCode).toBe(404);
  });

  afterAll(done => {
    // needed for jest to exit properly
    server.close();
  });

})