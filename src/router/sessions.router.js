import express from "express";
import { UserDataBase } from "../dao/dbManagers/user.js";
import passport from "passport";
import { Router } from "express";

const router = Router();

const userDataBase = new UserDataBase();

router.get("/", async (req, res) => {
    try {
        const user = await userDataBase.getUser()
        res.status(200).send({ user });
    } catch (error) {
        console.error(error);
        res.status(500).send({ error: error.message });
    }
});

router.get('/github',
    passport.authenticate('github', { scope: ['user:email']}),
    async(req, res) => {}
)

router.get('/githubcallback', 
    passport.authenticate('github', {failureRedirect: '/login'}),
    async(req, res) => {
        console.log('Callback: ', req.user)
        req.session.user = req.user
        console.log('User session: ', req.session.user)
        res.redirect('/')
    })

router.post("/register", async (req, res) => {
    try {
        const { first_name, last_name, email, age, password, cart } = req.body;

        const result = await userDataBase.registerUser(
            first_name,
            last_name,
            email,
            age,
            password,
            cart
        );

        if (result.status === "error") {
            return res.status(400).send(result);
        } else {
            return res.send(result);
        }
    } catch (error) {
        console.log(error);
        return res.status(500).send({ status: "error", error: "Server error" });
    }
});

router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        const result = await userDataBase.loginUser(email, password, req, res);

        if (result.status === "error") {
            return res.status(400).send(result);
        }

        res.send(result);
    } catch (error) {
        console.log(error);
    }
});

router.post("/logout", async (req, res) => {
    try {
        const result = await userDataBase.logoutUser(req);

        if (result.status === "error") {
            return res.status(400).send(result);
        } else {
            return res.send(result);
        }
    } catch (error) {
        console.log(error);
        return res.status(500).send({ status: "error", error: "Server error" });
    }
});

export default router;