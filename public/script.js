const textInput = window.document.getElementById('textInput');
const chat = window.document.getElementById('chat');

let context = {};

//Generará la plantilla de cada mensaje, recibire dos parámetros, el contenido del mensaje y el autor.
const templateChatMessage = (message, from) => `
  <div class="from-${from}">
    <div class="message-inner">
      <p>${message}</p>
    </div>
  </div>
  `;

//Función que inserta la plantilla del mensaje dentro del chat.
const InsertTemplateInTheChat = (template) => {
  const div = window.document.createElement('div');
  div.innerHTML = template;

  chat.appendChild(div);
};

//Función que llamará a la API y recogerá la respuesta de Watson.
const getWatsonMessageAndInsertTemplate = async (text = '') => {
const uri = 'http://localhost:3000/conversation/';

const response = await (await fetch(uri, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      text,
      context
    }),
  })).json();

  context = response.context;
  

  const template = templateChatMessage(response.output.text, 'watson');

  InsertTemplateInTheChat(template);
};

//Se crear un listener para los cambios de texto dentro del input y, cuando el usuario presione la tecla ENTER
textInput.addEventListener('keydown', (event) => {
  if (event.keyCode === 13 && textInput.value) {
    getWatsonMessageAndInsertTemplate(textInput.value);

    const template = templateChatMessage(textInput.value, 'user');
    InsertTemplateInTheChat(template);
    
    textInput.value = '';
  }
});

getWatsonMessageAndInsertTemplate();