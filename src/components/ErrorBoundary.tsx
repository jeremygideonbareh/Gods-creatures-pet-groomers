import { Component, type ErrorInfo, type ReactNode } from "react";

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

const BRAND_PINK = "#d0999a";

export class ErrorBoundary extends Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error("ErrorBoundary caught:", error, info.componentStack);
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div
          className="w-full h-screen flex items-center justify-center p-8"
          style={{ backgroundColor: BRAND_PINK }}
        >
          <div className="max-w-md w-full bg-white/20 backdrop-blur-xl rounded-3xl p-8 md:p-10 border border-white/30 text-center shadow-2xl">
            <div className="text-5xl mb-4">🐾</div>
            <h1 className="text-2xl md:text-3xl font-bold text-white mb-3 uppercase tracking-wide">
              Something went wrong
            </h1>
            <p className="text-white/70 text-sm md:text-base mb-6 leading-relaxed">
              An unexpected error occurred. Please try again or contact us if
              the problem persists.
            </p>
            <button
              onClick={this.handleRetry}
              className="px-8 py-3 rounded-full bg-white font-semibold text-base uppercase tracking-wider transition-transform hover:scale-105 shadow-lg"
              style={{ color: BRAND_PINK }}
            >
              Try Again
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
