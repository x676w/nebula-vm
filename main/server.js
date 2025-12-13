import express from "express";
import { obfuscate } from "./obfuscate.js";

const app = express();

app.use(express.json());

const HOST = "localhost";
const PORT = 3003;

const sendJsonData = (response, data) => {
  response.send(JSON.stringify(data));
  response.status(200);
};

app.post("/", (request, response) => {
  if(!request.body.code) return;

  const inputCode = request.body.code;
  const outputCode = obfuscate(inputCode);

  sendJsonData(response, {
    result : outputCode ? outputCode : "// Output code is empty"
  });
});

app.listen(PORT, HOST, 0, () => {
  console.log("Listening on host:port - " + HOST + ":" + PORT);
});