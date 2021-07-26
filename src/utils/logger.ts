import winston from "winston";

export const logger = winston.createLogger({
  level: "info",
  format: winston.format.json(),
  defaultMeta: { service: "app" },
  transports: [
    new winston.transports.File({ filename: "log/error.log", level: "error" }),
    new winston.transports.File({ filename: "log/info.log", level: "info" }),
    new winston.transports.File({
      filename: "log/warning.log",
      level: "warn",
    }),
    new winston.transports.File({ filename: "log/logger.log" }),
  ],
});
