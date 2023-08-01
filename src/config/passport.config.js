import passport from "passport";
import GithubStrategy from 'passport-github2'
import local from "passport-local"
import { UserDataBase } from "../dao/dbManagers/user.js";
import { createHash, isValidPassword } from "../ultis/bcrypt.js";
import UserModel from '../dao/models/user.js'

const LocalStrategy = local.Strategy
const mongoUserManager = new UserDataBase

export const initPassport = ()=>{

    passport.serializeUser((user, done)=>{
        done(null, user.id)
    })

    passport.deserializeUser(async (id, done)=>{
        try {
            let user = await UserModel.findById(id)
            done(null, user)
        } catch (error) {
            console.log(error)
            done(error)
        }
    })

    passport.use('github', new GithubStrategy({
        clientID: 'Iv1.05da471c6caa2bca',
        clientSecret: 'a259654276321c7afe9de96c3704114b86f7e5d6',
        callbackURL: 'http://localhost:5000/api/session/githubcallback'
    }, async (accessToken, refreshToken, profile, done)=>{
        console.log(profile)
        try {
            let user = await UserModel.findOne({email: profile._json.email})
            console.log(profile._json.email);
            if (!user) {
                let newUser = {
                    first_name: profile.username,
                    last_name: profile.username,
                    roll: 'user',
                    email: profile._json.email,
                    password: ''
                }
                let result= await UserModel.create(newUser)
                return done(null, result)
            }
            
            return done(null, newUser)
        } catch (error) {
            return done(`Error ${err.message}`)
        }
    }))

    passport.use('login', new LocalStrategy(
        {
            usernameField: 'username'
        },
        async (username, password, done) => {
            console.log('login passport')
            try {
                let user = await mongoUserManager.getUser(username)
                console.log(user)
                if (!user) {
                    console.log('usuario no existe')
                    return done(null, false)
                }

                if(!isValidPassword(user, password)){
                    console.log('datos invalidos')
                    return done(null, false)
                }
                return done(null, user)
            } catch (error) {
                console.log(error)
                return done(error)
            }
        }
    ))

    passport.use('register', new LocalStrategy(
        {
            passReqToCallback: true,
            usernameField: 'email',
        },
        async (req, username, password, done)=>{
            const { first_name, last_name, age, roll = 'user', email } = req.body
            let user = { first_name, last_name, age, roll, email, password: createHash(password) }
            console.log('username: ',username);
            console.log('password: ',password);
            try {
                let exist = await mongoUserManager.getUser(username)
                
                if(exist) {
                    console.log('el usuario ya existe')
                    return done(null, false)
                }else{
                    console.log('el usuario se creo correctamente')
                    let result = await mongoUserManager.addUser(user)
                    return done(null, result)
                }
            } catch (error) {
                console.log(error)
                return done('Error al obrener el usuario'+error)
            }
        }
    ))
}