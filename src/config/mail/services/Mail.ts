import nodemailer from 'nodemailer';
import HandlebarsMailTemplate from '../templates/HandlebarsMailTemplate';

interface IMailContact {
  name: string;
  email: string;
}

interface ITemplateVariable {
  [key: string]: string | number;
}

interface IParseMailTemplate {
  file: string;
  variables: ITemplateVariable;
}

interface ISendMail {
  to: IMailContact;
  from?: IMailContact;
  subject: string;
  templateData: IParseMailTemplate;
}

export default class EtherealMail {
  static async sendMail({
    to,
    from,
    subject,
    templateData,
  }: ISendMail): Promise<void> {
    const account = await nodemailer.createTestAccount();

    const mailTemplate = new HandlebarsMailTemplate();

    const driver = process.env.MAIL_DRIVER;
    const password = process.env.MAIL_PASSWORD;
    const user = process.env.MAIL_USER;
    const port = process.env.MAIL_PORT;
    const smtp = process.env.MAIL_SMTP;

    const prod = driver && user && password && port && smtp;

    const transporter = nodemailer.createTransport({
      host: prod ? smtp : account.smtp.host,
      port: prod ? Number(port) : account.smtp.port,
      secure: prod ? false : account.smtp.secure,
      auth: {
        user: prod ? user : account.user,
        pass: prod ? password : account.pass,
      },
    });

    const message = await transporter.sendMail({
      from: {
        name: from?.name || 'Bruno',
        address: from?.email || user || '',
      },
      to: { name: to.name, address: to.email },
      subject,
      html: await mailTemplate.parse(templateData),
    });
    /*eslint-disable-next-line*/
    console.log('Message sent: %s', message.messageId);
    /*eslint-disable-next-line*/
    console.log('Preview URL: %s', nodemailer.getTestMessageUrl(message));
  }
}
