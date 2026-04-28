const express = require("express");
const nodemailer = require("nodemailer");
const path = require("path");
require("dotenv").config();

const app = express();
app.use(express.json());
app.use(express.static("public"));

// Ruta principal
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Configurar correo
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Endpoint registro
app.post("/register", async (req, res) => {
  const { institution, name, email } = req.body;

  try {
    const calendarLink = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=Coloquio+OCDE&dates=20260501T180000Z/20260501T190000Z&details=Evento+académico&location=Online`;

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Confirmación de registro",
      html: `
        <h2>Hola ${name},</h2>
        <p>Tu registro fue exitoso.</p>
        <p><b>Evento:</b> Coloquio OCDE</p>
        <p><a href="${calendarLink}">Agregar a Google Calendar</a></p>
      `,
    });

    res.json({ success: true });
  } catch (error) {
    console.error(error);
    res.json({ success: false });
  }
});

// Puerto dinámico (CLAVE en Render)
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Servidor corriendo"));
