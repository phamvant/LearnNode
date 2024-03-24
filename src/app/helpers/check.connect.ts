// import os from "os";
// import { prisma } from "../database/init.prisma";

// const _CHECK_OVERLOAD_INTERVAL = 5000;

// export const checkDbInfo = async () => {
//   const metrics = await prisma.$metrics.json();
//   return metrics;
// };

// export const checkOverLoad = () => {
//   setInterval(async () => {
//     const metrics = await prisma.$metrics.json();

//     const connections = metrics.counters[3].value;
//     const numCores = os.cpus().length;
//     const memoryUsage = process.memoryUsage().rss;
//     const maxConnection = numCores * 5;

//     console.log(`Active connection :: ${connections} over ${maxConnection}`);
//     console.log(`Memory usage :: ${memoryUsage / 1024 / 1024} MB`);

//     if (connections > maxConnection) {
//       console.log(`DB Overload :: ${connections} over ${maxConnection}`);
//     }

//     console.log("\n");
//   }, _CHECK_OVERLOAD_INTERVAL);
// };
