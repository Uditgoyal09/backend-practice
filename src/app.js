  import express from "express";
  import cors from "cors";
  import morgan from "morgan";
  import authRoute from "./routes/auth.route.js"
  import fs from "fs";
  import limiter from "./middleware/rate.limiter.js";
  import helmet from "helmet";

  const app = express();

  app.use(express.json());
  app.use(cors());
  app.use(morgan("dev"));
  app.use(express.urlencoded({extended:true}));
  app.use(helmet())//
  // app.use(limiter);
  app.get("/",(req, res) => {
    fs.readFile(new URL("./form.html", import.meta.url), "utf-8", (err, data) => {
      if (err) {
        res.status(500).end("error");
        return;
      }
      res.writeHead(200, { "Content-Type": "text/html" });
      res.end(data);
    });
  });

  app.use("/api/auth",limiter,authRoute);

  export default app;