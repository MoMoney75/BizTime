const express = require('express')
const db = require("../db");
const router = express.Router() ; 


router.get('/', async(request,response,next)=>{
let result = await db.query('SELECT * FROM companies')
try{
    return response.json({companies: result.rows})

}

catch(e){
 return next(e)
}
})

router.get('/:code', async(request,response,next)=>{
    const code = request.params.code
    let result = await db.query(`SELECT * FROM companies INNER JOIN invoices ON companies.code = invoices.comp_code 
    WHERE companies.code = $1`, [code])
    try{
        return response.json({companies: result.rows})
    }
    catch{
     return next(e)
    }
    })

    router.post('/', async(request,response,next)=>{
        try{
            const {code,name, description} = request.body;
            const result = await db.query(`INSERT INTO companies(code,name,description) VALUES($1, $2, $3) 
            RETURNING *`, 
            [code,name,description])
            return response.json({added : result.rows})
        }
        catch(e){
            console.log(e)
            return next(e)
        }
        })


    router.patch('/:code', async(request, response, next)=>{

        try{
            const company_code = request.params.code;
            const {code,name,description} = request.body;
    
            const checkQuery = await db.query(`SELECT COUNT(*) FROM companies where code = $1`, [company_code])
            const rowCount = parseInt(checkQuery.rows[0].count)

            if(rowCount === 0){
                return response.json({"error" : `company with code ${company_code} does not exist`})
            }
            else{
                const result = await db.query(`UPDATE companies SET code=$1, name = $2, description = $3 WHERE code = $4 `, [code,name,description,company_code])
                return response.json({"updated" : {code,name,description}})
            }
        
        }
        catch(e){
                return next(e)
        }
       
    })
    
router.delete('/:code', async(request,response,next) => {
    const company_code = request.params.code
    try{
        const checkQuery = await db.query(`SELECT COUNT(*) FROM companies where code = $1`, [company_code])
        const rowCount = parseInt(checkQuery.rows[0].count)

            if(rowCount === 0){
                return response.json({"error" : `company with code ${company_code} does not exist`})
            }
            else{
                result = db.query(`DELETE FROM companies WHERE code = $1`, [company_code]);
                return response.send("company successfully deleted")
            }

    }

    catch(e){
        return next(e)
    }
})
module.exports = router