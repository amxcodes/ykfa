import { useEffect, useState, useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Wifi, Home, RefreshCw, AlertTriangle, Server, SearchX } from 'lucide-react';
// import { motion } from 'framer-motion'; // Replaced with CSS animations

// Define error types and their specific messages
type ErrorType = 'network' | 'notFound' | 'server' | 'unknown';

interface ErrorConfig {
  title: string;
  description: string;
  icon: React.ReactNode;
  suggestion: string;
  primaryAction: string;
  primaryColor: string;
}

// Static config moved outside component for better memory usage
const errorConfigs: Record<ErrorType, ErrorConfig> = {
  network: {
    title: 'Network Error',
    description: 'Unable to connect to the server. Please check your internet connection.',
    icon: <Wifi className="w-16 h-16 text-amber-400" />,
    suggestion: 'Make sure you have a stable internet connection and try again.',
    primaryAction: 'Retry',
    primaryColor: 'bg-gradient-to-r from-amber-400 to-amber-500'
  },
  notFound: {
    title: 'Page Not Found',
    description: 'Sorry, the page you are looking for doesn\'t exist or has been moved.',
    icon: <SearchX className="w-16 h-16 text-blue-400" />,
    suggestion: 'Check the URL or go back to the homepage.',
    primaryAction: 'Go Home',
    primaryColor: 'bg-gradient-to-r from-blue-400 to-blue-500'
  },
  server: {
    title: 'Server Error',
    description: 'Something went wrong on our servers. We\'re working to fix the issue.',
    icon: <Server className="w-16 h-16 text-red-400" />,
    suggestion: 'Please try again later or contact support if the problem persists.',
    primaryAction: 'Refresh',
    primaryColor: 'bg-gradient-to-r from-red-400 to-red-500'
  },
  unknown: {
    title: 'Something Went Wrong',
    description: 'An unexpected error occurred. We\'re looking into it.',
    icon: <AlertTriangle className="w-16 h-16 text-yellow-400" />,
    suggestion: 'Try refreshing the page or come back later.',
    primaryAction: 'Refresh',
    primaryColor: 'bg-gradient-to-r from-yellow-400 to-yellow-500'
  }
};

// CSS animations are now used instead of Framer Motion

interface ErrorPageProps {
  errorType?: ErrorType;
  code?: number;
  message?: string;
}

const ErrorPage = ({ 
  errorType = 'unknown',
  code,
  message
}: ErrorPageProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isRetrying, setIsRetrying] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const [offlineStatus, setOfflineStatus] = useState(!navigator.onLine);
  
  // Handle automatic error detection
  useEffect(() => {
    // If error type isn't specified but there's a code, determine the error type
    if (code) {
      if (code === 404) {
        // Only navigate if we're not already on the not-found page
        if (location.pathname !== '/error/not-found') {
        navigate('/error/not-found', { replace: true });
        }
      } else if (code >= 500) {
        // Only navigate if we're not already on the server error page
        if (location.pathname !== '/error/server') {
        navigate('/error/server', { replace: true });
        }
      }
    }
    
    // Check network status
    const handleOnline = () => setOfflineStatus(false);
    const handleOffline = () => setOfflineStatus(true);
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [code, navigate, location.pathname]);

  // Extract error data from location if available
  useEffect(() => {
    if (location.state) {
      const stateCode = (location.state as any).code;
      const stateMessage = (location.state as any).message;
      
      if (stateCode || stateMessage) {
        // We have state from a redirect but won't trigger another navigation
      }
    }
  }, [location]);

  // Override error type if offline - using useMemo to avoid unnecessary calculations
  const effectiveErrorType = useMemo(() => 
    offlineStatus ? 'network' : errorType, 
    [offlineStatus, errorType]
  );
  
  const config = errorConfigs[effectiveErrorType];

  // Handle primary action
  const handleAction = () => {
    if (isRetrying) return;
    
    setIsRetrying(true);
    setRetryCount(prev => prev + 1);
    
    if (effectiveErrorType === 'network' || effectiveErrorType === 'server' || effectiveErrorType === 'unknown') {
      // Retry current page
      setTimeout(() => {
        // Clear previous browser history to avoid history pollution
        window.history.replaceState({}, document.title, '/');
        window.location.href = '/'; // Hard redirect to home
      }, 500);
    } else if (effectiveErrorType === 'notFound') {
      // Navigate home
      setTimeout(() => {
        navigate('/', { replace: true });
      }, 500);
    }
  };

  return (
    <div className="min-h-screen w-full bg-black flex items-center justify-center p-4">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -right-40 w-80 h-80 bg-amber-500/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/3 -left-40 w-80 h-80 bg-blue-500/5 rounded-full blur-3xl"></div>
      </div>
      
      <div 
        className="relative max-w-md w-full rounded-2xl backdrop-blur-xl bg-black/40 border border-white/10 shadow-2xl overflow-hidden animate-fade-in-up"
      >
        {/* Decorative header line */}
        <div className="h-1 w-full bg-gradient-to-r from-transparent via-amber-500 to-transparent"></div>
        
        <div className="p-8 text-center">
          <div className="flex justify-center mb-6">
            <div className="p-4 rounded-2xl bg-black/40 border border-white/10">
              <div className="animate-fade-in-up" style={{ animationDelay: '0.7s' }}>
                {config.icon}
              </div>
            </div>
          </div>
          
          <h1 
            className="text-2xl md:text-3xl font-bold text-white mb-2 animate-fade-in-up"
            style={{ animationDelay: '0.3s' }}
          >
            {config.title}
          </h1>
          
          <p 
            className="text-gray-400 mb-4 animate-fade-in-up"
            style={{ animationDelay: '0.4s' }}
          >
            {message || config.description}
          </p>
          
          <p 
            className="text-sm text-white/60 mb-8 animate-fade-in-up"
            style={{ animationDelay: '0.5s' }}
          >
            {config.suggestion}
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              className={`px-6 py-3 rounded-xl ${config.primaryColor} text-black font-medium flex items-center justify-center gap-2 hover:shadow-lg hover:scale-105 active:scale-95 transition-all duration-300 animate-fade-in-up`}
              onClick={handleAction}
              disabled={isRetrying}
              style={{ animationDelay: '0.6s' }}
            >
              {isRetrying ? (
                <RefreshCw className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  {effectiveErrorType === 'notFound' ? (
                    <Home className="w-5 h-5" />
                  ) : (
                    <RefreshCw className="w-5 h-5" />
                  )}
                </>
              )}
              {config.primaryAction}
            </button>
            
            {effectiveErrorType !== 'notFound' && (
              <button
                className="px-6 py-3 rounded-xl bg-white/5 border border-white/10 text-white hover:bg-white/10 hover:scale-105 active:scale-95 transition-all duration-300 flex items-center justify-center gap-2 animate-fade-in-up"
                onClick={() => navigate('/')}
                style={{ animationDelay: '0.7s' }}
              >
                <Home className="w-5 h-5" />
                Go Home
              </button>
            )}
          </div>
          
          {/* Additional information - only render when needed */}
          {(code || retryCount > 0) && (
            <div 
              className="mt-8 text-xs text-gray-500 animate-fade-in-up"
              style={{ animationDelay: '0.8s' }}
            >
              {code && <p>Error code: {code}</p>}
              {retryCount > 0 && <p>Retry attempts: {retryCount}</p>}
              <p className="mt-1">
                Current path: {location.pathname}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ErrorPage; 