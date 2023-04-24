import { allowedOrigins } from "./allowedOrigins";
import { CorsOptions } from "cors";

export const corsOptions: CorsOptions = {
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed, CORS."));
    }
  },
  credentials: true,
  optionsSuccessStatus: 200,
};
