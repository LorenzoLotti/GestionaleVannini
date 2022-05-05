import express from 'express'
import bodyParser from 'body-parser'
import WooCommerceAPI from 'woocommerce-api'
import mysql from 'mysql2'

var pool  = mysql.createPool({
  connectionLimit : 10,
  host            : '172.17.0.2',
  user            : 'root',
  password        : '1234',
  database        : 'gestionale'
})

const app = express()

app.use(bodyParser.json())
app.use(express.static('client'))

const wooCommerce = new WooCommerceAPI({
  url: 'https://www.lorenzovanninicartoon.it',
  consumerKey: 'ck_5e3935dba51f97aac57b66c54114d0533d05b2b4',
  consumerSecret: 'cs_b0917917251f05026baec7dabb70df199b84dcad',
  wpAPI: true,
  version: 'wc/v3',
})

app.get('/orders', (req, res) =>
{
  console.log(req.query)
  wooCommerce.get('orders', (wcErr, wcData, wcRes) =>
  {
    if (wcErr)
      res.status(500).send(wcErr)
    else
      res.send(wcRes).end()
  })
})

app.post('/saveOrders', (req, res) =>
{
  var query = "INSERT INTO product("

  req.body.forEach(element => {

    for(var k in element)
    {
      query += k + ","  
    }

    query = query.slice(0, -1)
    query += ") VALUES ("

    for(var k in element)
    {
      query += "'" + element[k] + "'" + ","
    }
    query = query.slice(0, -1)
    query += ");"

    pool.query(query, function(err, rows, fields){
      if(err) throw err;
    });

    query = "INSERT INTO product("
  });

  res.end()

  getAllData()
})

function getAllData()
{
    var query = "SELECT * FROM product"

    pool.query(query, function(err, rows, fields)
    {
      if(err) throw err;
    
        for(var i = 0; i < rows.length; i++)
        {
          console.log(rows[i])
        }
    });
}

app.listen(8080)
