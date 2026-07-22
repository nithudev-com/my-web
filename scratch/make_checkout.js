const fs = require('fs');
const file = fs.readFileSync('src/app/(frontend)/checkout/page.tsx', 'utf8');

let newFile = file;

// 1. Add state and helpers
const stateInjection = `  const [customerEmail, setCustomerEmail] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [formState, setFormState] = useState<CheckoutActionState>({ success: false });

  // Accordion & Auto-Save State
  const [activeStep, setActiveStep] = useState(1);
  const [addressState, setAddressState] = useState<Record<string, string>>({});
  
  const formatPhone = (val: string) => {
    const cleaned = ('' + val).replace(/\\D/g, '');
    const match = cleaned.match(/^(\\d{0,3})(\\d{0,3})(\\d{0,4})$/);
    if (!match) return val;
    if (!match[2]) return match[1];
    if (!match[3]) return \`(\${match[1]}) \${match[2]}\`;
    return \`(\${match[1]}) \${match[2]}-\${match[3]}\`;
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhone(e.target.value);
    setCustomerPhone(formatted);
    saveDraft({ phone: formatted });
  };

  const saveDraft = (newValues: Record<string, string>) => {
    try {
      const current = JSON.parse(localStorage.getItem('checkout_draft') || '{}');
      const updated = { ...current, ...newValues };
      localStorage.setItem('checkout_draft', JSON.stringify(updated));
    } catch(e) {}
  };

  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setAddressState(prev => ({ ...prev, [e.target.name]: e.target.value }));
    saveDraft({ [e.target.name]: e.target.value });
  };

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem('checkout_draft') || '{}');
      if (saved.email && !customerEmail) setCustomerEmail(saved.email);
      if (saved.phone && !customerPhone) setCustomerPhone(saved.phone);
      setAddressState(prev => ({ ...prev, ...saved }));
    } catch(e) {}
  }, []);
`;

newFile = newFile.replace(
  `  const [customerEmail, setCustomerEmail] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [formState, setFormState] = useState<CheckoutActionState>({ success: false });`,
  stateInjection
);

// 2. Update renderAddressFields
const oldRenderAddress = `    return (
      <div className="checkout-grid" style={{ marginTop: '16px' }}>
        <div className="checkout-input-group">
          <label className="checkout-label">First Name *</label>
          <input name={\`\${prefix}_firstName\`} type="text" className="checkout-input" autoComplete="given-name" />
          {getError(\`\${prefix}Address_firstName\`)}
        </div>
        <div className="checkout-input-group">
          <label className="checkout-label">Last Name *</label>
          <input name={\`\${prefix}_lastName\`} type="text" className="checkout-input" autoComplete="family-name" />
          {getError(\`\${prefix}Address_lastName\`)}
        </div>
        <div className="checkout-input-group full" style={{ gridColumn: '1 / -1' }}>
          <label className="checkout-label">Address Line 1 *</label>
          <input name={\`\${prefix}_addressLine1\`} type="text" className="checkout-input" autoComplete="address-line1" placeholder="Street address" />
          {getError(\`\${prefix}Address_addressLine1\`)}
        </div>
        <div className="checkout-input-group">
          <label className="checkout-label">City *</label>
          <input name={\`\${prefix}_city\`} type="text" className="checkout-input" autoComplete="address-level2" />
          {getError(\`\${prefix}Address_city\`)}
        </div>
        <div className="checkout-input-group">
          <label className="checkout-label">State / Province *</label>
          <input name={\`\${prefix}_state\`} type="text" className="checkout-input" autoComplete="address-level1" />
          {getError(\`\${prefix}Address_state\`)}
        </div>
        <div className="checkout-input-group">
          <label className="checkout-label">Postal Code *</label>
          <input name={\`\${prefix}_postalCode\`} type="text" className="checkout-input" autoComplete="postal-code" />
          {getError(\`\${prefix}Address_postalCode\`)}
        </div>
        <div className="checkout-input-group">
          <label className="checkout-label">Country *</label>
          <select name={\`\${prefix}_country\`} className="checkout-input" autoComplete="country-name" defaultValue="US">
            <option value="US">United States</option>
            <option value="CA">Canada</option>
            <option value="GB">United Kingdom</option>
          </select>
          {getError(\`\${prefix}Address_country\`)}
        </div>
      </div>
    );`;

