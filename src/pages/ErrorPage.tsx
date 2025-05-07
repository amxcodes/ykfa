import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Wifi, Home, RefreshCw, AlertTriangle, Server, SearchX } from 'lucide-react';
import { motion } from 'framer-motion';

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
  
  const errorConfig = errorConfigs[errorType];

  // Handle automatic error detection
  useEffect(() => {
    // If error type isn't specified but there's a code, determine the error type
    if (code) {
      if (code === 404) {
        navigate('/error/not-found', { replace: true });
      } else if (code >= 500) {
        navigate('/error/server', { replace: true });
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
  }, [code, navigate]);

  // Override error type if offline
  const effectiveErrorType = offlineStatus ? 'network' : errorType;
  const config = errorConfigs[effectiveErrorType];

  // Handle primary action
  const handleAction = () => {
    setIsRetrying(true);
    setRetryCount(prev => prev + 1);
    
    if (effectiveErrorType === 'network' || effectiveErrorType === 'server' || effectiveErrorType === 'unknown') {
      // Retry current page
      setTimeout(() => {
        window.location.reload();
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
      
      <motion.div 
        className="relative max-w-md w-full rounded-2xl backdrop-blur-xl bg-black/40 border border-white/10 shadow-2xl overflow-hidden"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        {/* Decorative header line */}
        <div className="h-1 w-full bg-gradient-to-r from-transparent via-amber-500 to-transparent"></div>
        
        <div className="p-8 text-center">
          <div className="flex justify-center mb-6">
            <div className="p-4 rounded-2xl bg-black/40 border border-white/10">
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.4 }}
              >
                {config.icon}
              </motion.div>
            </div>
          </div>
          
          <motion.h1 
            className="text-2xl md:text-3xl font-bold text-white mb-2"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.4 }}
          >
            {config.title}
          </motion.h1>
          
          <motion.p 
            className="text-gray-400 mb-4"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.4 }}
          >
            {message || config.description}
          </motion.p>
          
          <motion.p 
            className="text-sm text-white/60 mb-8"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.4 }}
          >
            {config.suggestion}
          </motion.p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <motion.button
              className={`px-6 py-3 rounded-xl ${config.primaryColor} text-black font-medium flex items-center justify-center gap-2 hover:shadow-lg transition-all`}
              onClick={handleAction}
              disabled={isRetrying}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.4 }}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
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
            </motion.button>
            
            {effectiveErrorType !== 'notFound' && (
              <motion.button
                className="px-6 py-3 rounded-xl bg-white/5 border border-white/10 text-white hover:bg-white/10 transition-all flex items-center justify-center gap-2"
                onClick={() => navigate('/')}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7, duration: 0.4 }}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
              >
                <Home className="w-5 h-5" />
                Go Home
              </motion.button>
            )}
          </div>
          
          {/* Additional information */}
          {(code || retryCount > 0) && (
            <motion.div 
              className="mt-8 text-xs text-gray-500"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8, duration: 0.4 }}
            >
              {code && <p>Error code: {code}</p>}
              {retryCount > 0 && <p>Retry attempts: {retryCount}</p>}
              <p className="mt-1">
                Current path: {location.pathname}
              </p>
            </motion.div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default ErrorPage; 