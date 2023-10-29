const express = require('express')
const db = require("../db");
const router = express.Router() ; 
const expressError = require('../expressError')

router.get('/', async(request,response,next) =>{
    try{
let result = await db.query(`SELECT industries.id AS industry_id, industries.industry_name,
array_agg(industries_companies.company_code) AS company_codes
FROM industries
LEFT JOIN industries_companies ON industries.id = industries_companies.industry_id
GROUP BY industries.id, industries.industry_name`)

                        return response.send(result.rows)

    }

    catch(e){
        return next(e)
    }
})



router.post('/', async(request,response,next) =>{
    const {industry_name} = request.body
try{

    let result = await db.query(`INSERT INTO industries(industry_name) VALUES($1) RETURNING *`, [industry_name] )
    return response.json({added : result.rows})

}

catch(e){
return next(e)
}

})

module.exports = router