import { every15Minute, everyMinute } from 'https://deno.land/x/deno_cron/cron.ts';
import { config } from 'https://deno.land/x/dotenv/mod.ts';
import { notify } from 'https://deno.land/x/deno_notify@0.3.0/ts/prepared.ts';

import emailClient from './email-client.ts';


let curentData: Array<any> = [];
const env = config();

const fetchDataFromCoordinadora: any = async () => {
  const url = `https://www.coordinadorausa.com/api/frontend/v1/casillero/despachos/rastreo/${env.GUIDE_NUMBER}`;

  const res = await fetch(url);
  const body = await res.json();
  console.log(body);
  return body;
}

const compareData = (oldData: Array<any>, newData: Array<any>) => {
  return oldData.length !== newData.length;
}

const sendEmail = async (emailSubject: string, emailBody: string) => {
  console.log("SENDING EMAIL: " + emailSubject);
  return await emailClient.send({
    from: env.EMAIL_FROM,
    to: env.EMAIL_TO,
    subject: emailSubject,
    content: emailBody
  })
}

const makeProccess = async () => {
  console.log("RUNNING");
  try {
    const newData = await fetchDataFromCoordinadora();
    const areDiferentData = compareData(newData.estados, curentData);
    if(areDiferentData) {
      curentData = newData.estados;
      console.log(" hubo cambio");
      notify({
        title: 'Hubo un cambio!',
        message: newData.estados[newData.estados.length-1].descripcion,
        icon: {
          app: "Terminal",
        },
        sound: "Basso",
      });
    }
  } catch (error) {
    console.error(error)
  }
}

everyMinute(makeProccess);

 