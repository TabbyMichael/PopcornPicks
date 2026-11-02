import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { AlertCircle, RefreshCw, Home } from 'lucide-react';

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null
    };
  }

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    return {
      hasError: true,
      error
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.setState({
      error,
      errorInfo
    });

    // Log error to console in development
    if (import.meta.env.DEV) {
      console.error('Error caught by ErrorBoundary:', error);
      console.error('Error Info:', errorInfo);
    }

    // TODO: Send error to error tracking service (Sentry, etc.)
    // Example: Sentry.captureException(error, { extra: errorInfo });
  }

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null
    });
  };

  handleGoHome = () => {
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="flex min-h-screen items-center justify-center bg-background p-4">
          <Card className="w-full max-w-2xl border border-white/10 bg-card">
            <CardHeader className="text-center">
              <div className="mb-4 flex justify-center">
                <div className="rounded-full bg-destructive/15 p-4">
                  <AlertCircle className="h-12 w-12 text-destructive" />
                </div>
              </div>
              <CardTitle className="text-2xl font-bold text-foreground">
                Something went wrong
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <p className="text-center text-muted-foreground">
                We hit an unexpected error. It has been logged and our team will look into it.
              </p>

              {import.meta.env.DEV && this.state.error && (
                <div className="rounded-lg border border-white/10 bg-background p-4">
                  <p className="mb-2 font-mono text-sm text-destructive">
                    {this.state.error.toString()}
                  </p>
                  {this.state.errorInfo && (
                    <details className="mt-2">
                      <summary className="cursor-pointer text-sm text-muted-foreground hover:text-foreground">
                        Component stack
                      </summary>
                      <pre className="mt-2 max-h-40 overflow-auto text-xs text-muted-foreground">
                        {this.state.errorInfo.componentStack}
                      </pre>
                    </details>
                  )}
                </div>
              )}

              <div className="flex justify-center gap-4">
                <Button onClick={this.handleReset} variant="primary-red">
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Try again
                </Button>
                <Button onClick={this.handleGoHome} variant="glass">
                  <Home className="mr-2 h-4 w-4" />
                  Go home
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}
