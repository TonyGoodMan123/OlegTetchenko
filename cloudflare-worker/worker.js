// Cloudflare Worker для отправки заявок в Telegram
// Развертывание: скопируйте этот код в Cloudflare Dashboard → Workers & Pages → Create Worker

export default {
    async fetch(request, env) {
        // CORS headers для разрешения запросов с фронтенда
        const corsHeaders = {
            'Access-Control-Allow-Origin': '*', // В продакшене замените на ваш домен
            'Access-Control-Allow-Methods': 'POST, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type',
        };

        // Обработка preflight запроса
        if (request.method === 'OPTIONS') {
            return new Response(null, { headers: corsHeaders });
        }

        // Разрешаем только POST запросы
        if (request.method !== 'POST') {
            return new Response(JSON.stringify({ ok: false, error: 'Method not allowed' }), {
                status: 405,
                headers: { ...corsHeaders, 'Content-Type': 'application/json' }
            });
        }

        try {
            // Парсинг данных из запроса
            const data = await request.json();
            const { name, phone } = data;

            // Валидация данных
            if (!name || !phone) {
                return new Response(JSON.stringify({ 
                    ok: false, 
                    error: 'Missing required fields: name, phone' 
                }), {
                    status: 400,
                    headers: { ...corsHeaders, 'Content-Type': 'application/json' }
                });
            }

            // Получаем токен бота из environment secrets
            const BOT_TOKEN = env.BOT_TOKEN;
            if (!BOT_TOKEN) {
                console.error('BOT_TOKEN not configured in environment');
                return new Response(JSON.stringify({ 
                    ok: false, 
                    error: 'Server configuration error' 
                }), {
                    status: 500,
                    headers: { ...corsHeaders, 'Content-Type': 'application/json' }
                });
            }

            // Получаем chat_id из environment secrets или из запроса (для совместимости)
            const chat_id = data.chat_id || env.CHAT_ID;
            if (!chat_id) {
                console.error('CHAT_ID not configured in environment and not provided in request');
                return new Response(JSON.stringify({ 
                    ok: false, 
                    error: 'Server configuration error' 
                }), {
                    status: 500,
                    headers: { ...corsHeaders, 'Content-Type': 'application/json' }
                });
            }

            // Формируем сообщение для Telegram
            const message = `🔔 Новая заявка с сайта!\n\n👤 Имя: ${name}\n📱 Телефон: ${phone}`;

            // Отправляем сообщение в Telegram
            const telegramApiUrl = `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`;
            const telegramResponse = await fetch(telegramApiUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    chat_id: chat_id,
                    text: message,
                    parse_mode: 'HTML'
                })
            });

            const telegramData = await telegramResponse.json();

            // Проверяем ответ от Telegram API
            if (telegramData.ok) {
                return new Response(JSON.stringify({ ok: true, message: 'Message sent successfully' }), {
                    status: 200,
                    headers: { ...corsHeaders, 'Content-Type': 'application/json' }
                });
            } else {
                console.error('Telegram API error:', telegramData);
                return new Response(JSON.stringify({ 
                    ok: false, 
                    error: 'Failed to send message to Telegram',
                    details: telegramData.description 
                }), {
                    status: 500,
                    headers: { ...corsHeaders, 'Content-Type': 'application/json' }
                });
            }

        } catch (error) {
            console.error('Worker error:', error);
            return new Response(JSON.stringify({ 
                ok: false, 
                error: 'Internal server error',
                message: error.message 
            }), {
                status: 500,
                headers: { ...corsHeaders, 'Content-Type': 'application/json' }
            });
        }
    }
};
