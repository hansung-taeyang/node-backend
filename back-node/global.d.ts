declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NODE_ENV: "development" | "production";
      EXPRESS_PORT: string;
      MYSQL_HOST: string | "localhost";
      MYSQL_PORT: string;
      MYSQL_USER: string;
      MYSQL_PASSWORD: string;
      MYSQL_DATABASE: string;
      // Add more environment variables here...
    }
  }
}

export {};
