import { SmtpClient } from 'https://deno.land/x/smtp/mod.ts';
import { config } from 'https://deno.land/x/dotenv/mod.ts';

const env = config();

const client = new SmtpClient();

const emailConfig: any = {
  hostname: env.EMAIL_HOST,
  port: Number(env.EMAIL_HOST_PORT),
  username: env.EMAIL_USER_NAME,
  password: env.EMAIL_PWD,
}

await client.connectTLS(emailConfig);

export default client;