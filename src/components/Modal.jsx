import React, { useState, useEffect, useRef } from 'react';
import { X } from './ui/icons';
import Button from './ui/Button';
import { generateLeadId, buildLeadPayload, submitLeadWithConfirmation } from '../utils/leadBackup';
import PhoneInput, { isPossiblePhoneNumber } from 'react-phone-number-input/core';
import phoneMetadata from '../utils/phoneMetadata';
import ru from 'react-phone-number-input/locale/ru';
import flags from 'react-phone-number-input/flags';
import 'react-phone-number-input/style.css';
import './PhoneField.css';

const Modal = ({ isOpen, onClose }) => {
    const [formData, setFormData] = useState({ name: '', phone: '' });
    const [phoneError, setPhoneError] = useState('');
    const [consent, setConsent] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState('');
    const [submitMessage, setSubmitMessage] = useState('');
    // Генерируем lead_id один раз при открытии модала (защита от двойного клика)
    const leadIdRef = useRef(null);

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
            setIsSuccess(false);
            setFormData({ name: '', phone: '' });
            setPhoneError('');
            setSubmitError('');
            setSubmitMessage('');
            setConsent(false);
            // Новый lead_id для каждого открытия формы
            leadIdRef.current = generateLeadId();
        }
        else document.body.style.overflow = 'unset';
        return () => { document.body.style.overflow = 'unset'; }
    }, [isOpen]);

    const handlePhoneChange = (phone) => {
        setFormData(previous => ({ ...previous, phone: phone || '' }));
        setPhoneError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!consent) {
            alert('Пожалуйста, подтвердите согласие на обработку персональных данных.');
            return;
        }

        const phone = formData.phone;
        if (!phone || !isPossiblePhoneNumber(phone, phoneMetadata)) {
            setPhoneError('Проверьте номер телефона и выбранную страну.');
            return;
        }

        // Защита от двойного клика — уже идёт отправка
        if (isSubmitting) return;

        setIsSubmitting(true);
        setSubmitError('');
        setSubmitMessage('Сохраняем заявку…');

        const leadId = leadIdRef.current || generateLeadId();

        try {
            const payload = buildLeadPayload({ ...formData, phone }, leadId);
            const result = await submitLeadWithConfirmation(payload);

            console.info('[Modal] submit результат:', {
                lead_id: leadId,
                saved: result.saved,
                channel: result.channel || 'unconfirmed',
            });

            if (result.saved) {
                setIsSuccess(true);

                try {
                    if (typeof window.ym === 'function') {
                        window.ym(106065947, 'reachGoal', 'lead_submitted', {
                            saved: true,
                            channel: result.channel,
                        });
                    }
                } catch {
                    // Metrika errors must not block the form.
                }
            } else {
                setSubmitError('Не удалось подтвердить получение заявки. Проверьте связь и нажмите «Повторить». Повтор не создаст вторую запись.');
            }

        } catch (unexpectedErr) {
            // Этого не должно произойти при правильной реализации sendLeadIngest,
            // но на всякий случай ловим
            console.error('[Modal] Неожиданная ошибка:', unexpectedErr);
            setSubmitError('Не удалось подтвердить получение заявки. Проверьте связь и нажмите «Повторить».');
        } finally {
            setIsSubmitting(false);
            setSubmitMessage('');
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
                    <div role="status" aria-live="polite" className="text-center rounded-[2rem] bg-green-50 border-2 border-green-500 px-5 py-10 sm:px-8 sm:py-12">
                        <div className="w-24 h-24 bg-green-600 text-white rounded-full flex items-center justify-center mx-auto mb-7 shadow-lg">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-14 w-14" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                        <h3 className="text-3xl sm:text-4xl font-serif font-bold text-slate-900 mb-5">
                            Ваша заявка принята!
                        </h3>
                        <p className="text-lg sm:text-xl text-slate-700 mb-8 leading-relaxed">
                            Спасибо, {formData.name}! Мы получили вашу заявку. Олег свяжется с вами по номеру <span className="font-bold text-slate-900">{formData.phone}</span> для уточнения деталей.
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
                                <PhoneInput
                                    id="phone"
                                    required
                                    className="lead-phone"
                                    defaultCountry="RU"
                                    international
                                    withCountryCallingCode
                                    limitMaxLength
                                    metadata={phoneMetadata}
                                    labels={ru}
                                    flags={flags}
                                    value={formData.phone}
                                    onChange={handlePhoneChange}
                                    autoComplete="tel"
                                    aria-invalid={Boolean(phoneError)}
                                    aria-describedby={phoneError ? 'phone-error' : undefined}
                                />
                                {phoneError && <p id="phone-error" role="alert" className="mt-2 text-sm text-red-600">{phoneError}</p>}
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
                                {isSubmitting ? 'Сохраняем…' : submitError ? 'Повторить отправку' : 'Записаться'}
                            </Button>
                            {isSubmitting && <p role="status" aria-live="polite" className="text-center text-sm text-slate-600">{submitMessage}</p>}
                            {submitError && <p role="alert" className="rounded-xl bg-amber-50 border border-amber-300 p-3 text-sm text-slate-800">{submitError} Если вопрос срочный, позвоните: <a href="tel:+79320990444" className="font-bold underline">+7 (932) 099-04-44</a>.</p>}
                        </form>
                    </>
                )}
            </div>
        </div>
    );
};

export default Modal;

