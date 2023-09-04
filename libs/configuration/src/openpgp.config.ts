import config from "config";
import { OpenPGPConfigInterface } from "./interfaces";

export const pgpconf = config.get<OpenPGPConfigInterface>('openPgp');