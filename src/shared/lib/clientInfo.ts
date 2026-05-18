export function getClientInfo() {
  if (typeof window === 'undefined') {
    return {
      session_source: 'web',
      device_type: 'desktop',
      metadata: {},
    };
  }

  const ua = window.navigator.userAgent;
  const platform = window.navigator.platform;

  return {
    session_source: 'web',
    device_type: /Mobi|Android|iPhone/i.test(ua) ? 'mobile' : 'desktop',
    os_name: platform || undefined,
    browser_name: detectBrowser(ua),
    metadata: {
      userAgent: ua,
      language: window.navigator.language,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    },
  };
}

function detectBrowser(userAgent: string) {
  if (userAgent.includes('Edg/')) return 'Edge';
  if (userAgent.includes('Chrome/')) return 'Chrome';
  if (userAgent.includes('Firefox/')) return 'Firefox';
  if (userAgent.includes('Safari/')) return 'Safari';
  return 'Unknown';
}
