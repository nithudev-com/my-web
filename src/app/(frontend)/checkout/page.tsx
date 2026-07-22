'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { processCheckout, CheckoutActionState, getCustomerCheckoutInfo } from './actions';
import { useCart } from '@/hooks/useCart';
import { revalidateCartTotals, RevalidatedCart, getShippingOptions, ShippingOption } from './cart-actions';
import { toast } from 'react-hot-toast';

export default function CheckoutPage() {
  const [loading, setLoading] = useState(false);
  const [summaryOpen, setSummaryOpen] = useState(false);
  const [billingSameAsShipping, setBillingSameAsShipping] = useState(true);
  const [savedAddresses, setSavedAddresses] = useState<any[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<string>('');
  
  const [customerEmail, setCustomerEmail] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [formState, setFormState] = useState<CheckoutActionState>({ success: false });

  // Auto-Save State
  const [addressState, setAddressState] = useState<Record<string, string>>({});
  
  const formatPhone = (val: string) => {
    const cleaned = ('' + val).replace(/\D/g, '');
    const match = cleaned.match(/^(\d{0,3})(\d{0,3})(\d{0,4})$/);
    if (!match) return val;
    if (!match[2]) return match[1];
    if (!match[3]) return `(${match[1]}) ${match[2]}`;
    return `(${match[1]}) ${match[2]}-${match[3]}`;
  };

  const saveDraft = (newValues: Record<string, string>) => {
    try {
      const current = JSON.parse(localStorage.getItem('checkout_draft') || '{}');
      const updated = { ...current, ...newValues };
      localStorage.setItem('checkout_draft', JSON.stringify(updated));
    } catch(e) {}
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhone(e.target.value);
    setCustomerPhone(formatted);
    saveDraft({ phone: formatted });
  };

  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setAddressState(prev => ({ ...prev, [e.target.name]: e.target.value }));
    saveDraft({ [e.target.name]: e.target.value });
  };

  // Legal Checkbox Refs & State
  const legalRef = useRef<HTMLInputElement>(null);
  const [legalError, setLegalError] = useState(false);

  // Shipping & Coupon State
  const [shippingOptions, setShippingOptions] = useState<ShippingOption[]>([]);
  const [selectedShippingId, setSelectedShippingId] = useState<string>('');
  const [couponInput, setCouponInput] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<string | undefined>(undefined);
  const [couponLoading, setCouponLoading] = useState(false);

  // Cart State
  const cart = useCart();
  const [validatedCart, setValidatedCart] = useState<RevalidatedCart | null>(null);
  const [cartLoading, setCartLoading] = useState(false);

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem('checkout_draft') || '{}');
      if (saved.email && !customerEmail) setCustomerEmail(saved.email);
      if (saved.phone && !customerPhone) setCustomerPhone(saved.phone);
      setAddressState(prev => ({ ...prev, ...saved }));
    } catch(e) {}

    getCustomerCheckoutInfo().then(info => {
      if (info.email) setCustomerEmail(info.email);
      if (info.phone) setCustomerPhone(info.phone);
      
      setSavedAddresses(info.addresses);
      if (info.addresses.length > 0) {
        setSelectedAddressId(info.addresses[0].id);
      }
    });

    getShippingOptions().then(options => {
      setShippingOptions(options);
      if (options.length > 0) {
        setSelectedShippingId(options[0].id);
      }
    });
  }, []);

  // Sync and Revalidate Cart
  useEffect(() => {
    if (!cart.isLoaded) return;
    
    const revalidate = async () => {
      setCartLoading(true);
      const result = await revalidateCartTotals(cart.items, selectedShippingId, appliedCoupon);
      setValidatedCart(result);
      setCartLoading(false);
    };

    revalidate();
  }, [cart.items, cart.isLoaded, selectedShippingId, appliedCoupon]);

  const handleApplyCoupon = async () => {
    if (!couponInput.trim()) return;
    setCouponLoading(true);
    
    // Test the coupon against the server
    const result = await revalidateCartTotals(cart.items, selectedShippingId, couponInput.trim());
    
    if (result.couponError) {
      toast.error(result.couponError, {
        duration: 4000,
        position: 'top-center',
        style: {
          background: 'rgba(255, 255, 255, 0.95)',
          color: '#1e293b',
          backdropFilter: 'blur(10px)',
          border: '1px solid #e2e8f0',
          boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
          borderRadius: '16px',
          padding: '16px 20px',
          fontWeight: 500,
          fontSize: '15px'
        },
        iconTheme: { primary: '#ef4444', secondary: '#fff' },
      });
      setAppliedCoupon(undefined);
    } else if (result.error && result.error.toLowerCase().includes('coupon')) {
      toast.error(result.error, {
        duration: 4000,
        position: 'top-center',
        style: {
          background: 'rgba(255, 255, 255, 0.95)',
          color: '#1e293b',
          backdropFilter: 'blur(10px)',
          border: '1px solid #e2e8f0',
          boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
          borderRadius: '16px',
          padding: '16px 20px',
          fontWeight: 500,
          fontSize: '15px'
        },
        iconTheme: { primary: '#ef4444', secondary: '#fff' },
      });
      setAppliedCoupon(undefined);
    } else {
      setAppliedCoupon(couponInput.trim());
      setCouponInput('');
    }
    
    setValidatedCart(result);
    setCouponLoading(false);
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(undefined);
    setCouponInput('');
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (cart.items.length === 0) {
      toast.error("Your cart is empty.", {
        duration: 3000,
        position: 'top-center',
        style: {
          background: 'rgba(255, 255, 255, 0.95)',
          color: '#1e293b',
          backdropFilter: 'blur(10px)',
          border: '1px solid #e2e8f0',
          boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
          borderRadius: '16px',
          padding: '16px 20px',
          fontWeight: 500,
          fontSize: '15px'
        }
      });
      return;
    }
    if (!selectedShippingId) {
      toast.error("Please select a shipping method.", {
        duration: 3000,
        position: 'top-center',
        style: {
          background: 'rgba(255, 255, 255, 0.95)',
          color: '#1e293b',
          backdropFilter: 'blur(10px)',
          border: '1px solid #e2e8f0',
          boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
          borderRadius: '16px',
          padding: '16px 20px',
          fontWeight: 500,
          fontSize: '15px'
        }
      });
      return;
    }

    const form = e.currentTarget;
    const acceptLegal = (form.elements.namedItem('acceptLegal') as HTMLInputElement).checked;

    setLegalError(!acceptLegal);

    if (!acceptLegal) {
      legalRef.current?.focus();
      return;
    }
    
    setLoading(true);
    setFormState({ success: false });

    const formData = new FormData(e.currentTarget);
    const result = await processCheckout(
      { success: false }, 
      formData, 
      JSON.stringify(cart.items), 
      selectedShippingId, 
      appliedCoupon
    );
    
    if (!result.success) {
      setFormState(result);
      setLoading(false);
      return;
    }

    const { orderNumber, amount, currency, merchantId, signature, token } = result.data;
    
    // Redirect to simulated Monirize checkout page
    const params = new URLSearchParams({
      merchantId,
      orderRef: orderNumber,
      amount: amount.toString(),
      currency,
      signature,
      token
    });

    window.location.href = `/monirize/mock?${params.toString()}`;
  };

  const getError = (field: string) => {
    if (!formState.errors) return null;
    return formState.errors[field] ? (
      <span style={{ color: '#E71C25', fontSize: '12px', marginTop: '4px', display: 'block', fontWeight: '600' }}>
        {formState.errors[field]}
      </span>
    ) : null;
  };

  const renderAddressFields = (prefix: 'shipping' | 'billing') => {
    if (prefix === 'shipping' && selectedAddressId) {
      const addr = savedAddresses.find(a => a.id === selectedAddressId);
      if (addr) {
        return (
          <>
            <input type="hidden" name={`${prefix}_firstName`} value={addr.firstName} />
            <input type="hidden" name={`${prefix}_lastName`} value={addr.lastName} />
            <input type="hidden" name={`${prefix}_addressLine1`} value={addr.addressLine1} />
            <input type="hidden" name={`${prefix}_city`} value={addr.city} />
            <input type="hidden" name={`${prefix}_state`} value={addr.state} />
            <input type="hidden" name={`${prefix}_postalCode`} value={addr.postalCode} />
            <input type="hidden" name={`${prefix}_country`} value={addr.country} />
            <div style={{ padding: '16px', background: '#f8fafc', border: '1px solid var(--co-border)', borderRadius: '12px', fontSize: '14px', lineHeight: '1.6', marginTop: '16px' }}>
              <strong>{addr.firstName} {addr.lastName}</strong><br/>
              {addr.addressLine1}<br/>
              {addr.city}, {addr.state} {addr.postalCode}<br/>
              {addr.country}
            </div>
          </>
        );
      }
    }

    return (
      <div className="checkout-grid" style={{ marginTop: '16px' }}>
        <div className="checkout-input-group">
          <label className="checkout-label">First Name *</label>
          <input name={`${prefix}_firstName`} type="text" className="checkout-input" autoComplete="given-name" value={addressState[`${prefix}_firstName`] || ''} onChange={handleAddressChange} />
          {getError(`${prefix}Address_firstName`)}
        </div>
        <div className="checkout-input-group">
          <label className="checkout-label">Last Name *</label>
          <input name={`${prefix}_lastName`} type="text" className="checkout-input" autoComplete="family-name" value={addressState[`${prefix}_lastName`] || ''} onChange={handleAddressChange} />
          {getError(`${prefix}Address_lastName`)}
        </div>
        <div className="checkout-input-group full" style={{ gridColumn: '1 / -1' }}>
          <label className="checkout-label">Address Line 1 *</label>
          <input name={`${prefix}_addressLine1`} type="text" className="checkout-input" autoComplete="address-line1" placeholder="Street address" value={addressState[`${prefix}_addressLine1`] || ''} onChange={handleAddressChange} />
          {getError(`${prefix}Address_addressLine1`)}
        </div>
        <div className="checkout-input-group">
          <label className="checkout-label">City *</label>
          <input name={`${prefix}_city`} type="text" className="checkout-input" autoComplete="address-level2" value={addressState[`${prefix}_city`] || ''} onChange={handleAddressChange} />
          {getError(`${prefix}Address_city`)}
        </div>
        <div className="checkout-input-group">
          <label className="checkout-label">State / Province *</label>
          <input name={`${prefix}_state`} type="text" className="checkout-input" autoComplete="address-level1" value={addressState[`${prefix}_state`] || ''} onChange={handleAddressChange} />
          {getError(`${prefix}Address_state`)}
        </div>
        <div className="checkout-input-group">
          <label className="checkout-label">Postal Code *</label>
          <input name={`${prefix}_postalCode`} type="text" className="checkout-input" autoComplete="postal-code" value={addressState[`${prefix}_postalCode`] || ''} onChange={handleAddressChange} />
          {getError(`${prefix}Address_postalCode`)}
        </div>
        <div className="checkout-input-group">
          <label className="checkout-label">Country *</label>
          <select name={`${prefix}_country`} className="checkout-input" autoComplete="country-name" value={addressState[`${prefix}_country`] || 'CA'} onChange={handleAddressChange}>
            <option value="CA">Canada</option>
          </select>
          {getError(`${prefix}Address_country`)}
        </div>
      </div>
    );
  };

  return (
    <div className="checkout-container">
      

      <header className="checkout-header">
        <Link href="/" className="checkout-header-logo">SexToys Lovers</Link>
      </header>

      {/* Mobile Toggle */}
      <div className="mobile-summary-toggle" onClick={() => setSummaryOpen(!summaryOpen)}>
        <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>
          {summaryOpen ? 'Hide order summary' : 'Show order summary'}
        </span>
        <span style={{ color: 'var(--co-black)', fontWeight: '800' }}>
          ${validatedCart?.totals.grandTotal.toFixed(2) || '0.00'}
        </span>
      </div>

      <main className="checkout-layout">
        {/* Left Side: Form */}
        <div className="checkout-main">
          <form onSubmit={handleSubmit} noValidate>
            
            {formState.message && (
              <div style={{ background: '#fef2f2', border: '1px solid #fecaca', padding: '16px', borderRadius: '12px', color: '#ef4444', fontSize: '15px', marginBottom: '24px', fontWeight: '600' }}>
                {formState.message}
              </div>
            )}

            <div className="checkout-card accordion-card active">
              <h2 className="checkout-title active-title">
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <span style={{ width: '28px', height: '28px', background: 'var(--co-pink)', color: 'white', borderRadius: '50%', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
                    1
                  </span>
                  Contact Information
                </div>
              </h2>
              <>
                  <div className="checkout-grid full">
                    <div className="checkout-input-group">
                      <label className="checkout-label">Email Address *</label>
                      <input name="email" type="email" className="checkout-input" placeholder="you@example.com" autoComplete="email" value={customerEmail} onChange={(e) => { setCustomerEmail(e.target.value); saveDraft({ email: e.target.value }); }} />
                      {getError('email')}
                    </div>
                    <div className="checkout-input-group">
                      <label className="checkout-label">Phone Number *</label>
                      <input name="phone" type="tel" className="checkout-input" placeholder="(555) 123-4567" autoComplete="tel" value={customerPhone} onChange={handlePhoneChange} />
                      {getError('phone')}
                    </div>
                  </div>
              </>
            </div>

            <div className="checkout-card accordion-card active">
              <h2 className="checkout-title active-title">
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <span style={{ width: '28px', height: '28px', background: 'var(--co-pink)', color: 'white', borderRadius: '50%', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
                    2
                  </span>
                  Shipping Details
                </div>
              </h2>
              <>
                  {savedAddresses.length > 0 && (
                    <div className="checkout-input-group full" style={{ marginBottom: '24px', paddingBottom: '24px', borderBottom: '1px solid var(--co-border)' }}>
                      <label className="checkout-label">Use Saved Address</label>
                      <select 
                        className="checkout-input" 
                        value={selectedAddressId} 
                        onChange={(e) => setSelectedAddressId(e.target.value)}
                      >
                        <option value="">-- Enter a new address --</option>
                        {savedAddresses.map(addr => (
                          <option key={addr.id} value={addr.id}>
                            {addr.firstName} {addr.lastName}, {addr.addressLine1}, {addr.city}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}

                  {renderAddressFields('shipping')}
                  
                  <div style={{ marginTop: '32px' }}>
                    <h3 style={{ fontSize: '16px', fontWeight: '700', marginBottom: '16px', color: 'var(--co-black)' }}>Shipping Method</h3>
                    {shippingOptions.length === 0 ? (
                      <div style={{ padding: '16px', background: '#fafafa', borderRadius: '8px', color: '#64748b' }}>Loading shipping options...</div>
                    ) : (
                      shippingOptions.map(option => (
                        <label key={option.id} className={`shipping-option ${selectedShippingId === option.id ? 'selected' : ''}`}>
                          <input 
                            type="radio" 
                            name="shippingMethodId" 
                            value={option.id}
                            checked={selectedShippingId === option.id}
                            onChange={(e) => setSelectedShippingId(e.target.value)}
                            style={{ accentColor: 'var(--co-pink)', width: '18px', height: '18px' }}
                          />
                          <div style={{ flex: 1 }}>
                            <div style={{ fontWeight: '600', color: 'var(--co-black)', fontSize: '15px' }}>{option.name}</div>
                            {option.estimatedDays && <div style={{ fontSize: '13px', color: '#64748b', marginTop: '2px' }}>{option.estimatedDays}</div>}
                          </div>
                          <div style={{ fontWeight: '700', color: 'var(--co-black)' }}>
                            {option.price === 0 ? 'Free' : `$${option.price.toFixed(2)}`}
                          </div>
                        </label>
                      ))
                    )}
                  </div>
              </>
            </div>

            <div className="checkout-card accordion-card active">
              <h2 className="checkout-title active-title">
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <span style={{ width: '28px', height: '28px', background: 'var(--co-pink)', color: 'white', borderRadius: '50%', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
                    3
                  </span>
                  Payment & Billing
                </div>
              </h2>
              <>
                  <p style={{ color: '#64748b', fontSize: '14px', marginBottom: '24px' }}>
                    All transactions are secure and encrypted. (Monirize Integration)
                  </p>
                  
                  <div style={{ background: '#fafafa', border: '1px solid var(--co-border)', borderRadius: '12px', padding: '24px', textAlign: 'center', marginBottom: '24px' }}>
                    <div style={{ padding: '20px', background: 'white', border: '1px dashed #cbd5e1', borderRadius: '8px', color: '#94a3b8' }}>
                      Monirize Payment Element
                    </div>
                  </div>

                  <div style={{ marginTop: '24px' }}>
                    <h3 style={{ fontSize: '16px', fontWeight: '700', marginBottom: '16px' }}>Billing Address</h3>
                    <div style={{ border: '1px solid var(--co-border)', borderRadius: '12px', overflow: 'hidden' }}>
                      <label style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '16px', background: billingSameAsShipping ? '#f8fafc' : 'white', cursor: 'pointer', borderBottom: billingSameAsShipping ? 'none' : '1px solid var(--co-border)' }}>
                        <input 
                          type="checkbox" 
                          name="billingSameAsShipping"
                          checked={billingSameAsShipping}
                          onChange={(e) => setBillingSameAsShipping(e.target.checked)}
                          style={{ width: '20px', height: '20px', accentColor: 'var(--co-pink)', cursor: 'pointer' }}
                        />
                        <span style={{ fontWeight: '600', fontSize: '15px' }}>Same as shipping address</span>
                      </label>
                      <div className={`billing-section ${!billingSameAsShipping ? 'expanded' : ''}`}>
                        <div className="billing-content">
                          <div style={{ padding: '24px', background: '#fafafa' }}>
                            {renderAddressFields('billing')}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div style={{ marginTop: '24px', display: 'flex', flexDirection: 'column', gap: '16px', background: '#fafafa', padding: '24px', borderRadius: '12px', border: '1px solid var(--co-border)' }}>
                    <h3 style={{ fontSize: '15px', fontWeight: '700', marginBottom: '8px' }}>Legal & Agreements</h3>
                    
                    <label style={{ display: 'flex', gap: '12px', alignItems: 'flex-start', cursor: 'pointer' }}>
                      <input type="checkbox" name="acceptLegal" ref={legalRef} style={{ marginTop: '4px', accentColor: 'var(--co-pink)', width: '16px', height: '16px' }} />
                      <div style={{ flex: 1 }}>
                        <span style={{ fontSize: '14px', fontWeight: '600' }}>I accept the Terms and Conditions, Privacy Policy, and confirm I meet the minimum legal age to purchase products. *</span>
                        {legalError && <div style={{ color: 'var(--co-red)', fontSize: '13px', marginTop: '4px', fontWeight: '600' }}>Please accept the legal agreements to continue.</div>}
                      </div>
                    </label>

                    <label style={{ display: 'flex', gap: '12px', alignItems: 'flex-start', cursor: 'pointer', marginTop: '8px', borderTop: '1px solid #e2e8f0', paddingTop: '16px' }}>
                      <input type="checkbox" name="marketingConsent" style={{ marginTop: '4px', accentColor: 'var(--co-pink)', width: '16px', height: '16px' }} />
                      <div style={{ flex: 1 }}>
                        <span style={{ fontSize: '14px', fontWeight: '500' }}>Send me news and offers (Optional)</span>
                      </div>
                    </label>
                  </div>

                  <div style={{ marginTop: '32px' }}>
                    <button type="submit" className="checkout-button" disabled={loading || cartLoading || cart.items.length === 0}>
                      {loading ? (
                        <>
                          <div className="spinner-icon"></div>
                          Verifying...
                        </>
                      ) : (
                        <>
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                          Pay ${validatedCart?.totals.grandTotal.toFixed(2) || '0.00'}
                        </>
                      )}
                    </button>
                    <div className="trust-badges">
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#059669', fontWeight: '700', fontSize: '12px' }}>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>
                        256-BIT SECURE
                      </div>
                      <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Visa_Inc._logo.svg/200px-Visa_Inc._logo.svg.png" className="trust-badge" alt="Visa" />
                      <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Mastercard-logo.svg/200px-Mastercard-logo.svg.png" className="trust-badge" alt="Mastercard" />
                      <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/f/fa/American_Express_logo_%282018%29.svg/200px-American_Express_logo_%282018%29.svg.png" className="trust-badge" alt="Amex" />
                    </div>
                  </div>
                </>
            </div>

          </form>
        </div>
        
        <div className="mobile-sticky-pay">
          <button type="button" onClick={(e) => { e.preventDefault(); const form = document.querySelector('form'); if(form) form.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true })); }} className="checkout-button" disabled={loading || cartLoading || cart.items.length === 0}>
            {loading ? 'Verifying...' : `Pay ${validatedCart?.totals.currency === 'CAD' ? 'CA$' : '$'}${validatedCart?.totals.grandTotal.toFixed(2) || '0.00'}`}
          </button>
        </div>

        {/* Right Side: Order Summary */}
        <div className={`checkout-sidebar ${summaryOpen ? 'open' : ''}`}>
          <div className="checkout-card" style={{ position: 'relative' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <h3 style={{ fontSize: '18px', fontWeight: '800', margin: 0, color: 'var(--co-black)' }}>Order Summary</h3>
              <Link href="/cart" style={{ color: 'var(--co-pink)', fontSize: '14px', fontWeight: '600', textDecoration: 'none' }}>Edit Cart</Link>
            </div>
            
            {cartLoading && !validatedCart ? (
              <div className="loader-ring"></div>
            ) : validatedCart?.items.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '40px 0', color: '#94a3b8' }}>
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" style={{ margin: '0 auto 16px', opacity: 0.5 }}><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>
                <p>Your cart is empty.</p>
              </div>
            ) : (
              <>
                {validatedCart?.error && (
                  <div style={{ background: '#fef2f2', color: '#ef4444', padding: '12px', borderRadius: '8px', fontSize: '13px', marginBottom: '16px' }}>
                    {validatedCart.error}
                  </div>
                )}

                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {validatedCart?.items.map(item => (
                    <div key={`${item.productId}-${item.variantId}`} className="summary-item">
                      <div style={{ display: 'flex', gap: '16px', flex: 1 }}>
                        <img src={item.imageUrl} alt={item.title} className="summary-img" />
                        <div style={{ flex: 1 }}>
                          <div style={{ fontWeight: '600', fontSize: '15px' }}>{item.title}</div>
                          {item.variantTitle && <div style={{ color: '#64748b', fontSize: '13px' }}>{item.variantTitle}</div>}
                          
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '8px' }}>
                            <div className="qty-controls">
                              <button type="button" className="qty-btn" onClick={() => cart.updateQuantity(item.productId, item.quantity - 1, item.variantId)}>-</button>
                              <span style={{ fontSize: '14px', fontWeight: '600', width: '20px', textAlign: 'center' }}>{item.quantity}</span>
                              <button type="button" className="qty-btn" onClick={() => cart.updateQuantity(item.productId, item.quantity + 1, item.variantId)}>+</button>
                            </div>
                            <span 
                              className="remove-link" 
                              onClick={() => cart.removeItem(item.productId, item.variantId)}
                            >
                              Remove
                            </span>
                          </div>
                        </div>
                      </div>
                      <div style={{ textAlign: 'right', marginLeft: '16px' }}>
                        <div style={{ fontWeight: '600' }}>${item.totalPrice.toFixed(2)}</div>
                        {item.originalPrice && (
                          <div style={{ color: '#94a3b8', fontSize: '12px', textDecoration: 'line-through' }}>
                            ${(item.originalPrice * item.quantity).toFixed(2)}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                <div style={{ marginTop: '24px', borderTop: '1px solid var(--co-border)', paddingTop: '24px' }}>
                  {appliedCoupon ? (
                    <div className="coupon-badge">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"></path><line x1="7" y1="7" x2="7.01" y2="7"></line></svg>
                      {validatedCart?.couponMessage || `Code applied: ${appliedCoupon}`}
                      <button className="coupon-remove" onClick={handleRemoveCoupon} aria-label="Remove coupon">×</button>
                    </div>
                  ) : (
                    <>
                      <h4 style={{ fontSize: '14px', fontWeight: '700', marginBottom: '8px' }}>Gift card or discount code</h4>
                      <div className="coupon-group">
                        <input 
                          type="text" 
                          className="checkout-input" 
                          style={{ flex: 1 }} 
                          placeholder="Enter code"
                          value={couponInput}
                          onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                        />
                        <button 
                          type="button" 
                          className="coupon-btn" 
                          onClick={handleApplyCoupon}
                          disabled={!couponInput || couponLoading || cartLoading}
                        >
                          {couponLoading ? '...' : 'Apply'}
                        </button>
                      </div>
                    </>
                  )}
                </div>

                <div style={{ marginTop: '24px', display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '14px', color: '#475569' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>Subtotal</span>
                    <span style={{ fontWeight: '600', color: 'var(--co-black)' }}>${validatedCart?.totals.subtotal.toFixed(2)}</span>
                  </div>
                  {validatedCart?.totals.discount && validatedCart.totals.discount > 0 ? (
                    <div style={{ display: 'flex', justifyContent: 'space-between', color: '#10b981' }}>
                      <span>Discount</span>
                      <span style={{ fontWeight: '600' }}>-${validatedCart.totals.discount.toFixed(2)}</span>
                    </div>
                  ) : null}
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>Shipping</span>
                    <span style={{ fontWeight: '600', color: 'var(--co-black)' }}>
                      {validatedCart?.totals.shipping === 0 ? 'Free' : `$${validatedCart?.totals.shipping.toFixed(2)}`}
                    </span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>Tax</span>
                    <span style={{ fontWeight: '600', color: 'var(--co-black)' }}>${validatedCart?.totals.tax.toFixed(2)}</span>
                  </div>
                </div>

                <div className="summary-total">
                  <span>Total</span>
                  <span style={{ color: 'var(--co-pink)' }}>
                    {validatedCart?.totals.currency === 'CAD' ? 'CA$' : '$'}{validatedCart?.totals.grandTotal.toFixed(2)}
                  </span>
                </div>
              </>
            )}

            {/* Overlay if revalidating */}
            {cartLoading && validatedCart && (
              <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(255,255,255,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10, borderRadius: '16px' }}>
                <div className="loader-ring"></div>
              </div>
            )}
          </div>
        </div>
      </main>

    </div>
  );
}
