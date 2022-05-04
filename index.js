import express from 'express'
import WooCommerceAPI from 'woocommerce-api'

const app = express()
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
  wooCommerce.get('orders', (wcErr, wcData, wcRes) =>
  {
    if (wcErr)
      res.status(500).send(wcErr)
    else
      res.send(wcRes).end()
  })
})

app.listen(8080)
