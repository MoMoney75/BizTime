process.env.NODE_ENV = 'test';
const request = require('supertest')
const app = require('./app')
const db = require("./db");




// testing companies.js
let test_company;

beforeEach(async(request,response,next) => {
    let result = await db.query(`INSERT INTO companies(code,name,description) 
                                VALUES('test_code','test_company','test descript')` );
                                test_company = result.rows[0]

})

afterEach(async function() {
    // delete any data created by test
    await db.query("DELETE FROM companies");
  });
  
  afterAll(async function() {
    // close db connection
    await db.end();
  });


describe('GET ALL COMPANIES' , ()=>{
test('get all companies from companies', async ()=>{
    let result = await request(app).get('/companies');
    expect(response.statusCode).toEqual(200);
})

})