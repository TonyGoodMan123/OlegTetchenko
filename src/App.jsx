import React, { useState } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import Problems from './components/Problems';
import Method from './components/Method';
import Steps from './components/Steps';
import Doubts from './components/Doubts';
import Cases from './components/Cases';
import About from './components/About';
import Contacts from './components/Contacts';
import Footer from './components/Footer';
import MobileStickyCTA from './components/MobileStickyCTA';
import Modal from './components/Modal';

function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = () => {
    try {
      if (typeof window.ym === 'function') {
        window.ym(106065947, 'reachGoal', 'consult_open');
      }
    } catch (e) {
      console.warn('Metrika goal tracking failed', e);
    }
    setIsModalOpen(true);
  };

  return (
    <div className="font-sans text-slate-800 antialiased pb-20 md:pb-0">
      <Header onOpenModal={handleOpenModal} />

      <main>
        <Hero onOpenModal={handleOpenModal} />
        <Problems onOpenModal={handleOpenModal} />
        <Method onOpenModal={handleOpenModal} />
        <Steps onOpenModal={handleOpenModal} />
        <Doubts />
        <Cases onOpenModal={handleOpenModal} />
        <About onOpenModal={handleOpenModal} />
        <Contacts onOpenModal={handleOpenModal} />
      </main>

      <MobileStickyCTA onOpenModal={handleOpenModal} />
      <Footer />

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
}

export default App;
