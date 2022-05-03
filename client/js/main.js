/* eslint-disable no-undef */
let orders = []

document.onload = await updateTable()

document.querySelector('#transfer').onclick = () => // pulsante 'trasferisci'
{
  // TODO: implementare il fetch
}

document.querySelector('#update').onclick = updateTable

// questa costante contiene la configurazione della tabella (docs: http://tabulator.info/docs/5.2)

const ordersTable = new Tabulator('#orders-table', {
  data: orders, //load row data from array
  layout: 'fitColumns', //fit columns to width of table
  responsiveLayout: 'hide', //hide columns that dont fit on the table
  addRowPos: 'top', //when adding a new row, add it to the top of the table
  history: true, //allow undo and redo actions on the table
  pagination: 'local', //paginate the data
  paginationSize: 10, //allow 100 rows per page of data
  paginationCounter: 'rows', //display count of paginated rows in footer
  movableColumns: true, //allow column order to be changed
  placeholder: 'Nessun dato',
  height: '100%',
  initialSort: [
    //set the initial sort order of the data
    { column: 'id', dir: 'asc' },
  ],
  columns: [
    //define the table columns
    { title: 'ID', field: 'id', sorter: 'number' },
    { title: 'Nome', field: 'name', sorter: 'string' },
    { title: 'Indirizzo', field: 'address', sorter: 'string' },
    { title: 'Provincia', field: 'province', sorter: 'string' },
    { title: 'Importo', field: 'price', sorter: 'number' },
    { title: 'Quantità', field: 'quantity', sorter: 'number' },
    { title: 'Stato', field: 'status', sorter: 'string' },
  ],
})

const filters = document.querySelectorAll('#filters [data-filtering]')

document.querySelector('#filters [type="reset"]').onclick = () =>
{
  ordersTable.clearFilter()
  ordersTable.redraw(true)
}

for (const filter of filters)
{
  const field = filter.getAttribute('data-filtering')
  const type = filter.getAttribute('data-ftype')

  filter.oninput = () =>
  {
    const tableFilters = ordersTable.getFilters()

    for (const tableFilter of tableFilters)
      if (tableFilter.field == field)
        ordersTable.removeFilter(field, tableFilter.type, tableFilter.value)

    if (filter.value != '' || type != '=')
      ordersTable.addFilter(field, type, filter.value)

    ordersTable.redraw(true)
  }
}

async function updateTable()
{
  orders = []
  fetch('https://www.lorenzovanninicartoon.it/wp-json/wc/v3/orders?consumer_key=ck_5e3935dba51f97aac57b66c54114d0533d05b2b4&consumer_secret=cs_b0917917251f05026baec7dabb70df199b84dcad')
    .then(response => response.json()).then(data =>
    {
      for (const order of data)
      {
        orders.push({
          id: order.id,
          name: `${order.billing.first_name} ${order.billing.last_name}`,
          address: order.billing.address_1,
          province: order.billing.state,
          price: `${order.total} €`,
          quantity: order.line_items.length,
          status: order.status,
        })
      }

      ordersTable.setData(orders)
    })
}
