import React, { useState, useEffect, useRef } from 'react';
import { X } from './ui/icons';
import Button from './ui/Button';
import { sendTelegramMessage } from '../utils/telegram';
import { generateLeadId, buildLeadPayload, sendLeadBackup } from '../utils/leadBackup';

const Modal = ({ isOpen, onClose }) => {
    const [formData, setFormData] = useState({ name: '', phone: '+7 ' });
    const [consent, setConsent] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    // Генерируем lead_id один раз при открытии модала (защита от двойного клика)
    const leadIdRef = useRef(null);

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
            setIsSuccess(false);
            setFormData({ name: '', phone: '+7 ' });
            setConsent(false);
            // Новый lead_id для каждого открытия формы
            leadIdRef.current = generateLeadId();
        }
        else document.body.style.overflow = 'unset';
        return () => { document.body.style.overflow = 'unset'; }
    }, [isOpen]);

    const handlePhoneChange = (e) => {
        setFormData({ ...formData, phone: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!consent) {
            alert('Пожалуйста, подтвердите согласие на обработку персональных данных.');
            return;
        }

        // Защита от двойного клика — уже идёт отправка
        if (isSubmitting) return;

        setIsSubmitting(true);

        const leadId = leadIdRef.current || generateLeadId();

        try {
            // ── Запускаем Telegram и backup ОДНОВРЕМЕННО ────────────────────
            // Promise.allSettled гарантирует, что оба промиса выполнятся,
            // даже если один из них упадёт или уйдёт в таймаут.
            const [telegramResult, backupResult] = await Promise.allSettled([
                sendTelegramMessage(formData),
                sendLeadBackup(buildLeadPayload(
                    formData,
                    leadId,
                    'pending' // статус Telegram ещё неизвестен на момент запуска
                )),
            ]);

            // Определяем статусы
            const telegramOk = telegramResult.status === 'fulfilled' && telegramResult.value?.success;
            const backupOk   = backupResult.status === 'fulfilled'   && backupResult.value?.ok;

            const telegramStatus = telegramOk ? 'sent' : 'failed';

            // Логируем результат для диагностики
            console.info('[Modal] submit результат:', {
                lead_id: leadId,
                telegram: telegramStatus,
                backup: backupOk ? 'saved' : 'failed',
                backup_detail: backupResult.status === 'fulfilled' ? backupResult.value : backupResult.reason,
            });

            // ── Приоритет: если backup подтверждён — считаем успехом ────────
            // Пользователь видит успех даже если Telegram не доставил.
            // Если backup тоже упал — показываем ошибку.
            if (backupOk || telegramOk) {
                setIsSuccess(true);

                // Отправляем цель в Яндекс.Метрику
                try {
                    if (typeof window.ym === 'function') {
                        window.ym(106065947, 'reachGoal', 'lead_submitted', {
                            lead_id: leadId,
                            telegram_ok: telegramOk,
                            backup_ok: backupOk,
                        });
                    }
                } catch (_) {}
            } else {
                // Оба канала упали — честно сообщаем
                console.error('[Modal] Оба канала не доступны. backup:', backupResult, 'telegram:', telegramResult);
                alert('Не удалось отправить заявку. Пожалуйста, позвоните напрямую: +7 (932) 099-04-44');
            }

        } catch (unexpectedErr) {
            // Этого не должно произойти при правильной реализации sendLeadBackup/sendTelegramMessage,
            // но на всякий случай ловим
            console.error('[Modal] Неожиданная ошибка:', unexpectedErr);
            alert('Произошла ошибка при отправке. Позвоните напрямую: +7 (932) 099-04-44');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onClose}></div>
            <div className="relative bg-white rounded-[2.5rem] w-full max-w-lg p-8 shadow-2xl animate-fade-in-up max-h-[90vh] overflow-y-auto">
                <button onClick={onClose} className="absolute top-6 right-6 p-2 bg-slate-100 rounded-full hover:bg-slate-200 transition">
                    <X size={24} className="text-slate-600" />
                </button>

                {isSuccess ? (
                    <div className="text-center py-8">
                        <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                        <h3 className="text-2xl font-serif font-bold text-slate-800 mb-4">
                            Запись принята!
                        </h3>
                        <p className="text-slate-600 mb-8 leading-relaxed">
                            Спасибо, {formData.name}! Я свяжусь с вами по номеру <span className="font-bold">{formData.phone}</span> в ближайшее время для уточнения деталей.
                        </p>
                        <Button onClick={onClose} className="w-full">
                            Понятно
                        </Button>
                    </div>
                ) : (
                    <>
                        <h3 className="text-2xl md:text-3xl font-serif font-bold text-slate-800 mb-2">
                            Запись на встречу
                        </h3>
                        <p className="text-slate-500 text-sm mb-6 leading-relaxed">
                            Оставьте имя и телефон. Я свяжусь с вами, уточню ваш запрос и честно скажу, могу ли помочь в вашей ситуации.
                        </p>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label htmlFor="name" className="block text-sm font-medium text-slate-700 mb-1">Ваше имя *</label>
                                <input
                                    id="name"
                                    required
                                    type="text"
                                    className="w-full px-5 py-4 rounded-2xl bg-slate-50 border border-slate-200 focus:border-brand-purple focus:ring-2 focus:ring-brand-purple/20 outline-none transition"
                                    placeholder="Иван"
                                    value={formData.name}
                                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                                />
                            </div>
                            <div>
                                <label htmlFor="phone" className="block text-sm font-medium text-slate-700 mb-1">Телефон *</label>
                                <input
                                    id="phone"
                                    required
                                    type="tel"
                                    className="w-full px-5 py-4 rounded-2xl bg-slate-50 border border-slate-200 focus:border-brand-purple focus:ring-2 focus:ring-brand-purple/20 outline-none transition"
                                    placeholder="+7 (999) 000-00-00"
                                    value={formData.phone}
                                    onChange={handlePhoneChange}
                                />
                            </div>

                            {/* Honeypot — скрытое поле для защиты от ботов. Люди не видят и не заполняют. */}
                            <div style={{ position: 'absolute', left: '-9999px', top: '-9999px' }} aria-hidden="true">
                                <label htmlFor="website">Оставьте это поле пустым</label>
                                <input
                                    id="website"
                                    name="website"
                                    type="text"
                                    tabIndex={-1}
                                    autoComplete="off"
                                    value={formData.website || ''}
                                    onChange={e => setFormData({ ...formData, website: e.target.value })}
                                />
                            </div>

                            {/* Consent Checkbox */}
                            <div className="flex items-start gap-3 pt-2">
                                <input
                                    id="consent"
                                    type="checkbox"
                                    checked={consent}
                                    onChange={e => setConsent(e.target.checked)}
                                    className="mt-1 w-5 h-5 rounded border-slate-300 text-brand-purple focus:ring-brand-purple/20 cursor-pointer"
                                    required
                                />
                                <label htmlFor="consent" className="text-sm text-slate-600 leading-relaxed cursor-pointer">
                                    Согласен(на) на{' '}
                                    <a href="/consent.html" target="_blank" rel="noopener noreferrer" className="text-brand-purple hover:underline">
                                        обработку персональных данных
                                    </a>{' '}
                                    и ознакомлен(а) с{' '}
                                    <a href="/privacy.html" target="_blank" rel="noopener noreferrer" className="text-brand-purple hover:underline">
                                        Политикой конфиденциальности
                                    </a>
                                </label>
                            </div>

                            <Button
                                className="w-full text-lg shadow-xl"
                                variant="primary"
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? 'Отправка...' : 'Записаться'}
                            </Button>
                        </form>
                    </>
                )}
            </div>
        </div>
    );
};

export default Modal;

