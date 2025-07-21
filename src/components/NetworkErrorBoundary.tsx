import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Navigate } from 'react-router-dom';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  errorType: 'network' | 'server' | 'unknown' | 'notFound';
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

  /**
   * Analyzes the error and determines its type
   */
  static getDerivedStateFromError(error: any): State {
    // Update state to show appropriate fallback UI based on error type
    let errorType: State['errorType'] = 'unknown';
    let errorCode: number | undefined = undefined;
    let errorMessage: string | undefined = error?.message;

    // Check if error is a TypeError related to network
    if (
      error instanceof TypeError && 
      (error.message.includes('fetch') || 
       error.message.includes('network') ||
       error.message.includes('Failed to fetch'))
    ) {
      errorType = 'network';
    } 
    // Server errors (500+) from fetch responses or other sources
    else if (
      error?.status >= 500 || 
      (error?.name === 'HttpError' && error?.statusCode >= 500) ||
      error?.message?.includes('server error') ||
      error?.message?.includes('500')
    ) {
      errorType = 'server';
      errorCode = error?.status || error?.statusCode || 500;
    }
    // Not found errors (404)
    else if (
      error?.status === 404 || 
      (error?.name === 'HttpError' && error?.statusCode === 404) ||
      error?.message?.includes('not found') ||
      error?.message?.includes('404')
    ) {
      errorType = 'notFound';
      errorCode = 404;
    }

    return { 
      hasError: true, 
      errorType,
      errorCode,
      errorMessage
    };
  }

  /**
   * Log error information for debugging
   */
  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Handle errors silently
    this.setState({
      hasError: true,
      error: error,
      errorInfo: errorInfo
    });
  }

  /**
   * Reset error state when new children are received
   */
  componentDidUpdate(prevProps: Props) {
    // If children change and we have an error, reset the error state
    if (prevProps.children !== this.props.children && this.state.hasError) {
      this.setState({
        hasError: false,
        errorType: 'unknown',
        errorCode: undefined,
        errorMessage: undefined
      });
    }
  }

  render() {
    if (this.state.hasError) {
      // Redirect to appropriate error page with error details
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

    // No error, render children normally
    return this.props.children;
  }
}

export default NetworkErrorBoundary; 