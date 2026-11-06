import { Component } from 'react';

/** Replaces a blank page with a way back, for example when an old tab outlives a new deploy. */
export default class ErrorBoundary extends Component {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  render() {
    if (!this.state.failed) return this.props.children;
    return (
      <section className="flex flex-col gap-[22px]">
        <h1>The flame flickered</h1>
        <p className="text-[1.05rem] text-muted">Reload the page and it will light again.</p>
        <button
          type="button"
          className="btn btn-primary btn-big"
          onClick={() => window.location.reload()}
        >
          Reload
        </button>
      </section>
    );
  }
}
