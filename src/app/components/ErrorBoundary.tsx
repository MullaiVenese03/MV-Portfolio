import { Component, type ErrorInfo, type ReactNode } from "react";
import { Link } from "react-router-dom";
import { FONT, themeVars } from "../theme";

type Props = { children: ReactNode };
type State = { hasError: boolean };

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error("Application error:", error, info);
  }

  render() {
    if (!this.state.hasError) return this.props.children;

    const c = themeVars;
    return (
      <section
        role="alert"
        className="min-h-[60vh] flex flex-col items-center justify-center px-6 py-24 text-center"
        style={{ background: c.bg, fontFamily: FONT }}
      >
        <h1
          style={{
            fontSize: "clamp(1.75rem, 4vw, 2.5rem)",
            fontWeight: 800,
            color: c.heading,
          }}
        >
          Something went wrong
        </h1>
        <p style={{ color: c.body, marginTop: 12, maxWidth: 480, lineHeight: 1.7 }}>
          An unexpected error occurred. Please refresh the page or return home.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="px-6 py-3 rounded-full text-white transition-opacity hover:opacity-90"
            style={{ background: c.primary, fontWeight: 600 }}
          >
            Refresh page
          </button>
          <Link
            to="/"
            className="px-6 py-3 rounded-full border transition-opacity hover:opacity-80"
            style={{ borderColor: c.border, color: c.heading, fontWeight: 600 }}
          >
            Back to home
          </Link>
        </div>
      </section>
    );
  }
}
