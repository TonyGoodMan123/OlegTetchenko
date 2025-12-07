import React from 'react';
import Section from './ui/Section';
import SectionTitle from './ui/SectionTitle';
import { MapPin, Phone, Clock, MessageCircle, Send } from './ui/icons';

const Contacts = ({ onOpenModal }) => (
    <Section id="contacts" bg="white">
        <div className="grid md:grid-cols-2 gap-12">
            <div>
                <SectionTitle title="Контакты" />
                <div className="space-y-6 mb-8">
                    <div className="flex items-start">
                        <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-brand-purple mr-4 flex-shrink-0">
                            <MapPin size={20} />
                        </div>
                        <div>
                            <h4 className="font-bold text-slate-800">Адрес приёма</h4>
                            <p className="text-slate-600">г. Ноябрьск, ул. Изыскателей, д. 53</p>
                        </div>
                    </div>
                    <div className="flex items-start">
                        <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-brand-purple mr-4 flex-shrink-0">
                            <Phone size={20} />
                        </div>
                        <div>
                            <h4 className="font-bold text-slate-800">Телефон</h4>
                            <a href="tel:+79320990444" className="text-lg text-brand-purple font-medium hover:underline">+7 (932) 099-04-44</a>
                            <p className="text-xs text-slate-400 mt-1">Приём только по предварительной записи.</p>
                        </div>
                    </div>
                </div>

                {/* Working Hours Block */}
                <div className="bg-slate-50 p-6 rounded-2xl mb-6 border border-slate-100">
                    <div className="flex items-start mb-4">
                        <Clock className="text-brand-teal mr-3 flex-shrink-0" size={20} />
                        <div>
                            <h5 className="font-bold text-slate-800 mb-1">Часы работы и запись</h5>
                            <p className="text-sm text-slate-600">Активные часы для связи: с 10:00 до 21:00.</p>
                        </div>
                    </div>
                    <div className="text-sm text-slate-500 bg-white p-4 rounded-xl border border-slate-100">
                        <p className="mb-2"><strong>Важно:</strong> Если я не беру трубку, значит, веду приём.</p>
                        <p>Пожалуйста, напишите SMS или сообщение в мессенджер — я обязательно перезвоню вам в перерыве или после 21:00.</p>
                    </div>
                </div>

                <div className="flex gap-4">
                    <a href="https://vk.com/kineziolog_89" target="_blank" className="text-slate-400 hover:text-blue-500 transition"><MessageCircle /></a>
                    <a href="https://t.me/kinezio_cente" target="_blank" className="text-slate-400 hover:text-blue-400 transition"><Send /></a>
                </div>
            </div>
            <div className="rounded-[2rem] overflow-hidden shadow-lg h-96 md:h-auto relative bg-slate-200">
                {/* Map Placeholder */}
                <iframe
                    src="https://yandex.ru/map-widget/v1/?ll=75.450570%2C63.208419&z=16&pt=75.450570,63.208419,pm2rdm"
                    width="100%"
                    height="100%"
                    frameBorder="0"
                    className="absolute inset-0"
                ></iframe>
            </div>
        </div>
    </Section>
);

export default Contacts;
