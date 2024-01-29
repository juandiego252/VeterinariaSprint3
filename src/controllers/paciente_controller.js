//IMPORTAR EL MODELO
import Paciente from "../models/Paciente.js"
import { sendMailToPaciente, sendMailToRecoveryPassword } from "../config/nodemailer.js"
import generarJWT from "../helpers/crearJWT.js"
import mongoose from "mongoose"
import Tratamiento from "../models/Tratamiento.js"

//Metodo para el proceso del login
const loginPaciente = async(req,res)=>{
    const {email,password} = req.body
    if (Object.values(req.body).includes("")) return res.status(404).json({msg:"Lo sentimos, debes llenar todos los campos"})
    const pacienteBDD = await Paciente.findOne({email})
    if(!pacienteBDD) return res.status(404).json({msg:"Lo sentimos, el usuario no se encuentra registrado"})
    const verificarPassword = await pacienteBDD.matchPassword(password)
    if(!verificarPassword) return res.status(404).json({msg:"Lo sentimos, el password no es el correcto"})
    const token = generarJWT(pacienteBDD._id,"paciente")
	const {nombre,propietario,email:emailP,celular,convencional,_id} = pacienteBDD
    res.status(200).json({
        token,
        nombre,
        propietario,
        emailP,
        celular,
        convencional,
        _id
    })
}
//Metodo para ver el perfil 
const perfilPaciente =(req,res)=>{
    delete req.pacienteBDD.ingreso
    delete req.pacienteBDD.sintomas
    delete req.pacienteBDD.salida
    delete req.pacienteBDD.estado
    delete req.pacienteBDD.veterinario
    delete req.pacienteBDD.createdAt
    delete req.pacienteBDD.updatedAt
    delete req.pacienteBDD.__v
    res.status(200).json(req.pacienteBDD)
}
//Metodo para listar todos los pacientes
const listarPacientes = async (req,res)=>{
    //Obterner todos los pacientes que se encuentren activos
    //Que sean solo los paciente que inicie sesion
    //Quitar campos no necesarios 
    //Mostrar campos de documentos relacionados
    const pacientes = await Paciente.find({estado:true}).where('veterinario').equals(req.veterinarioBDD).select("-salida -createdAt -updatedAt -__v").populate('veterinario','_id nombre apellido')
    
    res.status(200).json(pacientes)
}
//Metodo para ver el detalle de un paciente en particular
const detallePaciente = async(req,res)=>{
    const {id} = req.params
    if( !mongoose.Types.ObjectId.isValid(id) ) return res.status(404).json({msg:`Lo sentimos, no existe el veterinario ${id}`});
    const paciente = await Paciente.findById(id).select("-createdAt -updatedAt -__v").populate('veterinario','_id nombre apellido')
    const tratamientos = await Tratamiento.find({estado:true}).where('paciente').equals(id)
    res.status(200).json({
        paciente,
        tratamientos
    })
}
//Metodo para registrar un paciente
const registrarPaciente = async(req,res)=>{
    //DESESTRUCTURAR EL EMAIL 
    const {email} = req.body
    //VALIDAR TODOS LOS CAMPOS
    if (Object.values(req.body).includes("")) return res.status(400).json({msg:"Lo sentimos, debes llenar todos los campos"})
    //OBTENER EL USUARIO EN BASE AL EMAIL
    const verificarEmailBDD = await Paciente.findOne({email})
    //VERIFICAR SI EL PACIENTE YA SE ENCUENTRA REGISTRADO
    if(verificarEmailBDD) return res.status(400).json({msg:"Lo sentimos, el email ya se encuentra registrado"})
    //CREAR UNA UNSTANCIA DEL PACIENTE 
    const nuevoPaciente = new Paciente(req.body)
    //CREAR UN PASSWORD 
    const password = Math.random().toString(36).slice(2)
    //ENCRIPTAR EL PASSWORD
    nuevoPaciente.password = await nuevoPaciente.encrypPassword("vet"+password)
    //ENVIAR EL CORREO ELECTRONICO
    await sendMailToPaciente(email,"vet"+password)
    //ASOCIAR EL PACIENTE CON EL VETERINARIO
    nuevoPaciente.veterinario=req.veterinarioBDD._id
    //GUARDAR EN BASE DE DATOS
    await nuevoPaciente.save()
    //PRESENTAR RESULTADOS
    res.status(200).json({msg:"Registro exitoso del paciente y correo enviado"})
}
//Metodo para actualizar un paciente
const actualizarPaciente = async(req,res)=>{
    const {id} = req.params
    if (Object.values(req.body).includes("")) return res.status(400).json({msg:"Lo sentimos, debes llenar todos los campos"})
    if( !mongoose.Types.ObjectId.isValid(id) ) return res.status(404).json({msg:`Lo sentimos, no existe el veterinario ${id}`});
    await Paciente.findByIdAndUpdate(req.params.id,req.body)
    res.status(200).json({msg:"Actualización exitosa del paciente"})
}
//Metodo para eliminar un paciente

const eliminarPaciente = async (req,res)=>{
    const {id} = req.params
    if (Object.values(req.body).includes("")) return res.status(400).json({msg:"Lo sentimos, debes llenar todos los campos"})
    if( !mongoose.Types.ObjectId.isValid(id) ) return res.status(404).json({msg:`Lo sentimos, no existe el veterinario ${id}`})
    const {salida} = req.body
    await Paciente.findByIdAndUpdate(req.params.id,{salida:Date.parse(salida),estado:false})
    res.status(200).json({msg:"Fecha de salida del paciente registrado exitosamente"})
}

export {

	loginPaciente,
	perfilPaciente, 
    listarPacientes,
    detallePaciente,
    registrarPaciente,
    actualizarPaciente,
    eliminarPaciente
}