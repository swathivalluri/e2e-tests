import winston from "winston";
import { getLoggerOptions } from "./loggerOptions";

export function createLogger(pageName: string) {
    return winston.createLogger(getLoggerOptions(pageName));
}