const fdk=require('@fnproject/fdk');
const { Pool } = require('pg')

fdk.handle(async function(input, ctx){
  let hctx = ctx.httpGateway //Obtención y procesamiento de la URL
  const url=new URL(hctx.requestURL)
  const urlParams = new URLSearchParams(url.search);
  if (!urlParams.has("id")) return{"error": "No se ha suministrado un identificador"} //Comprobación de existencia de parametro
  const identificador=urlParams.get('id') //Asignación de valor a una variable
  if (isNaN(identificador) || isNaN(parseFloat(identificador))) return {"error": "Identificador suministrado no es numérico"} //Comprobación de validez del número
  const pool = new Pool({
    user: ctx.config.DB_USER,
    host: ctx.config.DB_HOST,
    database: ctx.config.DB_NAME,
    password: ctx.config.DB_PASSWORD,
    port: ctx.config.DB_PORT,
  })   //Conexión a la base de datos
  const res= await pool.query(`select ${ctx.config.STOCK_COLUMN} as stock from ${ctx.config.STOCK_TABLE} where id=${identificador};`) //Realización de consulta (asincrona)
  pool.end()
  return res.rowCount!==1? {"stock":0} : {"stock":res.rows[0].stock} // si la cantidad de filas recibidas es diferente a uno, se retorna stock 0. En caso contrario, se devuelve 1.
})
