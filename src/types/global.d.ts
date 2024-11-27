declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NODE_ENV: "dev" | "production";
      EXPRESS_PORT: string;
      MYSQL_HOST: string | "localhost";
      MYSQL_PORT: string;
      MYSQL_USER: string;
      MYSQL_PASSWORD: string;
      MYSQL_DATABASE: string;
      TEST: string;
      OPEN_API_KEY: string;
      JWT_SECRET: string;
      JWT_EXPIRES_IN: string;
      PPURIO_AUTH_KEY_BASE64: string;
      PPURIO_ACCOUNT_ID: string;
      PPURIO_SENDER_NUMBER: string;
      // Add more environment variables here...
    }
  }

  namespace Express {
    interface Request {
      emailId: string;
    }
  }
}

export {};
