"use client";

import { Component, type ErrorInfo, type ReactNode } from "react";
import * as Sentry from "@sentry/nextjs";
import { ErrorPanel, type DashboardError } from "./ErrorPanel";

type Props = { name: string; children: ReactNode; background?: boolean };
type State = { error: DashboardError | null; retries: number };

export class WidgetErrorBoundary extends Component<Props, State> {
  state: State = { error: null, retries: 0 };
  private retryTimer: ReturnType<typeof setTimeout> | undefined;

  static getDerivedStateFromError(error: DashboardError) {
    return { error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    Sentry.captureException(error, {
      tags: { widget: this.props.name },
      extra: { componentStack: info.componentStack },
    });
    if (this.state.retries < 3) {
      this.retryTimer = setTimeout(() => {
        this.setState((state) => ({ error: null, retries: state.retries + 1 }));
      }, 60_000);
    }
  }

  componentWillUnmount() {
    clearTimeout(this.retryTimer);
  }

  private retry = () => {
    clearTimeout(this.retryTimer);
    this.setState({ error: null, retries: 0 });
  };

  render() {
    if (!this.state.error) return this.props.children;
    return (
      <div
        style={
          this.props.background
            ? { position: "absolute", top: 16, left: 16, zIndex: 20, maxWidth: 560 }
            : undefined
        }
      >
        <ErrorPanel
          title={`${this.props.name} unavailable`}
          error={this.state.error}
          onRetry={this.retry}
          compact
          retryNotice={
            this.state.retries < 3
              ? `The rest of the dashboard is still running. Retrying in one minute (${this.state.retries + 1} of 3).`
              : "Automatic retries failed. Photograph this error, then try again or reload."
          }
        />
      </div>
    );
  }
}