const newRenderAddress = `    return (
      <div className="checkout-grid" style={{ marginTop: '16px' }}>
        <div className="checkout-input-group">
          <label className="checkout-label">First Name *</label>
          <input name={\`\${prefix}_firstName\`} type="text" className="checkout-input" autoComplete="given-name" value={addressState[\`\${prefix}_firstName\`] || ''} onChange={handleAddressChange} />
          {getError(\`\${prefix}Address_firstName\`)}
        </div>
        <div className="checkout-input-group">
          <label className="checkout-label">Last Name *</label>
          <input name={\`\${prefix}_lastName\`} type="text" className="checkout-input" autoComplete="family-name" value={addressState[\`\${prefix}_lastName\`] || ''} onChange={handleAddressChange} />
          {getError(\`\${prefix}Address_lastName\`)}
        </div>
        <div className="checkout-input-group full" style={{ gridColumn: '1 / -1' }}>
          <label className="checkout-label">Address Line 1 *</label>
          <input name={\`\${prefix}_addressLine1\`} type="text" className="checkout-input" autoComplete="address-line1" placeholder="Street address" value={addressState[\`\${prefix}_addressLine1\`] || ''} onChange={handleAddressChange} />
          {getError(\`\${prefix}Address_addressLine1\`)}
        </div>
        <div className="checkout-input-group">
          <label className="checkout-label">City *</label>
          <input name={\`\${prefix}_city\`} type="text" className="checkout-input" autoComplete="address-level2" value={addressState[\`\${prefix}_city\`] || ''} onChange={handleAddressChange} />
          {getError(\`\${prefix}Address_city\`)}
        </div>
        <div className="checkout-input-group">
          <label className="checkout-label">State / Province *</label>
          <input name={\`\${prefix}_state\`} type="text" className="checkout-input" autoComplete="address-level1" value={addressState[\`\${prefix}_state\`] || ''} onChange={handleAddressChange} />
          {getError(\`\${prefix}Address_state\`)}
        </div>
        <div className="checkout-input-group">
          <label className="checkout-label">Postal Code *</label>
          <input name={\`\${prefix}_postalCode\`} type="text" className="checkout-input" autoComplete="postal-code" value={addressState[\`\${prefix}_postalCode\`] || ''} onChange={handleAddressChange} />
          {getError(\`\${prefix}Address_postalCode\`)}
        </div>
        <div className="checkout-input-group">
          <label className="checkout-label">Country *</label>
          <select name={\`\${prefix}_country\`} className="checkout-input" autoComplete="country-name" value={addressState[\`\${prefix}_country\`] || 'US'} onChange={handleAddressChange}>
            <option value="US">United States</option>
            <option value="CA">Canada</option>
            <option value="GB">United Kingdom</option>
          </select>
          {getError(\`\${prefix}Address_country\`)}
        </div>
      </div>
    );`;

newFile = newFile.replace(oldRenderAddress, newRenderAddress);


