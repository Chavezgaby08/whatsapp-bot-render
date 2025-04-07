const { Client, LocalAuth } = require("whatsapp-web.js");
const qrcode = require("qrcode-terminal");

// Configuración del cliente
const client = new Client({
  authStrategy: new LocalAuth(), // Guarda la sesión para no escanear QR cada vez
  puppeteer: {
    headless: true,
    args: [
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--disable-dev-shm-usage", // Evita problemas de memoria
    ],
  }, // Ejecuta sin abrir navegador (ahorra recursos)
});

// Genera QR para vincular WhatsApp Web
client.on("qr", (qr) => {
  qrcode.generate(qr, { small: true });
});

// Confirma conexión exitosa
client.on("ready", () => {
  console.log("✅ Robotina lista! Escuchando mensajes...");
});

// Detecta mensajes nuevos
client.on("message", async (msg) => {
  const GROUP_ID1 = "120363377004440251@g.us";
  const GROUP_ID2 = "120363160328622522@g.us";

  if (msg.from == GROUP_ID || msg.from == GROUP_ID2) {
    const hasLink =
      msg.body.includes("http://") || msg.body.includes("https://");
    const isForwarded = msg.hasMedia && msg.isForwarded; // Imagen/video reenviado

    if (hasLink || isForwarded) {
      const sender = await msg.getContact();
      const reply = `Hola *${sender.pushname}* 👋\n¡Soy Robotina 🤖! Te recuerdo que en este grupo no permitimos el envío de *cadenas, links o contenido reenviado*.\n"Ten en cuenta que el grupo se creó para mantener contacto con tus seres queridos y compartir fotografías o selfies de su día a día, así se sienten más cerca a pesar de la distancia"\n\nPor favor, evítalo así los demás integrantes no se sienten agobiados. ¡Gracias! 😊`;

      msg.reply(reply); // Responde al mensaje infractor
      console.log(`⚠️ Advertencia enviada a ${sender.pushname}`);
    }
  }
});

// Inicia el bot
client.initialize();
