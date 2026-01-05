// Secure telegram integration via Cloudflare Worker
// Bot token is now stored securely in Worker secrets

const WORKER_URL = 'https://olegweb-lead-to-telegram-api.scorcioner.workers.dev';

export const sendTelegramMessage = async (formData) => {
    try {
        const response = await fetch(WORKER_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                name: formData.name,
                phone: formData.phone,
                chat_id: '-1003496210379', // Target Group ID
            }),
        });

        const data = await response.json();

        if (data.ok) {
            return { success: true };
        } else {
            console.error('Worker Error:', data);
            return { success: false, error: 'Ошибка отправки' };
        }
    } catch (error) {
        console.error('Network Error:', error);
        return { success: false, error: error.message };
    }
};

