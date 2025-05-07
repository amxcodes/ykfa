import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Navigate } from 'react-router-dom';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  errorType: 'network' | 'server' | 'unknown';
  errorCode?: number;
  errorMessage?: string;
}

/**
 * NetworkErrorBoundary catches network related errors and JavaScript errors
 * in the component tree, displaying an appropriate error page
 */
class NetworkErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      errorType: 'unknown',
      errorCode: undefined,
      errorMessage: undefined
    };
  }

  static getDerivedStateFromError(error: any): State {
    // Update state to show fallback UI
    let errorType: 'network' | 'server' | 'unknown' = 'unknown';
    let errorCode: number | undefined = undefined;
    let errorMessage: string | undefined = error?.message;

    // Handle network errors
    if (error instanceof TypeError && error.message.includes('fetch')) {
      errorType = 'network';
    } 
    // Handle server errors from fetch response
    else if (error?.status >= 500 || (error?.name === 'HttpError' && error?.statusCode >= 500)) {
      errorType = 'server';
      errorCode = error?.status || error?.statusCode;
    }
    // Handle known error objects with status codes
    else if (error?.status === 404 || (error?.name === 'HttpError' && error?.statusCode === 404)) {
      errorType = 'unknown';
      errorCode = 404;
    }

    return { 
      hasError: true, 
      errorType,
      errorCode,
      errorMessage
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // You can log the error to an error reporting service
    console.error('NetworkErrorBoundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <Navigate 
          to={`/error/${this.state.errorType}`} 
          state={{ 
            code: this.state.errorCode,
            message: this.state.errorMessage
          }} 
          replace
        />
      );
    }

    return this.props.children;
  }
}

export default NetworkErrorBoundary; 