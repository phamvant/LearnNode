import { NextFunction, Request, Response } from "express";
import { CREATE } from "../core/success.response";
import AccessService from "../services/access.service";

class AccessController {
  static signUp = async (req: Request, res: Response, next: NextFunction) => {
    console.log(`[P]::SignUp`, req.body);

    const newUser = await AccessService.SignUp(req.body);

    new CREATE({
      message: "New User Created",
      metadata: newUser || {},
    }).send(res);
  };
}

export default AccessController;

// app.get('/testroute/:id', function (req, res, next) {
//     if (req.params.id === '0') next() // Take me to the next function in current route
//     else if (req.params.id === '1') next('route') //Take me to next routes/middleware by skipping all other functions in current router
//     else next(new Error('Take me directly to error handler middleware by skipping all other routers/middlewares'))
//   }, function (req, res, next) {
//     // render a regular page
//     console.log('Next function in current route')
//     res.status(200).send('Next function in current route');
//   })

//   // handler for the /testroute/:id path, which renders a special page
//   app.get('/testroute/:id', function (req, res, next) {
//     console.log('Next routes/middleware by skipping all other functions in current router')
//     res.status(200).send('Next routes/middleware by skipping all other functions in current router');
//   })
//   //error middleware
//   app.use(function (err, req, res, next) {
//     console.log('take me to next routes/middleware by skipping all other functions in current router')
//     res.status(err.status || 500).send(err.message);
//   });
