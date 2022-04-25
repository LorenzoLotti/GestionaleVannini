/* eslint-disable no-undef */

document.querySelector('#transfer').onclick = () => // pulsante 'trasferisci'
{
  // TODO: implementare il fetch
}

document.querySelector('#update').onclick = () => // pulsante 'aggiorna'
{
  // TODO: implementare il fetch
}

let orders =
  // questo array è temporaneo, per visualizzare i dati sulla tabella
  [
    {
      name: 'Simone Masi',
      address: 'Via Buongiorno',
      price: 20,
      province: 'FI',
      quantity: 1,
      status: 'non consegnato',
    },
    {
      name: 'Sandrone',
      address: 'Via di casa mia',
      price: 80,
      province: 'FI',
      quantity: 3,
      status: 'non consegnato',
    },
    {
      name: 'Maurizio Chad',
      address: 'Via del Filarete',
      price: 150,
      province: 'FI',
      quantity: 1,
      status: 'non consegnato',
    },
    {
      name: 'Lorenzo Vannini',
      address: 'Via Esempio',
      price: 2050,
      province: 'FI',
      quantity: 10,
      status: 'non consegnato',
    },
    {
      name: 'Simone Masi',
      address: 'Via Buongiorno',
      price: 20,
      province: 'FI',
      quantity: 1,
      status: 'non consegnato',
    },
    {
      name: 'Sandrone',
      address: 'Via di casa mia',
      price: 80,
      province: 'FI',
      quantity: 3,
      status: 'non consegnato',
    },
    {
      name: 'Maurizio Chad',
      address: 'Via del Filarete',
      price: 150,
      province: 'FI',
      quantity: 1,
      status: 'non consegnato',
    },
    {
      name: 'Lorenzo Vannini',
      address: 'Via Esempio',
      price: 2050,
      province: 'FI',
      quantity: 10,
      status: 'non consegnato',
    },
    {
      name: 'Simone Masi',
      address: 'Via Buongiorno',
      price: 20,
      province: 'FI',
      quantity: 1,
      status: 'non consegnato',
    },
    {
      name: 'Sandrone',
      address: 'Via di casa mia',
      price: 80,
      province: 'FI',
      quantity: 3,
      status: 'non consegnato',
    },
    {
      name: 'Maurizio Chad',
      address: 'Via del Filarete',
      price: 150,
      province: 'FI',
      quantity: 1,
      status: 'non consegnato',
    },
    {
      name: 'Lorenzo Vannini',
      address: 'Via Esempio',
      price: 2050,
      province: 'FI',
      quantity: 10,
      status: 'non consegnato',
    },
  ]

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
    { column: 'name', dir: 'asc' },
  ],
  columns: [
    //define the table columns
    { title: 'Nome', field: 'name', sorter: 'string', minWidth: 75 },
    { title: 'Indirizzo', field: 'address', sorter: 'string', minWidth: 75 },
    { title: 'Provincia', field: 'province', sorter: 'string', minWidth: 75 },
    { title: 'Importo', field: 'price', sorter: 'number', minWidth: 75 },
    { title: 'Quantità', field: 'quantity', sorter: 'number', minWidth: 75 },
    { title: 'Stato', field: 'status', sorter: 'string', minWidth: 75 },
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
