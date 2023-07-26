import { Router } from "express";
import UserModel from "../dao/models/user.model.js";
import { createHash, isValidPassword } from "../utils.js";


const router = Router()


// Vista de Login
router.get('/', (req, res) => {
    res.render('sessions/login')
})

//API para login
router.post('/login', async (req, res) => {
    const { email, password } = req.body

    const user = await UserModel.findOne({ email }).lean().exec()
    
    if (!user && (email !== 'adminCoder@coder.com' || password !== 'adminCod3r123')) {

        return res.status(401).render('errors/base', {
            error: 'Error en email y/o contraseña'
        })

    }
    if (email !== 'adminCoder@coder.com' || password !== 'adminCod3r123') {
        if (!isValidPassword(user, password)) {
            return res.status(401).render('errors/base', {
                error: 'Error en email y/o contraseña'
            })
        }

    }

    if (email !== 'adminCoder@coder.com') {
        req.session.user = user
    } else {
        req.session.user = {
            // _id: '64bbf76d05d10820794daa20',
            first_name: 'Admin',
            // last_name: 'Crosa',
            // email: 'damiancrosa@hotmail.com',
            // age: 45,
            // password: 'secreto',
            // __v: 0,
            role: 'Admin'
        }
    }
    res.redirect('/views/products/')

})

//Vista para registrar usuarios
router.get('/register', (req, res) => {
    res.render('sessions/register')
})

// API para crear usuarios en la DB
router.post('/register', async (req, res) => {
    // const userNew = req.body
    const userNew = {
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        age: req.body.age,
        email: req.body.email,
        password: createHash(req.body.password)

    }

    const user = new UserModel(userNew)
    await user.save()
    res.redirect('/login')

})



// Cerrar Session
router.get('/logout', (req, res) => {
    req.session.destroy(err => {
        if (err) {
            console.log(err);
            res.status(500).render('errors/base', { error: err })
        } else res.redirect('/')
    })

})



export default router