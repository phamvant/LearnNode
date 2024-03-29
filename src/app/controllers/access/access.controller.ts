import { NextFunction, Request, Response } from "express";
import { CustomRequest } from "../../auth/auth.utils";
import { BadRequestError, NotFoundError } from "../../core/error.response";
import { ACCEPTED, CREATE } from "../../core/success.response";
import AccessService from "../../services/access/access.service";

const handleRefreshToken = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  if (
    !req.metadata?.extractedClientID &&
    !req.metadata?.keytokenUsedRefreshToken
  ) {
    throw new NotFoundError({ message: "Unknown Error" });
  }

  const { userId, keytokenUsedRefreshToken } = req.metadata;

  const newToken = await AccessService.HandleRefreshToken({
    userId: userId,
    usedRefreshToken: keytokenUsedRefreshToken,
  });

  new CREATE({ message: "Token Refreshed", metadata: newToken }).send(res);
};

const signUp = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  console.log(`[P]::SignUp`, req.body);

  const newUser = await AccessService.SignUp(req.body);

  new CREATE({
    message: "New User Created",
    metadata: newUser || {},
  }).send(res);
};

const login = async (req: Request, res: Response, next: NextFunction) => {
  console.log(`[P]::Login`, req.body);

  const loggedInUser = await AccessService.Login(req.body);

  new ACCEPTED({
    message: "User Logged In",
    metadata: loggedInUser,
  }).send(res);
};

const logout = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  const isLoggedOut = await AccessService.Logout({
    userId: req.metadata?.userId,
  });

  if (!isLoggedOut) {
    throw new BadRequestError({ message: "Unknown Error, Cant Logout" });
  }

  new ACCEPTED({
    message: "User Logged Out",
    metadata: {},
  }).send(res);
};

const AccessController = {
  handleRefreshToken,
  signUp,
  login,
  logout,
};

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
