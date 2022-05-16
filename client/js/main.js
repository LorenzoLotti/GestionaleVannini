/* eslint-disable no-undef */
let orders = []
let selectedOrders = []
const messageModal = new bootstrap.Modal(document.querySelector('#message'))
const messageBody = document.querySelector('#message .modal-body')

document.querySelector('#transfer').onclick = () => // pulsante 'trasferisci'
{
  if (selectedOrders.length == 0)
  {
    messageBody.textContent = 'Nessun ordine selezionato'
    messageModal.show()
    return
  }

  fetch('/transfer', {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(selectedOrders)
  }).then(() => location.reload())
}

document.querySelector('#update').onclick = updateTableFromDB

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
    { column: 'status', dir: 'asc' },
  ],
  columns: [
    //define the table columns
    { title: 'ID', field: 'id', sorter: 'number', width: 80 },
    { title: 'Nome', field: 'name', sorter: 'string' },
    { title: 'Nazione', field: 'country', sorter: 'string', width: 120 },
    { title: 'Provincia', field: 'province', sorter: 'string', width: 150 },
    { title: 'Indirizzo', field: 'address', sorter: 'string' },
    { title: 'Importo', field: 'price', sorter: 'number', width: 150 },
    { title: 'Quantità', field: 'quantity', sorter: 'number', width: 120 },
    { title: 'Stato', field: 'status', sorter: 'boolean', width: 100, formatter: 'tickCross' }
  ],
})

ordersTable.on('tableBuilt', () =>
{
  fetch('/orders').then(response => response.json()).then(data =>
  {
    orders = data
    ordersTable.setData(orders)
  })
})

ordersTable.on('cellClick', (e, cell) =>
{
  if (cell.getColumn().getField() === 'status' && (cell.getValue() == 'false'))
  {
    cell.setValue(true)
    selectedOrders.push(cell.getRow().getData().id)
  }
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

let updating = false

async function updateTableFromDB()
{
  if (updating)
    return

  updating = true
  orders = []
  fetch('/update')
    .then(response => response.json()).then(data =>
    {
      orders = data
      ordersTable.setData(orders)
      updating = false
      location.reload()
    })
}
