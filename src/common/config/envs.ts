import 'dotenv/config';
import * as joi from 'joi';

interface EnvVars {
  HOST: string;
  PORT: number;
  DB_HOST: string;
  DB_PORT: number;
  DB_USERNAME: string;
  DB_PASSWORD: string;
  DB_NAME: string;
  NODE_ENV: string;
  JWT_SECRET: string;
  JWT_EXPIRATION: string;
  REFRESH_JWT_SECRET: string;
  REFRESH_JWT_EXPIRATION: string;
  GOOGLE_CLIENT_ID: string;
  GOOGLE_CLIENT_SECRET: string;
  GOOGLE_CALLBACK_URL: string;
}

const envVarsSchema = joi
  .object({
    HOST: joi.string().default('localhost'),
    PORT: joi.number().default(3000),
    NODE_ENV: joi
      .string()
      .valid('development', 'production', 'test')
      .required(),
    DB_HOST: joi.string().required(),
    DB_PORT: joi.number().default(5432),
    DB_USERNAME: joi.string().required(),
    DB_PASSWORD: joi.string().required(),
    DB_NAME: joi.string().required(),
    JWT_SECRET: joi.string().required(),
    JWT_EXPIRATION: joi.string().default('1h'),
    REFRESH_JWT_SECRET: joi.string().required(),
    REFRESH_JWT_EXPIRATION: joi.string().default('7d'),
    GOOGLE_CLIENT_ID: joi.string().required(),
    GOOGLE_CLIENT_SECRET: joi.string().required(),
    GOOGLE_CALLBACK_URL: joi.string().required(),
  })
  .unknown(true);

const { error, value } = envVarsSchema.validate({
  ...process.env,
});

if (error) {
  throw new Error(`Config validation error: ${error.message}`);
}

const envVars: EnvVars = value;

export const envs = {
  NODE_ENV: envVars.NODE_ENV,
  HOST: envVars.HOST,
  PORT: envVars.PORT,
  DB_HOST: envVars.DB_HOST,
  DB_PORT: envVars.DB_PORT,
  DB_USERNAME: envVars.DB_USERNAME,
  DB_PASSWORD: envVars.DB_PASSWORD,
  DB_NAME: envVars.DB_NAME,
  isProduction: envVars.NODE_ENV === 'production',
  isDevelopment: envVars.NODE_ENV === 'development',
  JWT_SECRET: envVars.JWT_SECRET,
  JWT_EXPIRATION: envVars.JWT_EXPIRATION,
  REFRESH_JWT_SECRET: envVars.REFRESH_JWT_SECRET,
  REFRESH_JWT_EXPIRATION: envVars.REFRESH_JWT_EXPIRATION,
  GOOGLE_CLIENT_ID: envVars.GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET: envVars.GOOGLE_CLIENT_SECRET,
  GOOGLE_CALLBACK_URL: envVars.GOOGLE_CALLBACK_URL,
};
