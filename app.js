const AssistantV1 = require('watson-developer-cloud/assistant/v1');
const express = require('express');
const bodyParser = require('body-parser');
const { Client } = require('pg');

const app = express();

const connectionData = {
  user: 'postgres',
  host: 'localhost',
  database: 'db_watson',
  password: 'admin',
  port: 5433,//5432
}

const client = new Client(connectionData)
client.connect();

app.use(bodyParser.json());
app.use(express.static('./public'));//Le informamos a express donde estara el contenido estatico

const port = 3000;

const service = new AssistantV1({
  version: '2019-02-28',
  iam_apikey: 'P0a_OqwdOH3xeGA-EOFly5seIi_bEqxuUCrlmDplP0tx',
  url: 'https://gateway.watsonplatform.net/assistant/api'
});

app.post('/conversation/', (req, res) => {
  const { text, context = {} } = req.body;

  const params = {
    input: { text },
    workspace_id:'e18b8afc-d005-4a97-9ad8-3c49cde42ca8',
    context,
  };

  service.message(params, (err, response) => {
    console.log('aca',response.intents)
    let intencion = response.intents[0].intent;
    
    if (err) {
      console.error(err);
      res.status(500).json(err);
    } else if(intencion.indexOf('Creditos') != -1){
      console.log('entroooooo');
      client.query('SELECT monto FROM precios where nombre = "credito"').then( res => console.log(res.rows));
      console.log('consulta ', client.query('SELECT monto FROM precios where nombre = "credito"').then( res => console.log(res.rows)));
      // client.query('SELECT monto FROM public.precios where nombre = "credito"')
      //     .then(response => {
      //       console.log('despues ',response.output.text);
      //       res.json(response.output.text + response.rows);
      //       console.log("desde DB",response.rows)
      //       client.end()
      //     })
      //     .catch(err => {
      //         client.end()
      //     })
      
      

      
      
      //console.log('Buscar intenttt: ',JSON.stringify(response, null, 2));
    }else{
      res.json(response);
    }
      
    
    
  });
  
});
//console.log('Buscar intent: ',res);
app.listen(port, () => console.log(`Running on port ${port}`));