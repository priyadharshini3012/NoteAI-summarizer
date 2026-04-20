import React, { useState, useEffect } from 'react';
import './Navbar.css';

const Navbar = ({ currentPage, setCurrentPage }) => {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navigate = (page) => {
    setCurrentPage(page);
    setMenuOpen(false);
  };

  return (
    <nav className={`navbar ${scrolled ? 'navbar--scrolled' : ''}`}>
      <div className="navbar__container">
        {/* Logo */}
        <button className="navbar__logo" onClick={() => navigate('landing')} id="nav-logo">
          <div className="navbar__logo-icon">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M12 2L2 7l10 5 10-5-10-5z"/>
              <path d="M2 17l10 5 10-5"/>
              <path d="M2 12l10 5 10-5"/>
            </svg>
          </div>
          <span className="navbar__logo-text">NoteAI</span>
        </button>

        {/* Desktop Nav */}
        <div className="navbar__links">
          <button
            id="nav-home"
            className={`navbar__link ${currentPage === 'landing' ? 'navbar__link--active' : ''}`}
            onClick={() => navigate('landing')}
          >
            Home
          </button>
          <button
            id="nav-dashboard"
            className={`navbar__link ${currentPage === 'dashboard' ? 'navbar__link--active' : ''}`}
            onClick={() => navigate('dashboard')}
          >
            Dashboard
          </button>
        </div>

        {/* CTA Button */}
        <button
          id="nav-cta"
          className="navbar__cta"
          onClick={() => navigate('dashboard')}
        >
          <span>Launch App</span>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M5 12h14M12 5l7 7-7 7"/>
          </svg>
        </button>

        {/* Hamburger */}
        <button
          id="nav-hamburger"
          className={`navbar__hamburger ${menuOpen ? 'navbar__hamburger--open' : ''}`}
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle navigation"
        >
          <span></span><span></span><span></span>
        </button>
      </div>

      {/* Mobile Menu */}
      <div className={`navbar__mobile-menu ${menuOpen ? 'navbar__mobile-menu--open' : ''}`}>
        <button
          id="nav-home-mobile"
          className={`navbar__mobile-link ${currentPage === 'landing' ? 'navbar__mobile-link--active' : ''}`}
          onClick={() => navigate('landing')}
        >Home</button>
        <button
          id="nav-dashboard-mobile"
          className={`navbar__mobile-link ${currentPage === 'dashboard' ? 'navbar__mobile-link--active' : ''}`}
          onClick={() => navigate('dashboard')}
        >Dashboard</button>
        <button
          id="nav-cta-mobile"
          className="navbar__mobile-cta"
          onClick={() => navigate('dashboard')}
        >Launch App</button>
      </div>
    </nav>
  );
};

export default Navbar;
