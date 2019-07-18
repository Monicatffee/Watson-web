const { Client } = require('pg');

const connectionData = {
    user: 'postgres',
    host: 'localhost',
    database: 'db_watson',
    password: 'admin',
    port: 5433,//5432
  }
const client = new Client(connectionData);

module.exports.queryDB = async function(colum, field, text){
  console.log('Ye en la DB' + colum+ field+text);

  let consulta;
  client.connect();
    console.log(`SELECT ${colum} FROM public.precios where ${field} = ${text}`);
    await client.query(`SELECT ${colum} FROM public.precios where ${field} = ${text}`)
    .then(cons=> {
        console.log('Entro a consulta ',cons.rows);
        console.log('colum ',colum);
        consulta = cons.rows[0].monto;
        console.log('consulta '+ consulta);
        client.end();
        //console.log('Buscar response: ',JSON.stringify(response, null, 2)); 
      })
      .catch(err => {
        console.log('Error', err);
        client.end()
      });

      return consulta;
}
    
    


