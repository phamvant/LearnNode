import app from "./src/app";
import CONFIG from "./src/configs/configuration";

const server = app.listen(CONFIG.APP.PORT, () => {
  console.log(`Listening on port ${CONFIG.APP.PORT}...`);
});

process.on("SIGINFO", () => {
  server.close(() => {
    console.log("Exit Server Express");
  });
});
