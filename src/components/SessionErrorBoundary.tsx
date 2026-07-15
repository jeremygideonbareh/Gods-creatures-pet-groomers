import { Component, type ErrorInfo, type ReactNode } from "react";

interface SessionErrorBoundaryProps {
  children: ReactNode;
  onSessionExpired: () => void;
}

interface SessionErrorBoundaryState {
  hasError: boolean;
  isSessionExpired: boolean;
  error: Error | null;
}

const BRAND_PINK = "#d0999a";

export class SessionErrorBoundary extends Component<
  SessionErrorBoundaryProps,
  SessionErrorBoundaryState
> {
  constructor(props: SessionErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, isSessionExpired: false, error: null };
  }

  static getDerivedStateFromError(error: Error): Partial<SessionErrorBoundaryState> {
    const msg = (error.message ?? "").toLowerCase();
    const isSessionError =
      msg.includes("unauthorized") ||
      msg.includes("401") ||
      msg.includes("session") ||
      msg.includes("jwt") ||
      msg.includes("token expired") ||
      msg.includes("invalid-headers") ||
      msg.includes("access-denied");

    return {
      hasError: true,
      isSessionExpired: isSessionError,
      error,
    };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error("SessionErrorBoundary caught:", error, info.componentStack);
  }

  handleSignInAgain = () => {
    this.props.onSessionExpired();
    this.setState({ hasError: false, isSessionExpired: false, error: null });
  };

  handleRetry = () => {
    this.setState({ hasError: false, isSessionExpired: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div
          className="w-full h-screen flex items-center justify-center p-8"
          style={{ backgroundColor: BRAND_PINK }}
        >
          <div className="max-w-md w-full bg-white/20 backdrop-blur-xl rounded-3xl p-8 md:p-10 border border-white/30 text-center shadow-2xl">
            <div className="text-5xl mb-4">
              {this.state.isSessionExpired ? "🔐" : "🐾"}
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-white mb-3 uppercase tracking-wide">
              {this.state.isSessionExpired ? "Session Expired" : "Something went wrong"}
            </h1>
            <p className="text-white/70 text-sm md:text-base mb-6 leading-relaxed">
              {this.state.isSessionExpired
                ? "Your session has expired. Please sign in again to continue."
                : "An unexpected error occurred. Please try again or contact us if the problem persists."}
            </p>
            <button
              onClick={this.state.isSessionExpired ? this.handleSignInAgain : this.handleRetry}
              className="px-8 py-3 rounded-full bg-white font-semibold text-base uppercase tracking-wider transition-transform hover:scale-105 shadow-lg"
              style={{ color: BRAND_PINK }}
            >
              {this.state.isSessionExpired ? "Sign In Again" : "Try Again"}
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default SessionErrorBoundary;
