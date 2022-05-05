import express from 'express'
import bodyParser from 'body-parser'
import WooCommerceAPI from 'woocommerce-api'

var mysql = require('mysql')
var pool  = mysql.createPool({
  connectionLimit : 10,
  host            : '172.17.0.1',
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
  console.log(req.body)
  req.body.forEach(element => {
    for(var k in element)
    {
      console.log('chiave', k,'valore', element[k])
    }
  })

  res.end()
})

app.listen(8080)
