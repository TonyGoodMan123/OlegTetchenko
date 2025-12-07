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
import Modal from './components/Modal';

function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="font-sans text-slate-800 antialiased pb-20 md:pb-0">
      <Header onOpenModal={() => setIsModalOpen(true)} />

      <main>
        <Hero onOpenModal={() => setIsModalOpen(true)} />
        <Problems onOpenModal={() => setIsModalOpen(true)} />
        <Method onOpenModal={() => setIsModalOpen(true)} />
        <Steps onOpenModal={() => setIsModalOpen(true)} />
        <Doubts />
        <Cases onOpenModal={() => setIsModalOpen(true)} />
        <About onOpenModal={() => setIsModalOpen(true)} />
        <Contacts onOpenModal={() => setIsModalOpen(true)} />
      </main>

      <Footer />

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
}

export default App;
