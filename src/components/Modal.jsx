import React, { useState, useEffect } from 'react';
import { X } from './ui/icons';
import Button from './ui/Button';
import { sendTelegramMessage } from '../utils/telegram';

const Modal = ({ isOpen, onClose }) => {
    const [formData, setFormData] = useState({ name: '', phone: '', desc: '' });

    useEffect(() => {
        if (isOpen) document.body.style.overflow = 'hidden';
        else document.body.style.overflow = 'unset';
        return () => { document.body.style.overflow = 'unset'; }
    }, [isOpen]);

    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        // Импортируем функцию отправки (lazy import or direct if moved up)
        // Since we are inside the component, let's assume direct import at top
        // But for cleaner replace, we'll import at top of file in next step if generic
        // Here we just use the imported function

        try {
            const result = await sendTelegramMessage(formData);

            if (result.success) {
                alert(`Спасибо, ${formData.name}! Заявка отправлена. Я свяжусь с вами по номеру ${formData.phone} в ближайшее время.`);
                setFormData({ name: '', phone: '', desc: '' });
                onClose();
            } else {
                alert('Ошибка отправки: ' + (result.error || 'Проверьте токен'));
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
                            onChange={e => setFormData({ ...formData, phone: e.target.value })}
                        />
                    </div>
                    <div>
                        <label htmlFor="desc" className="block text-sm font-medium text-slate-700 mb-1">Что беспокоит? (необязательно)</label>
                        <textarea
                            id="desc"
                            className="w-full px-5 py-4 rounded-2xl bg-slate-50 border border-slate-200 focus:border-brand-purple focus:ring-2 focus:ring-brand-purple/20 outline-none transition resize-none h-24"
                            placeholder="Коротко опишите проблему..."
                            value={formData.desc}
                            onChange={e => setFormData({ ...formData, desc: e.target.value })}
                        />
                    </div>

                    <Button className="w-full text-lg shadow-xl" variant="primary">
                        Отправить заявку
                    </Button>

                    <p className="text-xs text-slate-400 text-center mt-4">
                        Нажимая кнопку, вы соглашаетесь с обработкой персональных данных.
                    </p>
                </form>
            </div>
        </div>
    );
};

export default Modal;
