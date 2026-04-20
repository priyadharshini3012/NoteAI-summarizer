import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import LandingPage from './components/LandingPage';
import Dashboard from './components/Dashboard';
import './App.css';

function App() {
  const [currentPage, setCurrentPage] = useState('landing');
  
  // Scroll to top on page change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [currentPage]);

  return (
    <div className={`app app--${currentPage}`}>
      <Navbar currentPage={currentPage} setCurrentPage={setCurrentPage} />
      <main className="app__main">
        <div
          className={`page-transition ${currentPage === 'landing' ? 'page-transition--visible' : 'page-transition--hidden'}`}
        >
          <LandingPage setCurrentPage={setCurrentPage} />
        </div>
        <div
          className={`page-transition ${currentPage === 'dashboard' ? 'page-transition--visible' : 'page-transition--hidden'}`}
        >
          <Dashboard />
        </div>
      </main>
    </div>
  );
}

export default App;