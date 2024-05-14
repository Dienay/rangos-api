import express from "express";
import "dotenv/config";
import routes from "./routes";
import { AddressInfo } from "net";
import run from "./config/dbConnect";

run();

const app = express();

app.use(express.json());

routes(app);

const portString: string = process.env.SERVER_PORT || "3003";
const PORT: number = parseInt(portString, 10);

const server = app.listen(PORT, () => {
  if (server) {
    const address = server.address() as AddressInfo;
    console.log(`Server running on http://localhost:${address.port}`);
  } else {
    console.log("Server startup failure");
  }
});