export const sendTelegramMessage = async (formData) => {
    // ВАЖНО: В реальном продакшн-проекте токены лучше хранить на сервере.
    // Для этого сайта (GitHub Pages) мы используем прямую отправку, 
    // но токен будет виден в исходном коде/сети.
    
    // Инструкция:
    // 1. Создайте бота через @BotFather в Telegram, получите TOKEN.
    // 2. Узнайте свой Chat ID через @userinfobot (или добавьте бота в группу и узнайте ID группы).
    // 3. Вставьте их ниже.

    const BOT_TOKEN = '8581878866:AAGG_12TIgc-4wWErr_pFxBEZTCKIJlMVok'; 
    const CHAT_ID = '202342418';

    if (BOT_TOKEN === 'YOUR_BOT_TOKEN_HERE') {
        console.error('Telegram Bot Token not set!');
        return { success: false, error: 'Token not set' };
    }

    const text = `
📩 *Новая заявка с сайта!*

👤 *Имя:* ${formData.name}
📱 *Телефон:* ${formData.phone}
📝 *Проблема:* ${formData.desc || 'Не указана'}

_Свяжитесь с клиентом как можно скорее._
    `;

    try {
        const response = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                chat_id: CHAT_ID,
                text: text,
                parse_mode: 'Markdown',
            }),
        });

        const data = await response.json();

        if (data.ok) {
            return { success: true };
        } else {
            console.error('Telegram API Error:', data);
            return { success: false, error: data.description };
        }
    } catch (error) {
        console.error('Network Error:', error);
        return { success: false, error: error.message };
    }
};
