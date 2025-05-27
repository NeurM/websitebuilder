import React from 'react';
import { AnalyticsConfig, CookieConfig } from '@/types/api';

interface AnalyticsScriptsProps {
  analytics: AnalyticsConfig;
  cookies: CookieConfig;
}

export const AnalyticsScripts: React.FC<AnalyticsScriptsProps> = ({ analytics, cookies }) => {
  const gtmScript = `
    (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
    new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
    j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
    'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
    })(window,document,'script','dataLayer','${analytics.google_tag_manager_id}');
  `;

  const gaScript = analytics.google_analytics_id ? `
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', '${analytics.google_analytics_id}');
  ` : '';

  const fbPixelScript = analytics.facebook_pixel_id ? `
    !function(f,b,e,v,n,t,s)
    {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
    n.callMethod.apply(n,arguments):n.queue.push(arguments)};
    if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
    n.queue=[];t=b.createElement(e);t.async=!0;
    t.src=v;s=b.getElementsByTagName(e)[0];
    s.parentNode.insertBefore(t,s)}(window, document,'script',
    'https://connect.facebook.net/en_US/fbevents.js');
    fbq('init', '${analytics.facebook_pixel_id}');
    fbq('track', 'PageView');
  ` : '';

  const cookieScript = cookies.enabled ? `
    window.cookieConsent = {
      enabled: ${cookies.enabled},
      bannerText: "${cookies.banner_text}",
      acceptButtonText: "${cookies.accept_button_text}",
      declineButtonText: "${cookies.decline_button_text}",
      policyUrl: "${cookies.policy_url || ''}",
      duration: ${cookies.duration},
      categories: ${JSON.stringify(cookies.categories)}
    };
  ` : '';

  return (
    <>
      {analytics.google_tag_manager_id && (
        <script dangerouslySetInnerHTML={{ __html: gtmScript }} />
      )}
      {analytics.google_analytics_id && (
        <script dangerouslySetInnerHTML={{ __html: gaScript }} />
      )}
      {analytics.facebook_pixel_id && (
        <script dangerouslySetInnerHTML={{ __html: fbPixelScript }} />
      )}
      {cookies.enabled && (
        <script dangerouslySetInnerHTML={{ __html: cookieScript }} />
      )}
      {analytics.custom_analytics_script && (
        <script dangerouslySetInnerHTML={{ __html: analytics.custom_analytics_script }} />
      )}
    </>
  );
}; 