import { Router } from "express";
import passport from "passport";
import { faker } from '@faker-js/faker';
import os from "os";
import compression from "compression";
import logger from "../lib/log4js.js"

const router = Router();

const fakerData = () => {
    let products = [];
    for (let i = 0; i<5; i++){
        let tit = faker.commerce.productName();
        let pri = faker.commerce.price();
        let img = faker.image.image();
        products.push({title: tit, price: pri, thumbnail: img});
    };
    return products;
};

const isAuthenticated = (req, res, next) => {
    if(req.isAuthenticated()) {
        console.log(req.isAuthenticated)
        next();
    }
    else {
        res.redirect("/");
    }
};


router
    .route("/")
    .get((req, res) => {
        logger.info(`${req.method} request from ${req.originalUrl} route`)
        res.render("login")
    });

router
    .route("/register")
    .get((req, res) => {
        logger.info(`${req.method} request from ${req.originalUrl} route`),
        res.render("register")
    })
    .post(
        passport.authenticate("register", {failureRedirect: "/registerFail"}),
        (req, res) => {
            logger.info(`${req.method} request from ${req.originalUrl} route`);
            res.redirect("/")
        }
    );

router.get("/registerFail", (req, res) => {
    logger.info(`${req.method} request from ${req.originalUrl} route`);
    res.render("registerError")
});

router
    .route("/main")
    .post(
        passport.authenticate("login", {failureRedirect: "/loginFail"}),
        (req, res) => {
            logger.info(`${req.method} request from ${req.originalUrl} route`);
            res.render("inputForm", {username: req.body.username})
        }
    );

router.get("/loginFail", (req, res) => res.render("loginError"));

router.get("/logout", (req, res) => {
    req.logout(() => {
        logger.info(`${req.method} request from ${req.originalUrl} route`);
        return res.render("logout")
    });
})

router
    .route("/api/productos-test")
    .get(isAuthenticated, (req, res) => {
        logger.info(`${req.method} request from ${req.originalUrl} route`);
        try{
            let products = fakerData();
            res.render("fakeProds", {products, hasAny:true})
        } catch (err){
            logger.error(`${err}`);
        }
    });

router.get("/info", compression(), (req, res) => {
    logger.info(`${req.method} request from ${req.originalUrl} route`)
    let args = process.argv;
    let so = process.platform;
    let nodeVer = process.version;
    let rss = process.memoryUsage.rss();
    let execPath = process.execPath;
    let pId = process.pid;
    let folder = process.cwd();
    let cores = os.cpus().length;
    console.log(args+so+nodeVer+rss+execPath+pId+folder+cores)
    res.render("info", {args, so, nodeVer, rss, execPath, pId, folder, cores})
});

router.get("*", (req, res) => {
    logger.warn(`${req.method} request from ${req.originalUrl} route`);
    res.status(404).send("Sorry this route does no exist")
})

export default router;