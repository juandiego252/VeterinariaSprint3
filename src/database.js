//importar mongoose
import mongoose from 'mongoose'

//permitir que solo los campos definidos del esquema sean almacenados en la base de datos 
mongoose.set('strictQuery', true)


//crear una funcion llamada connection()
const connection = async()=>{
    try {
        //establecer la conexion con la base de datos
        const {connection} = await mongoose.connect(process.env.MONGODB_URI)
        //presentar la conexion en consola
        console.log(`Database is connected on ${connection.host} - ${connection.port}`)
    } catch (error) {
        //capturar error en la conexion de la BDD
        console.log(error);
    }
}
//exportar la funcion
export default connection