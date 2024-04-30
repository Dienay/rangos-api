import express from "express";
import "dotenv/config";
import routes from "./routes";
import { AddressInfo } from "net";

const app = express();

app.use(express.json());

routes(app);

const portString: string = process.env.PORT || "3003";
const port: number = parseInt(portString, 10);

const server = app.listen(port, () => {
  if (server) {
    const address = server.address() as AddressInfo;
    console.log(`Servidor rodando em http://localhost:${address.port}`);
  } else {
    console.log("Falha ao iniciar servidor");
  }
});