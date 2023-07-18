import passport from "passport" //traigo libreria
import local from 'passport-local' //traigo estrategia de la libreria
import UserModel from '../dao/models/user.model.js'
import { createHash, isValidPassword } from '../utils.js'

const LocalStrategy = local.Strategy

const initializePassport = () => {                                //ESTO LO USAMOS COMO MIDLEWARE

    // CONFIG REGISTER
    passport.use('registerPass', new LocalStrategy({
        passReqToCallback: true,
        usernameField: 'email'                                       //EL IDENTIFICADOR SERÁ EL EMAIL
    }, async (req, username, password, done) => {
        const { first_name, last_name, email, age } = req.body

        try {
            // BUSCA USUARIO YA REGISTRADO 
            const user = await UserModel.findOne({ email: username })   //BUSCA QUE EL EMAIL NO EXISTA
            if (user) {
                console.log('Usuario ya existe')                    //SI USUARIO EXISTE, LO DETECTA, ASI NO GENERAR OTRO USUARIO CON MISMO EMAIL
                return done(null, false)                             //1ER ARGUMENTO SIRVE PARA INDICAR ERRORRES, PONEMOS NULL PARA DECIRLE QUE NO A OCURRIDO NINGUN ERROR,
                //2DO ARGUMENTO (FALSE), PARA INDICARLE EL USUARIO CREADO, QUE EN ESTE NO SE CREA, PORQUE YA EXISTE
            }
            // SI NO EXISTE USUARIO, SE REGISTRA UNO NUEVO
            const newUser = {
                first_name, last_name, email, age, password: createHash(password)
            }
            const result = await UserModel.create(newUser)
            return done(null, result)                               //NO HAY ERROR(NULL) Y RETORNO EL USUARIO CREADO
        } catch (err) {
            return done('error al obtener el user')                 //1ER ARGUMENTO DE DONE ES UN ERROR
        }
    }))

    // CONFIG LOGIN
    passport.use('loginPass', new LocalStrategy({
        usernameField: 'email'
    }, async (username, password, done) => {
        try {
            const user = await UserModel.findOne({ email: username }) //busca el email
            if (!user) {
                return done(null, false)
            }

            if (!isValidPassword(user, password)) return done(null, false)
            return done(null, user)
        } catch (err) {

        }
    }))

    passport.serializeUser((user, done) => {                 //passport solo guarda en la session el id, no todos los datos del user, ya q esos van a la db
        done(null, user._id)
    })

    passport.deserializeUser(async (id, done) => {          //acá busca de la db todos los datos del user
        const user = await UserModel.findById(id)
        done(null, user)
    })

}

export default initializePassport