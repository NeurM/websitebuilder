(function() {
  const config = window.cookieConsent;
  if (!config || !config.enabled) return;

  // Create cookie consent banner
  const banner = document.createElement('div');
  banner.className = 'cookie-consent-banner';
  banner.style.cssText = `
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    background: #fff;
    padding: 1rem;
    box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.1);
    z-index: 9999;
    display: flex;
    flex-direction: column;
    gap: 1rem;
    align-items: center;
    justify-content: center;
    text-align: center;
  `;

  // Create banner content
  const content = document.createElement('div');
  content.textContent = config.bannerText;
  content.style.cssText = `
    max-width: 600px;
    margin: 0 auto;
  `;

  // Create buttons container
  const buttons = document.createElement('div');
  buttons.style.cssText = `
    display: flex;
    gap: 1rem;
    justify-content: center;
  `;

  // Create accept button
  const acceptButton = document.createElement('button');
  acceptButton.textContent = config.acceptButtonText;
  acceptButton.style.cssText = `
    padding: 0.5rem 1rem;
    background: #007bff;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
  `;

  // Create decline button
  const declineButton = document.createElement('button');
  declineButton.textContent = config.declineButtonText;
  declineButton.style.cssText = `
    padding: 0.5rem 1rem;
    background: #6c757d;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
  `;

  // Add policy link if provided
  if (config.policyUrl) {
    const policyLink = document.createElement('a');
    policyLink.href = config.policyUrl;
    policyLink.textContent = 'Cookie Policy';
    policyLink.style.cssText = `
      color: #007bff;
      text-decoration: none;
      margin-left: 1rem;
    `;
    buttons.appendChild(policyLink);
  }

  // Add buttons to container
  buttons.appendChild(acceptButton);
  buttons.appendChild(declineButton);

  // Add elements to banner
  banner.appendChild(content);
  banner.appendChild(buttons);

  // Add banner to page
  document.body.appendChild(banner);

  // Cookie management functions
  function setCookie(name, value, days) {
    const date = new Date();
    date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
    const expires = `expires=${date.toUTCString()}`;
    document.cookie = `${name}=${value};${expires};path=/`;
  }

  function getCookie(name) {
    const nameEQ = `${name}=`;
    const ca = document.cookie.split(';');
    for (let i = 0; i < ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) === ' ') c = c.substring(1, c.length);
      if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
  }

  // Handle accept button click
  acceptButton.addEventListener('click', () => {
    setCookie('cookie_consent', JSON.stringify(config.categories), config.duration);
    banner.remove();
    // Enable all analytics scripts
    if (config.categories.analytics) {
      // Enable analytics scripts
      document.querySelectorAll('script[data-analytics="true"]').forEach(script => {
        script.setAttribute('data-enabled', 'true');
      });
    }
    if (config.categories.marketing) {
      // Enable marketing scripts
      document.querySelectorAll('script[data-marketing="true"]').forEach(script => {
        script.setAttribute('data-enabled', 'true');
      });
    }
  });

  // Handle decline button click
  declineButton.addEventListener('click', () => {
    setCookie('cookie_consent', JSON.stringify({
      necessary: true,
      analytics: false,
      marketing: false,
      preferences: false
    }), config.duration);
    banner.remove();
    // Disable non-necessary scripts
    document.querySelectorAll('script[data-analytics="true"], script[data-marketing="true"]').forEach(script => {
      script.setAttribute('data-enabled', 'false');
    });
  });

  // Check for existing consent
  const existingConsent = getCookie('cookie_consent');
  if (existingConsent) {
    const consent = JSON.parse(existingConsent);
    if (consent.analytics) {
      document.querySelectorAll('script[data-analytics="true"]').forEach(script => {
        script.setAttribute('data-enabled', 'true');
      });
    }
    if (consent.marketing) {
      document.querySelectorAll('script[data-marketing="true"]').forEach(script => {
        script.setAttribute('data-enabled', 'true');
      });
    }
    banner.remove();
  }
})(); 