import React from 'react';
import './LandingPage.css';

const LandingPage = ({ onGetStarted }) => {
  return (
    <div className="landing-page">
      <nav className="landing-nav">
        <div className="nav-content">
          <div className="logo">
            <span className="logo-icon">💰</span>
            <span className="logo-text">Expency</span>
          </div>
          <button className="btn-nav-login" onClick={onGetStarted}>
            Login / Sign Up
          </button>
        </div>
      </nav>

      <section className="hero-section">
        <div className="hero-content">
          <div className="hero-text">
            <h1 className="hero-title">
              Track Your Expenses,
              <span className="highlight"> Master Your Money</span>
            </h1>
            <p className="hero-subtitle">
              The ultimate expense tracker designed for Indian college students. 
              Smart budgeting, AI-powered suggestions, and complete financial control.
            </p>
            <div className="hero-buttons">
              <button className="btn-primary" onClick={onGetStarted}>
                Get Started Free
              </button>
              <button className="btn-secondary" onClick={() => {
                document.getElementById('features').scrollIntoView({ behavior: 'smooth' });
              }}>
                Learn More
              </button>
            </div>
            <div className="hero-stats">
              <div className="stat">
                <span className="stat-number">100%</span>
                <span className="stat-label">Free Forever</span>
              </div>
              <div className="stat">
                <span className="stat-number">₹8K+</span>
                <span className="stat-label">Avg. Savings</span>
              </div>
              <div className="stat">
                <span className="stat-number">5 Min</span>
                <span className="stat-label">Setup Time</span>
              </div>
            </div>
          </div>
          <div className="hero-image">
            <div className="expense-cards-showcase">
              <div className="expense-card-demo card-1">
                <div className="card-emoji">🍽️</div>
                <div className="card-details">
                  <span className="card-desc">Lunch at Canteen</span>
                  <span className="card-amount">₹150</span>
                </div>
                <div className="card-category">Food & Snacks</div>
              </div>
              <div className="expense-card-demo card-2">
                <div className="card-emoji">🚗</div>
                <div className="card-details">
                  <span className="card-desc">Auto to College</span>
                  <span className="card-amount">₹50</span>
                </div>
                <div className="card-category">Transport</div>
              </div>
              <div className="expense-card-demo card-3">
                <div className="card-emoji">📚</div>
                <div className="card-details">
                  <span className="card-desc">Engineering Book</span>
                  <span className="card-amount">₹450</span>
                </div>
                <div className="card-category">Study Materials</div>
              </div>
              <div className="stats-overlay">
                <div className="overlay-stat">
                  <span className="overlay-number">₹6,450</span>
                  <span className="overlay-label">This Month</span>
                </div>
                <div className="overlay-chart">
                  <div className="chart-bar" style={{ height: '60%' }}></div>
                  <div className="chart-bar" style={{ height: '80%' }}></div>
                  <div className="chart-bar" style={{ height: '45%' }}></div>
                  <div className="chart-bar" style={{ height: '90%' }}></div>
                  <div className="chart-bar" style={{ height: '70%' }}></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="features" className="features-section">
        <div className="section-header">
          <h2>Everything You Need to Manage Your Money</h2>
          <p>Powerful features designed specifically for college students</p>
        </div>
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">📱</div>
            <h3>Easy Expense Tracking</h3>
            <p>Add expenses in seconds with our intuitive interface. Track every rupee spent on food, transport, shopping, and more.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">📊</div>
            <h3>Visual Analytics</h3>
            <p>Beautiful charts and graphs show exactly where your money goes. Understand your spending patterns at a glance.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">💡</div>
            <h3>Smart Suggestions</h3>
            <p>AI-powered insights help you save money. Get personalized tips based on your spending habits.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🎯</div>
            <h3>Custom Budgets</h3>
            <p>Set your own budget goals and track progress. Stay on top of your financial targets every month.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">📄</div>
            <h3>PDF Reports</h3>
            <p>Download detailed monthly reports. Perfect for sharing with parents or tracking your progress.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🔒</div>
            <h3>Secure & Private</h3>
            <p>Your data is encrypted and protected. We take your privacy seriously with industry-standard security.</p>
          </div>
        </div>
      </section>

      <section className="categories-section">
        <div className="section-header">
          <h2>Made for Student Life</h2>
          <p>Pre-configured categories that match your lifestyle</p>
        </div>
        <div className="categories-showcase">
          <div className="category-tag">🍽️ Food & Snacks</div>
          <div className="category-tag">🚗 Transport</div>
          <div className="category-tag">📚 Study Materials</div>
          <div className="category-tag">🎮 Entertainment</div>
          <div className="category-tag">🛍️ Shopping</div>
          <div className="category-tag">📱 Recharge & Internet</div>
          <div className="category-tag">🏠 Hostel/Rent</div>
          <div className="category-tag">💊 Medical</div>
          <div className="category-tag">💇 Grooming</div>
        </div>
      </section>

      <section className="benefits-section">
        <div className="section-header">
          <h2>Why Students Love Expency</h2>
        </div>
        <div className="benefits-grid">
          <div className="benefit-item">
            <span className="benefit-icon">✓</span>
            <span className="benefit-text">No complex setup - start tracking in minutes</span>
          </div>
          <div className="benefit-item">
            <span className="benefit-icon">✓</span>
            <span className="benefit-text">Works on any device - phone, tablet, or laptop</span>
          </div>
          <div className="benefit-item">
            <span className="benefit-icon">✓</span>
            <span className="benefit-text">No credit card required - completely free</span>
          </div>
          <div className="benefit-item">
            <span className="benefit-icon">✓</span>
            <span className="benefit-text">Multiple payment modes - UPI, Cash, Card, Net Banking</span>
          </div>
          <div className="benefit-item">
            <span className="benefit-icon">✓</span>
            <span className="benefit-text">Monthly insights help you save ₹500-2000</span>
          </div>
          <div className="benefit-item">
            <span className="benefit-icon">✓</span>
            <span className="benefit-text">Edit or delete expenses anytime</span>
          </div>
        </div>
      </section>

      <section className="cta-section">
        <div className="cta-content">
          <h2>Ready to Take Control of Your Finances?</h2>
          <p>Join students across India who are managing their money better with Expency</p>
          <button className="btn-cta" onClick={onGetStarted}>
            Start Tracking Now - It's Free!
          </button>
          <p className="cta-note">No credit card required • Set up in under 5 minutes</p>
        </div>
      </section>

      <footer className="landing-footer">
        <div className="footer-content">
          <div className="footer-brand">
            <span className="logo-icon">💰</span>
            <span className="logo-text">Expency</span>
          </div>
          <p className="footer-text">Making financial management simple for students</p>
          <p className="footer-copy">© 2026 Expency. Built with ❤️ for students.</p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
