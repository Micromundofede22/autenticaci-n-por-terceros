import { Router } from "express";
import passport from "passport";

const router = Router()

//Vista para registrar usuarios
router.get('/register', (req, res) => {
    res.render('sessions/register')
})

// API para crear usuarios en la DB
router.post('/register', passport.authenticate('registerPass', {
    failureRedirect: '/session/failRegister' //si no registra, que redirija a fail 
}), async(req, res) => {
    res.redirect('/session/login') //si registra, redirije al loguin
})

router.get('/failRegister', (req, res) => { 
    res.send({ error: 'Faileed!'})            //ruta de fail
})

// Vista de Login
router.get('/login', (req, res) => {
    res.render('sessions/login')
})

// API para login
router.post('/login', passport.authenticate('loginPass', { failureRedirect: '/session/failLogin'}), async (req, res) => {
    res.redirect('/home')
})

router.get('/failLogin', (req, res) => {
    res.send({ error: 'Failed Login!'})
})

// Cerrar Session
router.get('/logout', (req, res) => {
    req.session.destroy(err => {
        if(err) {
            console.log(err);
            res.status(500).render('errors/base', {error: err})
        } else res.redirect('/sessions/login')
    })
})



export default router