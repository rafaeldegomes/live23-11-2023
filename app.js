const express = require('express')
const app = express() 
const port = 5225;

app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));

const mysql = require('mysql2');
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'verdeescola'
});

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
  });

  app.post('/cadastrar-usuario', (req, res) => {
    const nome = req.body.nome;
    const email = req.body.email;
    
   
    connection.query('INSERT INTO leads (nome, email) VALUES (? , ?)', [nome , email], (err, results) => {
        if (err) {
          console.error('Erro ao inserir dados no banco de dados: ' + err);
          return;
        }
    
        console.log('Dados inseridos com sucesso!');
        res.redirect('/');
      });

});

app.get('/listagem', (req, res) => {
    connection.query('SELECT * FROM leads', (err, results) => {
      if (err) {
        console.error('Erro ao buscar dados do banco de dados: ' + err);
        return;
      }
  
      res.render('listagem', { leads: results }); // Renderiza a página com os dados
    });
  });

  // Rota para excluir usuário
app.get('/excluir/:id', (req, res) => {
    const userId = req.params.id;
  
    connection.query('DELETE FROM leads WHERE id_lead = ?', [userId], (err, results) => {
        if (err) {
            console.error('Erro ao excluir usuário: ' + err);
            return;
        }
  
        console.log('Usuário excluído com sucesso!');
        res.redirect('/');
    });
  });
  
app.listen(port, () => {
    console.log(`http://localhost:${port}`);
})