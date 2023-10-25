const express = require('express')
const db = require("../db");
const { resourceLimits } = require('worker_threads');
const router = express.Router() ; 


router.get('/', async(request,response,next)=>{
    let result = await db.query('SELECT * FROM invoices')
    try{
        return response.json({invoices: result.rows})
    
    }
    
    catch(e){
     return next(e)
    }
    })

    router.get('/:id', async(request,response,next) =>{
        const {id} = request.params
        const checkQuery = await db.query(`SELECT COUNT(*) FROM invoices WHERE id = $1`, [id])
        const rowCount = parseInt(checkQuery.rows[0].count)
        if(rowCount === 0){
            return response.json({"error" : `invoice with id of ${id} does not exist`})
        }

        else{        
            result = await db.query(`SELECT * FROM invoices WHERE id = $1`, [id])
            return response.json({invoice : result.rows})
        }})


        router.post('/', async(request,response,next)=>{
            try{
                const {comp_code,amt} = request.body;
                const result = await db.query(`INSERT INTO invoices(comp_code,amt) VALUES($1, $2) RETURNING *`, 
                [comp_code,amt])
                return response.json({invoice : result.rows})
            }
            catch(e){
                console.log(e)
                return next(e)
            }
            })

        router.patch('/:id', async(request, response, next)=>{
                    const {id} = request.params;
                    const {amt} = request.body;
            
                    const checkQuery = await db.query(`SELECT COUNT(*) FROM invoices where id = $1`, [id])
                    const rowCount = parseInt(checkQuery.rows[0].count)
        
                    if(rowCount === 0){
                        return response.json({"error" : `invoice with id of ${id} does not exist`})
                    }
                    else{
                        const result = await db.query(`UPDATE invoices SET amt=$1 WHERE id = $2  RETURNING *`, [amt,id])
                        return response.json({updated : result.rows})
                    }
                })



                router.delete('/:id', async(request,response,next) => {
                    const {id} = request.params
                    try{
                        const checkQuery = await db.query(`SELECT COUNT(*) FROM invoices WHERE id = $1`, [id])
                        const rowCount = parseInt(checkQuery.rows[0].count)
                
                            if(rowCount === 0){
                                return response.json({"error" : `invoice with id ${id} does not exist`})
                            }
                            else{
                                result = db.query(`DELETE FROM invoices WHERE id = $1`, [id]);
                                return response.send("invoice successfully deleted")
                            }
                
                    }
                
                    catch(e){
                        return next(e)
                    }
                })


module.exports = router