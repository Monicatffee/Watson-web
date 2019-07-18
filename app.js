const AssistantV1 = require('watson-developer-cloud/assistant/v1');
const OpenWeatherMapHelper = require("openweathermap-node");
const express = require('express');
const bodyParser = require('body-parser');
const postG = require('./database.js');

const app = express();

//Conexion con openweathermap-node
const helper = new OpenWeatherMapHelper(
  {
      APPID: '94579102f6fced10f7f9de7bd21b0efc',
  }
);


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

  service.message(params, async (err, response) => {
    //client.connect();
    let intencion = response.intents[0].intent;
    if(intencion.indexOf('undefined') != -1){
      //console.log('Error', err);
    }else{
      console.log('intent',response.intents[0].intent);
      
      if (err) {
        console.error(err);
        res.status(500).json(err);
      } else if(intencion.indexOf('Creditos') != -1){
        let consulta = await postG.queryDB('monto', 'nombre', "'credito'");
        console.log('consulta desde app ', consulta);
        response.output.text = response.output.text + consulta;
        console.log(' Respuesta '+ response.output.text );
        res.json(response);
        //console.log('Buscar intenttt: ',JSON.stringify(response, null, 2));
      }else if(intencion.indexOf('Clima') != -1){
        console.log('response', response.entities[0].value);
        let entidad = (response.entities[0].value).toLowerCase() ;
        console.log('entidad', entidad);
        helper.getCurrentWeatherByCityName(entidad, (err, currentWeather) => {
          if(err){
              console.log(err);
          }
          else{
              response.output.text = response.output.text+currentWeather.weather[0].description;
              res.json(response); 
          }
      });

      }else{
        res.json(response);
      }
        
    }

  });
});
//console.log('Buscar intent: ',res);
app.listen(port, () => console.log(`Running on port ${port}`));