import tls from 'tls'
import 'dotenv/config'

// export const sendEmail = ({ from, to, subject, body, user, pass }) => {
export const sendEmail = ({ from, to, subject, body }) => {
  const recipient = to || process.env.MAIL_TO;
  const user = process.env.MAIL_USER
  const pass = process.env.MAIL_PASS
  return new Promise((resolve, reject) => {
    const socket = tls.connect(465, 'smtp.gmail.com', { rejectUnauthorized: true }, () => {
      console.log('Connected to Gmail SMTP');
    });

    let step = 0;
    const commands = [
      `EHLO localhost\r\n`,
      `AUTH LOGIN\r\n`,
      Buffer.from(user).toString('base64') + '\r\n',
      Buffer.from(pass).toString('base64') + '\r\n',
      `MAIL FROM:<${from}>\r\n`,
      `RCPT TO:<${recipient}>\r\n`,
      `DATA\r\n`,
      `Subject: ${subject}\r\nFrom: ${from}\r\nTo: ${recipient}\r\nContent-Type: text/html; charset=UTF-8\r\n\r\n${body}\r\n.\r\n`,
      `QUIT\r\n`
    ];


    socket.on('data', (data) => {
      const msg = data.toString();
      console.log('S:', msg);

      if (step < commands.length) {
        const cmd = commands[step++];
        console.log('C:', cmd.trim());
        socket.write(cmd);
      } else {
        socket.end();
        resolve('Email sent successfully');
      }
    });

    socket.on('error', reject);
  });
}

// Example usage:
// console.log({ user, pass })
// sendEmail({
//   from: 'coderhndev@gmail.com',
//   to: process.env.MAIL_TO,
//   subject: 'Test Email from Raw SMTP',
//   body: 'Hello from Node.js without libraries!',
//   user: user,
//   pass: pass
// })
// .then(console.log)
// .catch(console.error);
