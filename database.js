const { Client } = require('pg');

const connectionData = {
    user: '',
    host: '',
    database: '',
    password: '',
    port: 5433,//5432
  }
  const client = new Client(connectionData)

client.connect()
client.query('SELECT * FROM table')
    .then(response => {
        console.log(response.rows)
        client.end()
    })
    .catch(err => {
        client.end()
    })