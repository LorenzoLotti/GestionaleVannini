import express from 'express'
import bodyParser from 'body-parser'
import WooCommerceAPI from 'woocommerce-api'
import mysql from 'mysql2'

const pool = mysql.createPool({
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

app.get('/update', (req, res) =>
{
  //aggiorna il db con i nuovi prodotti da woocommerce
  wooCommerce.get('products', (wcErr, wcData, wcRes) =>
  {
    if (wcErr)
    {
      res.status(500).send(wcErr)
      return
    }

    wcRes = JSON.parse(wcRes)

    pool.query('DELETE FROM products', (err, results) =>
    {
      if (err)
      {
        res.status(500).send(err)
        return
      }

      const products = []

      for (const product of wcRes)
        products.push({ 'id': product.id })

      insertDB('products', products)

      wooCommerce.get('orders', (wcErr, wcData, wcRes) =>
      {
        if (wcErr)
          res.status(500).send(wcErr)
        else
        {
          wcRes = JSON.parse(wcRes)

          pool.query('SELECT * FROM orders', (err, results) =>
          {
            if (err)
              res.status(500).send(err)
            else
            {
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

                for (const item of order.line_items)
                {
                  console.log(item)
                  orderObject.items += `${item.product_id}:${item.quantity},`
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
  })
})

app.get('/orders', (req, res) => // fetcha il db e lo restituisce
{
  pool.query('SELECT * FROM orders', (err, results) =>
  {
    if (err)
      res.status(500).send(err)
    else
      res.send(results).end()
  })
})

app.post('/transfer', (req, res) =>
{
  console.log(process.version)
  let id
  let errorOccurred = false
  let finalObj = ''

  const routine = r =>
  {
    if (r) finalObj += r + ','

    if (req.body.length == 0)
    {
      finalObj = JSON.parse('[' + finalObj.slice(0, -1) + ']')

      if (errorOccurred)
        res.status(500).send(finalObj)
      else
        res.send(finalObj).end()

      return
    }

    id = req.body.pop()
    const rows = []

    pool.query(`UPDATE orders SET status = 'true' WHERE id = ${id}`, (err, results) =>
    {
      if (err)
      {
        res.status(500).send(err)
        return
      }

      pool.query(`SELECT * FROM orders WHERE id = ${id}`, (err, results) =>
      {
        if (err)
        {
          res.status(500).send(err)
          return
        }

        const order = results[0]
        const items = order.items.split(',')

        for (const item of items)
          rows.push(makeRow(...item.split(':')))

        fetch('https://schoollab2022.extraerp.it/erpapi/com/albalog/erp/DO/WAManager.xml/WADocumento/import',
        {
          method: 'POST',
          body: makeDocument(id, rows),
          headers:
          {
            'Accept': 'application/xml',
            'Content-Type': 'application/xml',
            'Authorization': 'Basic RDBERjA0RTYtQjJCOC00MzVBLUEwMUYtQ0Q2NTM3OTk0NzA4Og=='
          }
        })
        .catch(() =>
        {
          errorOccurred = true
          routine(JSON.stringify({ id: id, error: true }))
        })
        .then(r => r.text())
        .then(v => routine(JSON.stringify({ id: id, error: false, xml: v })))
      })
    })
  }

  routine(null)
})

function insertDB(tableName, array)
{
  let query = 'INSERT INTO ' + tableName + '('

  array.forEach(element =>
  {

    for (const k in element)
    {
      query += k + ','
    }

    query = query.slice(0, -1)
    query += ') VALUES ('

    for (const k in element)
    {
      query += '\'' + element[k] + '\'' + ','
    }

    query = query.slice(0, -1)
    query += ');'

    pool.query(query, function (err, rows, fields)
    {
      if (err) throw err
    })

    query = 'INSERT INTO ' + tableName + '('
  })
}

function makeDocument(id, rows)
{
  return /*xml*/ `
    <parameters>
      <data>
        <IDCollection>
          <WADocumento
            IDTipologiaDocumento_Codice="ORDC"
            NumeroDocumento="${id}"
            IDAnagraficaRiferimento_Codice="1"
          >${rows.join()}</WADocumento>
        </IDCollection>
      </data>
    </parameters>
  `
}

function makeRow(id, quantity)
{
  return /*xml*/ `
    <WARigaDocumento
      IDTipoRigaDocumento_Codice="ME"
      Quantita="${quantity}"
      QuantitaEvasa="0"
      IDArticolo_Codice="${id}"
    />
  `
}

app.listen(8080)
