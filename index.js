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


app.get('/update', (req, res) => {
  // aggiorna il db con i nuovi prodotti da woocommerce
  // wooCommerce.get('products', (wcErr, wcData, wcRes) =>
  // {
  //   if (wcErr)
  //   {
  //     res.status(500).send(wcErr)
  //     return
  //   }

  //   wcRes = JSON.parse(wcRes)
  //   console.log(wcRes)
  //   pool.query('DELETE FROM products', (err, results) =>
  //   {
  //     if (err)
  //     {
  //       res.status(500).send(err)
  //       return
  //     }

  //   })
  // })

  // aggiorna il db con i nuovi ordini da woocommerce e ritorna il prodotto finale
  wooCommerce.get('orders', (wcErr, wcData, wcRes) => {
    if (wcErr)
      res.status(500).send(wcErr)
    else {
      wcRes = JSON.parse(wcRes)

      pool.query('SELECT * FROM orders', (err, results) => {
        if (err)
          res.status(500).send(err)
        else {
          const orders = []
          const ids = []

          for (const order of results)
            ids.push(order.id)

          for (const order of wcRes)
          {
            if (ids.includes(order.id))
              continue

            const orderObject = {
              id: order.id,
              name: `${order.billing.first_name} ${order.billing.last_name}`,
              address: order.billing.address_1,
              province: order.billing.state,
              country: order.billing.country,
              price: `${order.total}`,
              quantity: order.line_items.length,
              status: false,
              items: ''
            }

            for (const item of order.line_items) {
              orderObject.items += item.id + ','
            }

            orderObject.items = orderObject.items.slice(0, -1)
            orders.push(orderObject)
          }

          if (orders.length == 0)
          {
            res.send(results).end()
            return
          }

          insertDB('orders', orders)
          res.send([...results, ...orders]).end()
        }
      })
    }
  })
})

app.get('/orders', (req, res) => // fetcha il db e lo restituisce
{
  pool.query('SELECT * FROM orders', (err, results) => {
    if (err)
      res.status(500).send(err)
    else
      res.send(results).end()
  })
})

app.post('/transfer', (req, res) => {
    for (const id of req.body)
    {
      pool.query(`UPDATE orders SET status = 'true' WHERE id = ${id}`)
    }
})

function insertDB(tableName, array)
{
  let query = "INSERT INTO " + tableName + "("

  array.forEach(element => {

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

    query = "INSERT INTO " + tableName + "("
  });
}

app.listen(8080)
