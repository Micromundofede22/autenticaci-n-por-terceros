import bcrypt from 'bcrypt' //hashea contraseñas 


export const createHash = password => { //crea hash y se usa en la config de passport
    return bcrypt.hashSync(password, bcrypt.genSaltSync(10))
}

export const isValidPassword = (user, password) => {   //valida la contraseña y se usa en config de passport
    return bcrypt.compareSync(password, user.password)
}