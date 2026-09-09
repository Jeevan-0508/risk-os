import { Component, type ErrorInfo, type ReactNode } from 'react';
import { AlertTriangle } from 'lucide-react';

interface Props {
  children: ReactNode;
  /** Shown in the fallback so the user knows which area failed. */
  area: string;
}

interface State {
  error: Error | null;
}

/**
 * One boundary per route. A malformed programme should cost the user one screen,
 * never the whole session, and the message has to name the failing area.
 */
export class ErrorBoundary extends Component<Props, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  componentDidCatch(error: Error, info: ErrorInfo): void {
    console.error('[RISK//OS] ' + this.props.area + ' failed to render', error, info.componentStack);
  }

  render(): ReactNode {
    if (!this.state.error) return this.props.children;
    return (
      <div className="panel p-6" role="alert">
        <div className="flex items-start gap-3">
          <AlertTriangle className="h-5 w-5 shrink-0 text-threat" aria-hidden="true" />
          <div>
            <h2 className="text-base font-semibold text-ink-100">{this.props.area} could not be rendered</h2>
            <p className="mt-1 max-w-2xl text-sm text-ink-400">
              The programme data reached this screen in a shape it does not understand. Every other screen is still
              usable, and Settings can reset to the demo programme.
            </p>
            <pre className="mt-3 max-w-2xl overflow-x-auto rounded border border-base-600 bg-base-800 p-3 text-2xs text-ink-400">
              {this.state.error.message}
            </pre>
            <button className="btn mt-3" onClick={() => this.setState({ error: null })}>
              Try again
            </button>
          </div>
        </div>
      </div>
    );
  }
}
