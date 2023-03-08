import { Router } from "express";
import { fork } from "child_process";

const router = Router();

router
    .route("/random")
    .get((req, res) => {
        let q = req.query.amount || 100000000;

        const child = fork("./child.js");
        child.send(q);

        child.on("message", (msg) => {
            res.send(msg)
        })
    })
export default router;