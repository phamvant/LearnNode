import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import router from "./routes";

const app = express();

//------Middleware------//

//Request log
app.use(morgan("combined"));

//Hide server info
app.use(helmet());

//Compression
// app.use(compression());

app.use(express.json());

app.use(
  express.urlencoded({
    extended: true,
  })
);

//------Middleware------//

app.use("", router);

// checkOverLoad();

export default app;
