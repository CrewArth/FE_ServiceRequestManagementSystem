import { Component, type ErrorInfo, type ReactNode } from 'react';

type State = { hasError: boolean };

export class ErrorBoundary extends Component<{ children: ReactNode }, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('Frontend error', error, info.componentStack);
  }

  render() {
    if (this.state.hasError) {
      return (
        <main role="alert" className="flex min-h-screen items-center justify-center px-4">
          <div className="card w-full max-w-md text-center">
            <h1 className="text-xl font-bold text-blue-950">Something went wrong</h1>
            <p className="mt-3 text-sm text-slate-600">Please reload the page and try again.</p>
            <button type="button" className="button mt-6" onClick={() => window.location.reload()}>Reload page</button>
          </div>
        </main>
      );
    }

    return this.props.children;
  }
}
