'use client';
import React from 'react';

// Props based on Bold's documentation and our server action
interface BoldButtonProps {
  apiKey: string;
  orderId: string;
  amount: number;
  currency: string;
  signature: string;
  redirectionUrl: string;
  description: string;
  customerData: string; // JSON string
  billingAddress: string; // JSON string
}

const BoldButton: React.FC<BoldButtonProps> = (props) => {
  // We use dangerouslySetInnerHTML to ensure the <script> tag is rendered literally
  // so that Bold's library can find and replace it with the payment button.
  // The backslash in '<\/script>' is to prevent the string from being parsed as an actual script tag by the browser's parser prematurely.
  const scriptHtml = `
    <script
      data-bold-button="dark-L"
      data-api-key="${props.apiKey}"
      data-order-id="${props.orderId}"
      data-amount="${props.amount}"
      data-currency="${props.currency}"
      data-integrity-signature="${props.signature}"
      data-redirection-url="${props.redirectionUrl}"
      data-description="${props.description}"
      data-customer-data='${props.customerData}'
      data-billing-address='${props.billingAddress}'
    ><\/script>
  `;

  // Render this script inside a div. The Bold library will replace the contents of this div.
  return <div className="flex justify-center" dangerouslySetInnerHTML={{ __html: scriptHtml }} />;
};

export default BoldButton;
