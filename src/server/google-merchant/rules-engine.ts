import "server-only";

export function evaluateRules(product: any, rules: any[]) {
  // A robust local rules engine implementation
  // This modifies the product payload based on custom logic before sending to Google
  const overrides: any = {};
  
  for (const rule of rules) {
    if (!rule.active) continue;
    
    // Evaluate conditions
    let match = true;
    for (const condition of rule.conditions) {
      if (condition.field === "category" && product.category?.name !== condition.value) match = false;
      if (condition.field === "brand" && product.brand?.name !== condition.value) match = false;
      if (condition.field === "price_greater_than" && Number(product.basePrice) <= Number(condition.value)) match = false;
      // more condition types...
    }
    
    if (match) {
      // Apply actions
      for (const action of rule.actions) {
        if (action.type === "set_google_category") overrides.googleProductCategory = action.value;
        if (action.type === "set_custom_label") overrides[`customLabel${action.index}`] = action.value;
        if (action.type === "exclude") overrides.exclude = true;
      }
    }
  }

  return overrides;
}
