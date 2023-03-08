import express from "express";
import parseArgs from "minimist";
import cluster from "cluster";
import os from "os";

const app = express();

const args = process.argv.slice(2);
const options = {
  alias: {
    p: "port",
    m: "mode"
  },
  default:{
    port: 8081,
    mode: "fork"
  }
};



const minimistArgs = parseArgs(args, options);

const port = minimistArgs.port;

const rndCounter = (q) => {
  const numbers = [];

  for (let i = 0; i < q; i++) {
      let rand = Math.floor(Math.random() * 1000)
      numbers.push(rand)
  };

  const counted = {};

  for (let num of numbers){
      counted[num] = counted[num] ? counted[num] + 1 : 1
  };

  return counted
}

const apiRandomServer = () => {
  app.get("/api/randoms", (req, res) => {
    const rnd = rndCounter(1000);
    res.send(rnd)
  });

  app.listen(port, (err) => {
    if (!err)
      console.log(
        `Servidor express escuchando en el puerto ${port} - PID WORKER ${process.pid}`
      );
  });
};

const cpus = os.cpus();

if (minimistArgs.mode === "cluster" && cluster.isPrimary) {
  cpus.map(() => {
    cluster.fork();
  });

  cluster.on("exit", (worker) =>  cluster.fork())
} else {
  apiRandomServer();
}