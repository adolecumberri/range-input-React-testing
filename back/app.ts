import express, { Application } from "express";
import cluster from "cluster";
import morgan from "morgan";

// Routes
import IndexRoutes from "./routes/index.routes";

export class App {
  app: Application | undefined; //creation of the propertie "application"

  constructor(
    private port?: number | string //
  ) {
      //functions which contains my whole app.
      this.app = express(); //app type aplication receive "express()"
      this.settings(); //add settings
      this.middlewares(); //add middlewares
      this.routes(); //add routes
    
  }

  private settings() {
    this.app?.set("port", this.port || process.env.PORT || 5000); // if there is not PORT = ${number}, default 3000
  }

  private middlewares() {
    this.app?.use(morgan("dev")); //Morgan establishment
    this.app?.use(express.json());
    this.app?.use(express.urlencoded());
    this.app?.use(express.json());
  }

  private routes() {
    this.app?.use("/", IndexRoutes); //main route.
  }

  async listen(): Promise<void> {
    await this.app?.listen(this.app.get("port"));
    console.log(
      ` ${
        !cluster.isMaster
          ? `Server Thread nº ${
              cluster.worker.id
            } listening port ${this.app?.get("port")}`
          : "Server Master displayed"
      } `
    );
  }
}
