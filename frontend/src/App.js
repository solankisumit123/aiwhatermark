import React from 'react';
import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Header from './components/site/Header';
import Hero from './components/site/Hero';
import PixelAccurate from './components/site/PixelAccurate';
import HowTo from './components/site/HowTo';
import Toolkit from './components/site/Toolkit';
import Workflow from './components/site/Workflow';
import { FAQ, FinalCTA, Footer } from './components/site/FAQ';
import { Toaster } from './components/ui/sonner';

const Landing = () => (
  <div className="min-h-screen bg-[#f5f5f7] text-neutral-900 antialiased">
    <Header />
    <main>
      <Hero />
      <PixelAccurate />
      <HowTo />
      <Toolkit />
      <Workflow />
      <FAQ />
      <FinalCTA />
    </main>
    <Footer />
    <Toaster position="bottom-right" />
  </div>
);

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Landing />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
