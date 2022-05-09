import express from 'express'
import bodyParser from 'body-parser'
import WooCommerceAPI from 'woocommerce-api'
import mysql from 'mysql2'

var pool = mysql.createPool({
  connectionLimit: 10,
  host: '172.17.0.1',
  user: 'root',
  password: '1234',
  database: 'gestionale'
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

app.get('/ordersDB', (req, res) => {
  pool.query('SELECT * FROM product', (err, results) =>
  {
    if (err)
      res.status(500).send(err)
    else
      res.status(200).send(results)
  })
})

app.get('/orders', (req, res) => {
  wooCommerce.get('orders', (wcErr, wcData, wcRes) => {
    if (wcErr)
      res.status(500).send(wcErr)
    else
      console.log(wcRes)
    res.send(wcRes).end()
  })
})

app.post('/saveOrders', (req, res) => {
  var query = "INSERT INTO product("

  req.body.forEach(element => {

    for (var k in element) {
      query += k + ","
    }

    query = query.slice(0, -1)
    query += ") VALUES ("

    for (var k in element) {
      query += "'" + element[k] + "'" + ","
    }
    query = query.slice(0, -1)
    query += ");"

    pool.query(query, function (err, rows, fields) {
      if (err) throw err;
    });

    query = "INSERT INTO product("
  });

  res.end()

  //getAllData()
})


/*
async function updateTableFromWooCommerce()
{
  orders = []
  fetch('/orders')
    .then(response => response.json()).then(data =>
    {
      for (const order of data)
      {
        orders.push({
          id: order.id,
          name: `${order.billing.first_name} ${order.billing.last_name}`,
          address: order.billing.address_1,
          province: order.billing.state,
          price: `${order.total}`,
          quantity: order.line_items.length,
          status: order.status.replace('on-hold', 'non consegnato'),
        })
      }
      ordersTable.setData(orders)
    })
}
*/

app.listen(8080)
