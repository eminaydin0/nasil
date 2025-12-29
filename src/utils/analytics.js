// Google Analytics 4 Integration

export const GA_MEASUREMENT_ID = 'G-XXXXXXXXXX'; // Buraya gerçek GA4 ID'nizi yazın

// Initialize Google Analytics
export const initGA = () => {
  if (typeof window !== 'undefined') {
    // Google Analytics script
    const script1 = document.createElement('script');
    script1.async = true;
    script1.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
    document.head.appendChild(script1);

    // GA configuration
    window.dataLayer = window.dataLayer || [];
    function gtag() {
      window.dataLayer.push(arguments);
    }
    window.gtag = gtag;
    gtag('js', new Date());
    gtag('config', GA_MEASUREMENT_ID, {
      page_path: window.location.pathname,
    });
  }
};

// Track page views
export const trackPageView = (url) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('config', GA_MEASUREMENT_ID, {
      page_path: url,
    });
  }
};

// Track custom events
export const trackEvent = (action, category, label, value) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', action, {
      event_category: category,
      event_label: label,
      value: value,
    });
  }
};

// Specific tracking functions
export const trackGameView = (gameName, gameId) => {
  trackEvent('view_game', 'Games', gameName, gameId);
};

export const trackGameSearch = (searchTerm) => {
  trackEvent('search', 'Search', searchTerm);
};

export const trackCommentSubmit = (gameName) => {
  trackEvent('submit_comment', 'Engagement', gameName);
};

export const trackShare = (platform, gameName) => {
  trackEvent('share', 'Social', `${platform} - ${gameName}`);
};

export const trackFavoriteAdd = (gameName) => {
  trackEvent('add_favorite', 'Engagement', gameName);
};

export const trackCategoryFilter = (category) => {
  trackEvent('filter_category', 'Navigation', category);
};

// User behavior tracking for heatmap
export const trackClick = (elementName, elementType) => {
  trackEvent('click', 'Interaction', `${elementType} - ${elementName}`);
};

export const trackScroll = (scrollDepth) => {
  trackEvent('scroll', 'Engagement', 'Scroll Depth', scrollDepth);
};

// A/B Testing helpers
export const getABTestVariant = (testName) => {
  // Check if variant is already stored
  let variant = localStorage.getItem(`ab_test_${testName}`);
  
  if (!variant) {
    // Randomly assign variant (50/50 split)
    variant = Math.random() < 0.5 ? 'A' : 'B';
    localStorage.setItem(`ab_test_${testName}`, variant);
    
    // Track variant assignment
    trackEvent('ab_test_assigned', 'Testing', `${testName} - Variant ${variant}`);
  }
  
  return variant;
};

export const trackABTestConversion = (testName, variant) => {
  trackEvent('ab_test_conversion', 'Testing', `${testName} - Variant ${variant}`);
};

// Performance tracking
export const trackPerformance = () => {
  if (typeof window !== 'undefined' && window.performance) {
    const perfData = window.performance.timing;
    const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart;
    const connectTime = perfData.responseEnd - perfData.requestStart;
    const renderTime = perfData.domComplete - perfData.domLoading;

    trackEvent('performance', 'Metrics', 'Page Load Time', Math.round(pageLoadTime));
    trackEvent('performance', 'Metrics', 'Connect Time', Math.round(connectTime));
    trackEvent('performance', 'Metrics', 'Render Time', Math.round(renderTime));
  }
};

// Session tracking
export const trackSession = () => {
  const sessionStart = localStorage.getItem('session_start');
  const now = Date.now();
  
  if (!sessionStart) {
    localStorage.setItem('session_start', now);
    trackEvent('session_start', 'Session', 'New Session');
  } else {
    const sessionDuration = Math.round((now - parseInt(sessionStart)) / 1000); // seconds
    if (sessionDuration > 1800) { // 30 minutes
      localStorage.setItem('session_start', now);
      trackEvent('session_end', 'Session', 'Session Duration', sessionDuration);
      trackEvent('session_start', 'Session', 'New Session');
    }
  }
};

