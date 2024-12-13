import express from 'express'
import dotenv from 'dotenv'
import ConnectDB from './config/db.js';
import postRoute from './route/postRoute.js'
import userRoute from './route/userRoute.js'
import barangRoute from './route/barangRoute.js'
import transaksiRoute from './route/transaksiRoute.js'
import { loginUser } from './controllers/userController.js';

dotenv.config()

const app = express();
app.use(express.json());


//route
app.use('/api/v1', postRoute)
app.use('/api/user', userRoute)
app.use('/api/barang', barangRoute)
app.use('/api/transaksi', transaksiRoute)
app.use('/api/user',loginUser)


//connect database
ConnectDB();

//port
const port = process.env.port

//server
app.listen(port, () => {
    console.log(`server berjalan di http://localhost:${port}`)
})