// 3. Add CSS for accordion and sticky button and badges
const oldCSS = `        .checkout-title { font-size: 20px; font-weight: 800; margin-bottom: 24px; color: var(--co-plum); display: flex; align-items: center; gap: 8px; }`;
const newCSS = \`        .accordion-card { transition: all 0.3s ease; }
        .accordion-card:not(.active) { cursor: pointer; padding: 20px 32px; background: #fafafa; border-color: transparent; }
        .accordion-card:not(.active):hover { background: #f1f5f9; }
        .checkout-title { font-size: 20px; font-weight: 800; margin: 0; color: var(--co-plum); display: flex; align-items: center; justify-content: space-between; gap: 8px; width: 100%; transition: 0.3s; }
        .checkout-title.active-title { margin-bottom: 24px; }
        .trust-badges { display: flex; align-items: center; justify-content: center; gap: 16px; margin-top: 24px; padding-top: 16px; border-top: 1px dashed var(--co-border); }
        .trust-badge { height: 28px; opacity: 0.8; filter: grayscale(100%); transition: 0.3s; }
        .trust-badge:hover { opacity: 1; filter: grayscale(0%); }
        .mobile-sticky-pay { display: none; position: fixed; bottom: 0; left: 0; right: 0; padding: 16px; background: var(--co-white); border-top: 1px solid var(--co-border); box-shadow: 0 -10px 20px rgba(0,0,0,0.05); z-index: 100; }
        @media (max-width: 900px) {
          .mobile-sticky-pay { display: block; }
          .checkout-container { padding-bottom: 100px; }
        }\`;
newFile = newFile.replace(oldCSS, newCSS);


// 4. Accordion HTML for steps
const step1Old = \`            <div className="checkout-card">
              <h2 className="checkout-title">
                <span style={{ width: '28px', height: '28px', background: 'var(--co-pink)', color: 'white', borderRadius: '50%', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px' }}>1</span>
                Contact Information
              </h2>
              <div className="checkout-grid full">
                <div className="checkout-input-group">
                  <label className="checkout-label">Email Address *</label>
                  <input name="email" type="email" className="checkout-input" placeholder="you@example.com" autoComplete="email" value={customerEmail} onChange={(e) => setCustomerEmail(e.target.value)} />
                  {getError('email')}
                </div>
                <div className="checkout-input-group">
                  <label className="checkout-label">Phone Number *</label>
                  <input name="phone" type="tel" className="checkout-input" placeholder="(555) 123-4567" autoComplete="tel" value={customerPhone} onChange={(e) => setCustomerPhone(e.target.value)} />
                  {getError('phone')}
                </div>
              </div>
            </div>\`;

const step1New = \`            <div className={\`checkout-card accordion-card \${activeStep === 1 ? 'active' : ''}\`} onClick={() => activeStep !== 1 && setActiveStep(1)}>
              <h2 className={\`checkout-title \${activeStep === 1 ? 'active-title' : ''}\`}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <span style={{ width: '28px', height: '28px', background: activeStep >= 1 ? 'var(--co-pink)' : '#cbd5e1', color: 'white', borderRadius: '50%', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px' }}>1</span>
                  Contact Information
                </div>
                {activeStep > 1 && <span style={{ fontSize: '13px', color: 'var(--co-pink)', fontWeight: '600' }}>Edit</span>}
              </h2>
              {activeStep === 1 && (
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
                  <button type="button" className="checkout-button" onClick={() => { if(customerEmail && customerPhone) setActiveStep(2); else toast.error('Please fill out your contact info.') }} style={{ marginTop: '24px' }}>Continue to Shipping</button>
                </>
              )}
            </div>\`;

newFile = newFile.replace(step1Old, step1New);

// Step 2 & 3
const step2Old = \`            <div className="checkout-card">
              <h2 className="checkout-title">
                <span style={{ width: '28px', height: '28px', background: 'var(--co-pink)', color: 'white', borderRadius: '50%', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px' }}>2</span>
                Shipping Details
              </h2>\`;

const step2New = \`            <div className={\`checkout-card accordion-card \${activeStep === 2 ? 'active' : ''}\`} onClick={() => activeStep !== 2 && setActiveStep(2)}>
              <h2 className={\`checkout-title \${activeStep === 2 ? 'active-title' : ''}\`}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <span style={{ width: '28px', height: '28px', background: activeStep >= 2 ? 'var(--co-pink)' : '#cbd5e1', color: 'white', borderRadius: '50%', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px' }}>2</span>
                  Shipping Details
                </div>
                {activeStep > 2 && <span style={{ fontSize: '13px', color: 'var(--co-pink)', fontWeight: '600' }}>Edit</span>}
              </h2>
              {activeStep === 2 && (\`;

newFile = newFile.replace(step2Old, step2New);


const step2End = \`                    </label>
                  ))
                )}
              </div>

            </div>\`;

const step2EndNew = \`                    </label>
                  ))
                )}
              </div>
              <button type="button" className="checkout-button" onClick={() => { if(selectedShippingId) setActiveStep(3); else toast.error('Please select shipping.') }} style={{ marginTop: '24px' }}>Continue to Payment</button>
              )}
            </div>\`;
newFile = newFile.replace(step2End, step2EndNew);

const step3Old = \`            <div className="checkout-card">
              <h2 className="checkout-title">
                <span style={{ width: '28px', height: '28px', background: 'var(--co-pink)', color: 'white', borderRadius: '50%', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px' }}>3</span>
                Payment & Billing
              </h2>\`;
const step3New = \`            <div className={\`checkout-card accordion-card \${activeStep === 3 ? 'active' : ''}\`} onClick={() => activeStep !== 3 && setActiveStep(3)}>
              <h2 className={\`checkout-title \${activeStep === 3 ? 'active-title' : ''}\`}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <span style={{ width: '28px', height: '28px', background: activeStep >= 3 ? 'var(--co-pink)' : '#cbd5e1', color: 'white', borderRadius: '50%', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px' }}>3</span>
                  Payment & Billing
                </div>
              </h2>
              {activeStep === 3 && (\`;
newFile = newFile.replace(step3Old, step3New);

const step3EndOld = \`                  )}
                </button>
              </div>
            </div>\`;
const step3EndNew = \`                  )}
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
              )}
            </div>\`;
newFile = newFile.replace(step3EndOld, step3EndNew);

// Sticky Mobile Button at the very end of main
const endOfMainOld = \`        </div>

        {/* Right Side: Order Summary */}\`;

const endOfMainNew = \`          <div className="mobile-sticky-pay">
            <button type="submit" onClick={(e) => { e.preventDefault(); const form = document.querySelector('form'); if(form) form.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true })); }} className="checkout-button" disabled={loading || cartLoading || cart.items.length === 0}>
              {loading ? 'Verifying...' : \`Pay \${validatedCart?.totals.currency === 'CAD' ? 'CA$' : '$'}\${validatedCart?.totals.grandTotal.toFixed(2) || '0.00'}\`}
            </button>
          </div>
        </div>

        {/* Right Side: Order Summary */}\`;

newFile = newFile.replace(endOfMainOld, endOfMainNew);

fs.writeFileSync('src/app/(frontend)/checkout/page.tsx', newFile);

console.log("Successfully rebuilt checkout page");
