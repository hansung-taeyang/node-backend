import config from "../utils/config";
import OpenAI from "openai";

export const openai = new OpenAI({
  apiKey: config.OPEN_API_KEY
});

export type ImageParameter =  OpenAI.Images.ImageGenerateParams;