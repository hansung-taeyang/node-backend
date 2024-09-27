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
      // Add more environment variables here...
    }
  }
}

export {};
