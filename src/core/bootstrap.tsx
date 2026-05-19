import React from 'react';
import ReactDOM from 'react-dom/client';
import { AggregationBar } from '../components/AggregationBar';
import './bootstrap.css';

const ROOT_CLASS = 'proton-aggregator-root';
const POLL_INTERVAL_MS = 1000;
const MAX_POLLS = 20;

class Bootstrap {
  private setup = false;

  async initialize(): Promise<void> {
    if (this.setup) return;
    this.setup = true;
    await this.waitForDomAndMount();
  }

  private get rootElement(): Element | null {
    const existing = document.querySelector(`.${ROOT_CLASS}`);
    if (existing) return existing;

    // Inject at the end of body as a fallback mount point.
    // The AggregationBar component positions itself via CSS.
    const el = document.createElement('div');
    el.classList.add(ROOT_CLASS);
    document.body.appendChild(el);
    return el;
  }

  private async waitForDomAndMount(attempts = 0): Promise<void> {
    if (!document.body) {
      if (attempts >= MAX_POLLS) {
        console.warn('[ProtonSheetsAggregator] document.body never appeared');
        return;
      }
      await this.wait(POLL_INTERVAL_MS);
      return this.waitForDomAndMount(attempts + 1);
    }

    const root = ReactDOM.createRoot(this.rootElement!);
    root.render(<AggregationBar />);
  }

  private wait(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

export default new Bootstrap();
