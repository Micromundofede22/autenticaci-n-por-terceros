import passport from "passport" //traigo libreria
import local from 'passport-local' //traigo estrategia de la libreria
import UserModel from '../dao/models/user.model.js'
import { createHash, isValidPassword } from '../utils.js'
import GitHubStrategy from "passport-github2"
import { OAuth2Strategy as GoogleStrategy } from "passport-google-oauth"


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
            // return done('error al obtener el user')                 //1ER ARGUMENTO DE DONE ES UN ERROR
        }
    }))

    // CONFIG LOGIN
    passport.use('loginPass', new LocalStrategy({
        usernameField: 'email'
    }, async (username, password, done) => {
        try {
            const user = await UserModel.findOne({ email: username }) //busca el email
            if (!user) {   //si no esta logueado el user, tira error
                return done(null, false)
            }
            if (!isValidPassword(user, password)) return done(null, false) //si la contraseña es invalida retorna error
            return done(null, user) //si existe user y contraseña ok, error null, y me tira el user
        } catch (err) {

        }
    }))

    passport.use("github", new GitHubStrategy({
        clientID: "Iv1.d5fe56e994ba152a",                                  //cliente lo saco cuando creo la app en git
        clientSecret: "3ae4422147ceb4569eeec50d72d28d2a78a1e29a",          //llave la saco de la app git
        callbackURL: "http://localhost:8080/githubcallback"                //la misma url que puse en git
    }, async (accessToken, refreshToken, profile, done) => {
        console.log(profile)
        try {
            const user = await UserModel.findOne({ email: profile._json.email }) //profile tiene una prop json, donde se encuentra toda la info
            if (user) return done(null, user)                                    //si ya existe el email no lo grabo en la db, y done retorna el user al endpoin githubcallback que esta en el session router
            const newUser = await UserModel.create({                            //si no existe, lo creo en la db
                first_name: profile._json.name,
                email: profile._json.email,
                password: " ",                                                   //ya que el model de user es obligatorio
                role: "user",
                servicio: "GitHub"
            })
            return done(null, newUser)
        } catch (err) {
            return done(`Error to login with GitHub => ${err.message}`)
        }
    }))


    passport.use("googlePass", new GoogleStrategy({
        clientID: "677009444232-m39194megnhvte4295dih3j2hhjit2cf.apps.googleusercontent.com",
        clientSecret: "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",
        callbackURL: "http://localhost:8080/googlecallback"
    },
        async (accessToken, refreshToken, profile, done) => {
            console.log(profile)
            try {
                const user = await UserModel.findOne({ email: profile._json.email }) //profile tiene una prop json, donde se encuentra toda la info
                if (user) return done(null, user)                                    //si ya existe el email no lo grabo en la db, y done retorna el user al endpoin githubcallback que esta en el session router
                const newUser = await UserModel.create({                            //si no existe, lo creo en la db
                    first_name: profile._json.name,
                    email: profile._json.email,
                    password: " ",                                                   //ya que el model de user es obligatorio
                    role: "user",
                    servicio: "Google",
                    photograph: profile._json.picture
                })
                // console.log(newUser)
                return done(null, newUser)
            } catch (err) {
                return done(`Error to login with Google => ${err.message}`)
            }
        }
    )
    );



    passport.serializeUser((user, done) => {                 //passport solo guarda en la session el id, no todos los datos del user, ya q esos van a la db
        done(null, user._id)
    })

    passport.deserializeUser(async (id, done) => {          //acá busca de la db todos los datos del user
        const user = await UserModel.findById(id)
        done(null, user)
    })
}

export default initializePassport