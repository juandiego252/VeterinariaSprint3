//importar la funcion connection
import connection from './database.js';
//importar la variable app
import app from './server.js'

connection()

//iniciar el servidor en el puerto 3000
app.listen(app.get('port'),()=>{
    console.log(`Server ok on http://localhost:${app.get('port')}`);
})