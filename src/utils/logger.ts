import winston from 'winston';
import 'winston-daily-rotate-file';
import path from 'path';
import { getEnv } from '../config/env';

const { combine, timestamp, printf, colorize, json, errors } = winston.format;

// Define log colors
const colors = {
  error: 'red',
  warn: 'yellow',
  info: 'green',
  http: 'magenta',
  debug: 'blue',
};
winston.addColors(colors);

const stringifyMeta = (meta: any) => {
  if (Object.keys(meta).length === 0) return '';
  try {
    return ` ${JSON.stringify(meta)}`;
  } catch {
    return ' [metadata_unserializable]';
  }
};

// Local Format
const localFormat = combine(
  timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  errors({ stack: true }),
  colorize({ all: true }),
  printf((info) => {
    const { timestamp, level, message, stack, ...meta } = info;
    return `${timestamp} [${level}]: ${message}${stringifyMeta(meta)}${stack ? '\n' + stack : ''}`;
  })
);

// Production Format
const productionFormat = combine(
  timestamp(),
  errors({ stack: true }),
  json()
);

const nodeEnv = getEnv("NODE_ENV");
const logLevel = getEnv("LOG_LEVEL");
const isProduction = nodeEnv === 'production';
const consoleLogFormat = isProduction ? productionFormat : localFormat;

// Define transports
const transports: winston.transport[] = [
  new winston.transports.Console({
    format: consoleLogFormat,
  }),
];

// Add file rotation in production
if (isProduction) {
  const logDir = 'logs';
  transports.push(
    new winston.transports.DailyRotateFile({
      filename: path.resolve(logDir, 'application-%DATE%.log'),
      datePattern: 'YYYY-MM-DD',
      zippedArchive: true,
      maxSize: '20m',
      maxFiles: '14d',
      level: 'info',
      format: productionFormat,
    }),
    new winston.transports.DailyRotateFile({
      filename: path.resolve(logDir, 'error-%DATE%.log'),
      datePattern: 'YYYY-MM-DD',
      zippedArchive: true,
      maxSize: '20m',
      maxFiles: '14d',
      level: 'error',
      format: productionFormat,
    })
  );
}

// Main Instance of Logger
const logger = winston.createLogger({
  level: logLevel,
  transports,
  exitOnError: false,
});

export default logger;
