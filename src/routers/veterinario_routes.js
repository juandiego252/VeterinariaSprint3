//importar Router de express
import {Router} from 'express'
import verificarAutenticacion from '../middlewares/autenticacion.js';
import { validacionVeterinario } from '../middlewares/validacionVeterinario.js';

//crear una instancia de Router()
const router = Router()

//importar los metodos del controlador
import {
    login,
    perfil,
    registro,
    confirmEmail,
    listarVeterinarios,
    detalleVeterinario,
    actualizarPerfil,
    actualizarPassword,
    recuperarPassword,
    comprobarTokenPasword,
    nuevoPassword,
} from "../controllers/veterinario_controller.js";


//DEFINIR LAS RUTAS

//rutas publicas
router.post("/login", login);
router.post("/registro",validacionVeterinario, registro);
router.get("/confirmar/:token", confirmEmail);
router.get("/veterinarios", listarVeterinarios);
router.get("/recuperar-password", recuperarPassword);
router.get("/recuperar-password/:token", comprobarTokenPasword);
router.post("/nuevo-password/:token", nuevoPassword);


//Rutas privadas
router.get("/perfil",verificarAutenticacion, perfil);
router.put('/veterinario/actualizarpassword',verificarAutenticacion, actualizarPassword)
router.get("/veterinario/:id",verificarAutenticacion, detalleVeterinario);
router.put("/veterinario/:id",verificarAutenticacion, actualizarPerfil);



//exportar la variable router
export default router