import compression from "compression";
import express, { NextFunction, Request, Response } from "express";
import helmet from "helmet";
import morgan from "morgan";
import { checkDbInfo, checkOverLoad } from "./helpers/check.connect";

const app = express();

//------Middleware------//

//Request log
app.use(morgan("combined"));

//Hide server info
app.use(helmet());

//Compression
app.use(compression());

//------Middleware------//

checkOverLoad();

app.get("/", (req: Request, res: Response, next: NextFunction) => {
  return res.status(200).json({
    message: "Hello",
  });
});

app.get("/dbcheck", async (req: Request, res: Response, next: NextFunction) => {
  const health = await checkDbInfo();
  return res.status(200).send({
    message: health,
  });
});

export default app;
