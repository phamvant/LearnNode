import express, { NextFunction, Request, Response } from "express";
import helmet from "helmet";
import morgan from "morgan";
import { ErrorResponse } from "./core/error.response";
import router from "./routes/index.routes";

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

//--------Error--------//

app.use((req: Request, res: Response, next: NextFunction) => {
  const error = new ErrorResponse({ message: "Not found" });
  next(error);
});

app.use(
  (error: ErrorResponse, req: Request, res: Response, next: NextFunction) => {
    const statusCode = error.code || 500;
    return res.status(statusCode).json({
      status: "error",
      code: statusCode,
      message: error.message || "Internal Server Error",
      details: error.details,
    });
  }
);

//--------Error--------//

export default app;
