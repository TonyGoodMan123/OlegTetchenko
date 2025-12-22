// Cloudflare Worker для отправки заявок в Telegram
// Вставьте этот код в новый Worker для каждого клиента

export default {
  async fetch(request, env) {
    const cors = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    };

    if (request.method === "OPTIONS") return new Response("", { headers: cors });
    if (request.method !== "POST") return new Response("Method Not Allowed", { status: 405, headers: cors });

    let data;
    try { data = await request.json(); }
    catch { return new Response("Bad JSON", { status: 400, headers: cors }); }

    const name = (data.name || "").toString().trim();
    const phone = (data.phone || "").toString().trim();

    if (!name && !phone) return new Response("Nothing to send", { status: 400, headers: cors });

    const text =
      `🆕 Заявка с сайта\n` +
      `🌐 ИМЯ_ДОМЕНА\n` +  // <-- Замените на домен клиента
      (name ? `👤 ${name}\n` : "") +
      (phone ? `📞 ${phone}` : "");

    const tgResp = await fetch(`https://api.telegram.org/bot${env.BOT_TOKEN}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: env.CHAT_ID,
        text,
        disable_web_page_preview: true
      }),
    });

    if (!tgResp.ok) {
      const err = await tgResp.text().catch(() => "");
      return new Response(`Telegram error: ${err}`, { status: 502, headers: cors });
    }

    return new Response(JSON.stringify({ ok: true }), { headers: { ...cors, "Content-Type": "application/json" } });
  },
};

/*
ИНСТРУКЦИЯ:

1. Создайте Worker в Cloudflare (Start with Hello World)
2. Вставьте этот код
3. Добавьте Secrets:
   - BOT_TOKEN = токен от BotFather
   - CHAT_ID = ID чата клиента
4. Замените ИМЯ_ДОМЕНА на домен клиента
5. Скопируйте URL Worker и обновите telegram.js в проекте
*/
