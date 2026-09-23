import "dotenv/config";
import transporter from "./lib/mailer.js";

async function probarEmail() {
  try {
    const info = await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to: "bonellijoel@gmail.com",
      subject: "Prueba de correo - Al Rescate",
      text: "El envío de correos desde el backend funciona correctamente.",
      html: `
        <h2>Al Rescate</h2>
        <p>El envío de correos desde el backend funciona correctamente.</p>
      `,
    });

    console.log("Correo enviado correctamente");
    console.log("Message ID:", info.messageId);
  } catch (error) {
    console.error("Error enviando correo:", error);
  }
}

probarEmail();