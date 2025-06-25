import { LoggerInstance } from "./utils";

const isDev = import.meta.env.VITE_APP_ENV === "dev";
LoggerInstance.setEnabled(isDev);
