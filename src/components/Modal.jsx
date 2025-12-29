import React, { useState, useEffect } from 'react';
import { X } from './ui/icons';
import Button from './ui/Button';
import { sendTelegramMessage } from '../utils/telegram';

const Modal = ({ isOpen, onClose }) => {
    const [formData, setFormData] = useState({ name: '', phone: '+7 ' });
    const [consent, setConsent] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
            setIsSuccess(false);
            setFormData({ name: '', phone: '+7 ' });
            setConsent(false);
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

        setIsSubmitting(true);

        try {
            const result = await sendTelegramMessage(formData);

            if (result.success) {
                setIsSuccess(true);
            } else {
                alert('Ошибка отправки: ' + (result.error || 'Проверьте соединение'));
            }
        } catch (err) {
            alert('Произошла ошибка при отправке.');
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
                            Заявка отправлена!
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
                            Бесплатная консультация
                        </h3>
                        <p className="text-slate-500 text-sm mb-6 leading-relaxed">
                            Оставьте имя и телефон. Я свяжусь с вами, уточню жалобы и честно скажу, могу ли помочь в вашей ситуации.
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
                                {isSubmitting ? 'Отправка...' : 'Отправить заявку'}
                            </Button>
                        </form>
                    </>
                )}
            </div>
        </div>
    );
};

export default Modal;

