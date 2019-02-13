import * as express from "express";
import * as morgan from "morgan";
import * as helmet from "helmet";
import * as cors from "cors";

// Create and configure app.
const app = express();
app.use(helmet());
app.use(morgan('dev'));
app.use(cors());

// Export app;
export default app;