// Track scroll depth (for heatmap)
let maxScrollDepth = 0;
export const initScrollTracking = () => {
  if (typeof window !== 'undefined') {
    window.addEventListener('scroll', () => {
      const scrollPercentage = Math.round(
        (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100
      );
      
      if (scrollPercentage > maxScrollDepth) {
        maxScrollDepth = scrollPercentage;
        
        // Track at 25%, 50%, 75%, 100% milestones
        if ([25, 50, 75, 100].includes(scrollPercentage)) {
          trackScroll(scrollPercentage);
        }
      }
    });
  }
};

// Error tracking
export const trackError = (error, errorInfo) => {
  trackEvent('error', 'Error', error.toString(), errorInfo);
};

// Device tracking
export const trackDeviceType = () => {
  if (typeof window !== 'undefined') {
    const width = window.innerWidth;
    let deviceType = 'desktop';
    
    if (width < 768) {
      deviceType = 'mobile';
    } else if (width >= 768 && width < 1024) {
      deviceType = 'tablet';
    }
    
    // Get current device stats
    const deviceVisits = JSON.parse(localStorage.getItem('device_visits') || '{"desktop": 0, "mobile": 0, "tablet": 0}');
    deviceVisits[deviceType] = (deviceVisits[deviceType] || 0) + 1;
    localStorage.setItem('device_visits', JSON.stringify(deviceVisits));
    
    return deviceType;
  }
  return 'desktop';
};

// Traffic source tracking
export const trackTrafficSource = () => {
  if (typeof window !== 'undefined') {
    const referrer = document.referrer;
    const hostname = window.location.hostname;
    let source = 'direct';
    
    if (referrer && referrer !== '') {
      const referrerHostname = new URL(referrer).hostname;
      
      // Check if it's from the same site
      if (referrerHostname === hostname) {
        return; // Don't track internal navigation
      }
      
      // Check for search engines
      const searchEngines = ['google', 'bing', 'yahoo', 'yandex', 'duckduckgo', 'baidu'];
      if (searchEngines.some(engine => referrerHostname.includes(engine))) {
        source = 'search';
      }
      // Check for social media
      else if (['facebook', 'twitter', 'instagram', 'linkedin', 'pinterest', 'reddit', 'tiktok', 'youtube'].some(social => referrerHostname.includes(social))) {
        source = 'social';
      }
      // Other referrals
      else {
        source = 'referral';
      }
    }
    
    // Check URL parameters for UTM source
    const urlParams = new URLSearchParams(window.location.search);
    const utmSource = urlParams.get('utm_source');
    if (utmSource) {
      if (utmSource.includes('google') || utmSource.includes('search')) {
        source = 'search';
      } else if (['facebook', 'twitter', 'instagram', 'linkedin'].includes(utmSource.toLowerCase())) {
        source = 'social';
      }
    }
    
    // Update traffic sources
    const trafficSources = JSON.parse(localStorage.getItem('traffic_sources') || '{"direct": 0, "search": 0, "social": 0, "referral": 0}');
    trafficSources[source] = (trafficSources[source] || 0) + 1;
    localStorage.setItem('traffic_sources', JSON.stringify(trafficSources));
    
    return source;
  }
  return 'direct';
};

// Session duration tracking
export const updateSessionDuration = () => {
  if (typeof window !== 'undefined') {
    const sessionStart = parseInt(localStorage.getItem('current_session_start') || Date.now());
    const duration = Math.round((Date.now() - sessionStart) / 1000); // seconds
    
    // Save session data
    const sessions = JSON.parse(localStorage.getItem('user_sessions') || '[]');
    const currentSessionIndex = sessions.findIndex(s => s.start === sessionStart);
    
    if (currentSessionIndex >= 0) {
      sessions[currentSessionIndex].duration = duration;
    } else {
      sessions.push({ start: sessionStart, duration: duration });
    }
    
    // Keep only last 50 sessions
    if (sessions.length > 50) {
      sessions.shift();
    }
    
    localStorage.setItem('user_sessions', JSON.stringify(sessions));
  }
};

// Initialize session on page load
export const initSession = () => {
  if (typeof window !== 'undefined') {
    const sessionStart = Date.now();
    localStorage.setItem('current_session_start', sessionStart);
    
    // Track device and traffic source on session start
    trackDeviceType();
    trackTrafficSource();
    
    // Update session duration before page unload
    window.addEventListener('beforeunload', () => {
      updateSessionDuration();
    });
    
    // Also update periodically (every 30 seconds)
    setInterval(() => {
      updateSessionDuration();
    }, 30000);
  }
};

// Admin Analytics - Get all analytics data
export const getAnalyticsData = () => {
  if (typeof window === 'undefined') return null;
  
  return {
    deviceVisits: JSON.parse(localStorage.getItem('device_visits') || '{"desktop": 0, "mobile": 0, "tablet": 0}'),
    trafficSources: JSON.parse(localStorage.getItem('traffic_sources') || '{"direct": 0, "search": 0, "social": 0, "referral": 0}'),
    userSessions: JSON.parse(localStorage.getItem('user_sessions') || '[]'),
    currentSessionStart: localStorage.getItem('current_session_start'),
    sessionStart: localStorage.getItem('session_start')
  };
};

// Admin Analytics - Export analytics data as JSON
export const exportAnalyticsData = () => {
  const data = getAnalyticsData();
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `analytics-${new Date().toISOString().split('T')[0]}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

// Admin Analytics - Clear all analytics data
export const clearAnalyticsData = () => {
  if (typeof window === 'undefined') return;
  
  localStorage.removeItem('device_visits');
  localStorage.removeItem('traffic_sources');
  localStorage.removeItem('user_sessions');
  localStorage.removeItem('current_session_start');
  localStorage.removeItem('session_start');
  
  console.log('Analytics data cleared');
};

// Admin Analytics - Calculate engagement score (0-100)
export const calculateEngagementScore = () => {
  const data = getAnalyticsData();
  if (!data) return 0;
  
  const sessions = data.userSessions;
  if (sessions.length === 0) return 0;
  
  // Factors for engagement:
  // 1. Average session duration (max 300s = 5 min)
  const avgDuration = sessions.reduce((sum, s) => sum + s.duration, 0) / sessions.length;
  const durationScore = Math.min(avgDuration / 300, 1) * 40; // 40 points max
  
  // 2. Number of sessions (max 50 sessions)
  const sessionScore = Math.min(sessions.length / 50, 1) * 30; // 30 points max
  
  // 3. Bounce rate (inverse - lower is better)
  const bounceCount = sessions.filter(s => s.duration < 5).length;
  const bounceRate = sessions.length > 0 ? bounceCount / sessions.length : 1;
  const bounceScore = (1 - bounceRate) * 30; // 30 points max
  
  return Math.round(durationScore + sessionScore + bounceScore);
};

// Track when user interacts with admin panel
export const trackAdminAction = (action, details) => {
  trackEvent('admin_action', 'Admin Panel', `${action} - ${details}`);
};
