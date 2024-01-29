//importar express
//ESMODULES
import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors';
//importar la variable routerVeterinarios
import routerVeterinarios from './routers/veterinario_routes.js'
//importar la variable routerPacientes
import routerPacientes from './routers/paciente_routes.js'
//importamos 
import routerTratamietos from './routers/tratameinto_routes.js'


// Inicializaciones
//crear una instancia de express
const app = express()
dotenv.config()

// Configuraciones 
app.set('port',process.env.port || 3000)
app.use(cors())

// Middlewares 
app.use(express.json())


// Variables globales


// Rutas 
app.use('/api',routerVeterinarios)
app.use('/api', routerPacientes)
app.use('/api',routerTratamietos)

// Manejo de una ruta que no sea encontrada
app.use((req,res)=>res.status(404).send("Endpoint no encontrado - 404"))


// Exportar la instancia de express por medio de app
export default  app