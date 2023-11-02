import config from "config";
import { MailerConfigInterface } from "./interfaces";

export const mailerConf = config.get<MailerConfigInterface>('mailer');