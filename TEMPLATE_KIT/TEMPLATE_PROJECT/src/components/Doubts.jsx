import React from 'react';
import { MessageCircle, Send, User } from './ui/icons';
import Button from './ui/Button';

const Doubts = () => (
    <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto bg-white rounded-[2.5rem] p-8 md:p-12 shadow-xl border border-slate-100 text-center relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-brand-purple to-brand-teal"></div>

            <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6 text-slate-400">
                <MessageCircle size={32} />
            </div>

            <h3 className="text-2xl md:text-3xl font-serif font-bold text-slate-800 mb-4">
                Сомневаетесь или стесняетесь?
            </h3>
            <p className="text-slate-600 max-w-2xl mx-auto mb-8 leading-relaxed">
                Это нормально. Иногда проще сначала задать вопрос в сообщении.
                Напишите мне, коротко опишите жалобы и спросите, подойдёт ли вам мой подход.
                <br className="hidden md:block" />
                <span className="font-medium text-brand-purple block mt-2">Наша переписка — только между вами и мной. Конфиденциальность гарантирована.</span>
            </p>

            <p className="text-sm font-medium text-slate-800 mb-4">Задайте вопрос в личном чате:</p>

            <div className="flex flex-col sm:flex-row justify-center gap-4">
                <Button
                    variant="outline"
                    className="text-sm"
                    icon={Send}
                    onClick={() => window.open('http://t.me/kineziolog89', '_blank')}
                >
                    Написать в Telegram
                </Button>
                <Button
                    variant="outline"
                    className="text-sm"
                    icon={MessageCircle}
                    onClick={() => window.open('https://vk.com/kineziolog_89', '_blank')}
                >
                    Написать в VK
                </Button>
            </div>


        </div>
    </section>
);

export default Doubts;
