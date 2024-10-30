import config from "../utils/config";
import logger from "../utils/logger";

export type Auth = {
  token: string;
  type: string;
  expired: string;
};

export const initializeToken = async () => {
  const headers = {
    "Authorization": `Basic ${config.PPURIO_AUTH_KEY_BASE64}`,
  };

  try {
    const response = await fetch("https://message.ppurio.com/v1/token", {
      headers: headers,
      method: "post",
    });
    const data = await response.json() as Auth;
    return data;
  } catch (error) {
    logger.info("Failed to initialize token: {}", error);
  }
};


export default initializeToken;
