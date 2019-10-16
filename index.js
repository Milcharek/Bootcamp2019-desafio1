const express = require('express');

const server = express();

server.use(express.json());

const projects = [];

server.use((req, res, next) => {
  console.time('Request');
  console.log(`Método: ${ req.method }; URL: ${ req.url }`);

  next();
  console.timeEnd('Request');
});

//Função que verifica se o projeto existe;
function checkProjectExists(req, res, next) {
  const { id } = req.params;
  const project = projects.find(p => p.id == id);
  if (!project){
    return res.status(400).json({ error: 'Project does not exist' });
  }
  return next();
}

/*
Rota que recebe id e title de dentro do body da requisição e cria um novo
project com um array vazio de tasks;
*/
server.post('/projects', (req, res) => {

  const { id, title } = req.body;
  const task = [];
  
  projects.push({ id, title, task });

  return res.json(projects);
})


//Rota que lista todos projects e suas tasks;
server.get('/projects', (req, res) => {
  return res.json(projects);
});

/*
Rota que altera o título do project de acordo com o id passado 
nos parâmetros da rota
*/
server.put('/projects/:id', checkProjectExists, (req, res) => {
  const { id } = req.params;
  const { title } = req.body;
  
  const projectIndex = projects.findIndex(p => p.id == id);

  projects[projectIndex].title = title;

  return res.json(projects);
});

//Rota que deleta um project de acordo com o id passado nos parâmetros da rota
server.delete('/projects/:id', checkProjectExists, (req, res) => {
  const { id } = req.params;
  const projectIndex = projects.findIndex(p => p.id == id);
  
  projects.splice(projectIndex, 1);

  return res.json(projects);

});
/*
Rota que recebe um campo title e armazena uma nova task no array de tasks 
de um project específico escolhido através do id presente nos parâmetros da rota;
*/
server.post('/projects/:id/tasks', checkProjectExists, (req, res) => {
  const { id } = req.params;
  const { title } = req.body;

  const project = projects.find(p => p.id == id);
  
  project.task.push(title);

  return res.json(projects);
})

server.listen(3000);