const express = require('express')
const db = require("../db");
const router = express.Router() ; 
const slugify = require('slugify')
const expressError = require('../expressError')

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
    let result = await db.query(`SELECT companies.*, 
    array_agg(industries.industry_name) AS industry_names,
    array_agg(jsonb_build_object(
        'id', invoices.id,
        'comp_code', invoices.comp_code,
        'amt', invoices.amt,
        'paid', invoices.paid,
        'add_date', invoices.add_date,
        'paid_date', invoices.paid_date
    )) AS company_invoices
FROM companies 
LEFT JOIN industries_companies ON companies.code = industries_companies.company_code
LEFT JOIN industries ON industries_companies.industry_id = industries.id
LEFT JOIN invoices ON companies.code = invoices.comp_code
WHERE companies.code = $1
GROUP BY companies.code`, [code])
    try{
        return response.json({companies: result.rows})
    }
    catch{
        return response.send(new expressError(`Company with code of ${code} does not exist`, 404))
    }
    })

    router.post('/', async(request,response,next)=>{
        try{
            const {code,name, description} = request.body;
            const slugifiedCode = slugify(code,{ 
                replacement: '_',
                lower: true,
                remove: /[*+~.#%^()$'"!:@]/g
            
            }
                
                
                )
            const result = await db.query(`INSERT INTO companies(code,name,description) VALUES($1, $2, $3) 
            RETURNING *`, 
            [slugifiedCode,name,description])
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
                return response.send(new expressError(`Company with code of ${code} does not exist`, 404))
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

    catch{
        return response.send(new expressError(`Company with code of ${code} does not exist`, 404))
    }
})
module.exports = router