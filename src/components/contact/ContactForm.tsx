'use client';

import { useState } from 'react';

interface ContactFormProps {
  initialProductSlug?: string;
}

export function ContactForm({ initialProductSlug }: ContactFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    productSlug: initialProductSlug || '',
    message: initialProductSlug
      ? `Hello, I'd like to check availability and details for the product (${initialProductSlug}).`
      : '',
    consent: true,
    website: '', // honeypot
  });

  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('submitting');
    setErrorMessage('');

    try {
      const res = await fetch('/api/enquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || 'Failed to submit enquiry.');
      }

      setStatus('success');
    } catch (err: any) {
      setStatus('error');
      setErrorMessage(err.message || 'Something went wrong. Please try again.');
    }
  };

  if (status === 'success') {
    return (
      <div className="bg-ivory p-6 border border-wine/20 rounded-sm text-center">
        <span className="w-10 h-10 bg-wine/10 text-wine rounded-full inline-flex items-center justify-center mb-3">
          ✓
        </span>
        <h3 className="font-serif text-xl text-espresso mb-2">Enquiry Received</h3>
        <p className="text-sm text-espresso/70 mb-4">
          Thank you for reaching out. We have logged your enquiry and our team will get in touch with you soon.
        </p>
        <button
          onClick={() => {
            setStatus('idle');
            setFormData({
              name: '',
              email: '',
              phone: '',
              productSlug: '',
              message: '',
              consent: true,
              website: '',
            });
          }}
          className="text-xs font-mono uppercase tracking-wider text-wine underline hover:text-espresso"
        >
          Send another message
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Honeypot field - visually hidden */}
      <div className="hidden" aria-hidden="true">
        <label htmlFor="website">Website</label>
        <input
          type="text"
          id="website"
          value={formData.website}
          onChange={(e) => setFormData({ ...formData, website: e.target.value })}
          tabIndex={-1}
          autoComplete="off"
        />
      </div>

      <div>
        <label htmlFor="name" className="block text-xs font-mono uppercase tracking-wider text-espresso/70 mb-1">
          Your Name <span className="text-wine">*</span>
        </label>
        <input
          type="text"
          id="name"
          required
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className="w-full px-4 py-2.5 bg-ivory border border-espresso/20 rounded-sm text-sm text-espresso focus:outline-none focus:border-wine"
          placeholder="e.g. Maya Sharma"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="email" className="block text-xs font-mono uppercase tracking-wider text-espresso/70 mb-1">
            Email Address
          </label>
          <input
            type="email"
            id="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className="w-full px-4 py-2.5 bg-ivory border border-espresso/20 rounded-sm text-sm text-espresso focus:outline-none focus:border-wine"
            placeholder="maya@example.com"
          />
        </div>
        <div>
          <label htmlFor="phone" className="block text-xs font-mono uppercase tracking-wider text-espresso/70 mb-1">
            Phone / WhatsApp
          </label>
          <input
            type="tel"
            id="phone"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            className="w-full px-4 py-2.5 bg-ivory border border-espresso/20 rounded-sm text-sm text-espresso focus:outline-none focus:border-wine"
            placeholder="+91 98765 43210"
          />
        </div>
      </div>

      <div>
        <label htmlFor="productSlug" className="block text-xs font-mono uppercase tracking-wider text-espresso/70 mb-1">
          Product of Interest (Optional)
        </label>
        <input
          type="text"
          id="productSlug"
          value={formData.productSlug}
          onChange={(e) => setFormData({ ...formData, productSlug: e.target.value })}
          className="w-full px-4 py-2.5 bg-ivory border border-espresso/20 rounded-sm text-sm text-espresso focus:outline-none focus:border-wine"
          placeholder="e.g. forma-structured-handbag"
        />
      </div>

      <div>
        <label htmlFor="message" className="block text-xs font-mono uppercase tracking-wider text-espresso/70 mb-1">
          Message <span className="text-wine">*</span>
        </label>
        <textarea
          id="message"
          required
          rows={4}
          value={formData.message}
          onChange={(e) => setFormData({ ...formData, message: e.target.value })}
          className="w-full px-4 py-2.5 bg-ivory border border-espresso/20 rounded-sm text-sm text-espresso focus:outline-none focus:border-wine resize-none"
          placeholder="Let us know what details you'd like to confirm..."
        />
      </div>

      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          id="consent"
          checked={formData.consent}
          onChange={(e) => setFormData({ ...formData, consent: e.target.checked })}
          className="rounded border-espresso/30 text-wine focus:ring-wine"
        />
        <label htmlFor="consent" className="text-xs text-espresso/60">
          I consent to CARRYFORM contacting me regarding my enquiry.
        </label>
      </div>

      {status === 'error' && (
        <p className="text-xs text-wine font-mono">{errorMessage}</p>
      )}

      <button
        type="submit"
        disabled={status === 'submitting'}
        className="w-full py-3.5 bg-wine text-white text-xs font-mono uppercase tracking-widest rounded-sm hover:bg-wine/90 transition-colors disabled:opacity-50"
      >
        {status === 'submitting' ? 'Submitting Enquiry...' : 'Submit Enquiry'}
      </button>
    </form>
  );
}

