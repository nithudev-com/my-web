'use client';

import React from 'react';

export function NewsletterForm() {
  return (
    <form className="footer-newsletter-form" onSubmit={(e) => e.preventDefault()}>
      <input type="email" placeholder="Enter your email..." className="footer-newsletter-input" required />
      <button type="submit" className="footer-newsletter-btn">Join</button>
    </form>
  );
}
