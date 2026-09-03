import { useState } from 'react';
import { HOUSEHOLD, CURRENT_USER } from '../data.js';
import { formatLong, todayISO } from '../lib/date.js';
import ScreenHeader from '../components/ScreenHeader.jsx';
import BottomNav from '../components/BottomNav.jsx';
import Icon from '../components/Icon.jsx';

export default function SettingsScreen({ onNav, onReset, itemCount }) {
  const [confirming, setConfirming] = useState(false);
  const [reminders, setReminders] = useState(true);

  return (
    <div className="screen">
      <ScreenHeader title="Settings" />

      <main className="screen-body">
        <section className="settings-group">
          <h2 className="settings-group__title">Household</h2>
          <div className="settings-row">
            <span>Household name</span>
            <span className="settings-row__value">{HOUSEHOLD}</span>
          </div>
          <div className="settings-row">
            <span>Your name</span>
            <span className="settings-row__value">{CURRENT_USER}</span>
          </div>
          <div className="settings-row">
            <span id="l-reminders">Use-soon reminders</span>
            <button
              type="button"
              role="switch"
              aria-checked={reminders}
              aria-labelledby="l-reminders"
              className={`switch${reminders ? ' is-on' : ''}`}
              onClick={() => setReminders((v) => !v)}
            >
              <span className="switch__knob" />
            </button>
          </div>
        </section>

        <section className="settings-group settings-group--facilitator">
          <h2 className="settings-group__title">Prototype · for facilitators</h2>
          <p className="settings-group__hint">
            Restores the four demo items dated from today ({formatLong(todayISO())}) and removes anything that was
            added. Run this between participants so Chicken Breast always reads “Use today”.
          </p>
          {confirming ? (
            <div className="confirm" role="alertdialog" aria-label="Confirm reset">
              <p>
                Reset the fridge? {itemCount} {itemCount === 1 ? 'item' : 'items'} will be replaced with the demo set.
              </p>
              <div className="btn-row">
                <button type="button" className="btn btn--ghost" onClick={() => setConfirming(false)}>
                  Cancel
                </button>
                <button type="button" className="btn btn--danger" onClick={onReset}>
                  Yes, reset
                </button>
              </div>
            </div>
          ) : (
            <button type="button" className="btn btn--secondary" onClick={() => setConfirming(true)}>
              <Icon name="refresh" size={18} />
              Reset demo data
            </button>
          )}
          <p className="version">ShareFridge · React prototype v2.0 · Team 9, DECO6500 · September 2026</p>
        </section>
      </main>

      <BottomNav active="settings" onNav={onNav} />
    </div>
  );
}
