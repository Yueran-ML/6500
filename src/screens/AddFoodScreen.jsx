import { useRef, useState } from 'react';
import { CATEGORIES, STORAGE_LOCATIONS, CURRENT_USER } from '../data.js';
import ScreenHeader from '../components/ScreenHeader.jsx';
import Icon from '../components/Icon.jsx';

const EMPTY_FORM = { name: '', category: '', shared: null, expiry: '', storage: '' };
const REQUIRED_ORDER = ['name', 'category', 'shared', 'expiry'];

export default function AddFoodScreen({ mode = 'add', initial, onChange, onSave, onBack }) {
  const [form, setForm] = useState(() => ({ ...EMPTY_FORM, ...(initial || {}) }));
  const [errors, setErrors] = useState({});
  const refs = {
    name: useRef(null),
    category: useRef(null),
    shared: useRef(null),
    expiry: useRef(null),
  };
  const isEdit = mode === 'edit';

  // Every field is independent: changing one never touches another, and the
  // error for a field clears as soon as it is edited.
  const set = (patch) => {
    const next = { ...form, ...patch };
    setForm(next);
    onChange?.(next);
    setErrors((prev) => {
      const cleared = { ...prev };
      Object.keys(patch).forEach((k) => delete cleared[k]);
      return cleared;
    });
  };

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = 'Give the food a name.';
    if (!form.category) e.category = 'Choose a category.';
    if (form.shared !== true && form.shared !== false) e.shared = 'Choose Shared or Private.';
    if (!form.expiry) e.expiry = 'Pick an expiry date.';
    return e;
  };

  const submit = (ev) => {
    ev.preventDefault();
    const e = validate();
    setErrors(e);
    const first = REQUIRED_ORDER.find((k) => e[k]);
    if (first) {
      const el = refs[first].current;
      el?.scrollIntoView({ block: 'center', behavior: 'smooth' });
      el?.focus({ preventScroll: true });
      return;
    }
    onSave({
      name: form.name.trim(),
      category: form.category,
      owner: CURRENT_USER,
      shared: form.shared,
      expiry: form.expiry,
      storage: form.storage,
    });
  };

  return (
    <div className="screen">
      <ScreenHeader onBack={onBack} title={isEdit ? 'Edit Food' : 'Add Food'} />

      <form className="screen-body form" onSubmit={submit} noValidate>
        <div className={`field${errors.name ? ' has-error' : ''}`}>
          <label htmlFor="f-name">
            Food name <span className="req">*</span>
          </label>
          <input
            ref={refs.name}
            id="f-name"
            type="text"
            value={form.name}
            onChange={(e) => set({ name: e.target.value })}
            placeholder="e.g. Greek Yoghurt (Vanilla)"
            autoComplete="off"
            aria-invalid={Boolean(errors.name)}
            aria-describedby={errors.name ? 'e-name' : undefined}
          />
          {errors.name && (
            <p id="e-name" className="field__error">
              {errors.name}
            </p>
          )}
        </div>

        <div className={`field${errors.category ? ' has-error' : ''}`}>
          <label htmlFor="f-cat">
            Category <span className="req">*</span>
          </label>
          <div className="select-wrap">
            <select
              ref={refs.category}
              id="f-cat"
              value={form.category}
              onChange={(e) => set({ category: e.target.value })}
              aria-invalid={Boolean(errors.category)}
              aria-describedby={errors.category ? 'e-cat' : undefined}
            >
              <option value="">Select a category</option>
              {CATEGORIES.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.emoji} {c.id}
                </option>
              ))}
            </select>
            <Icon name="chevron" size={18} className="select-wrap__icon" />
          </div>
          {errors.category && (
            <p id="e-cat" className="field__error">
              {errors.category}
            </p>
          )}
        </div>

        <div className="field">
          <span className="field__label">
            Owner <span className="req">*</span>
          </span>
          <div className="locked-field">
            <span>You — {CURRENT_USER}</span>
            <Icon name="lock" size={16} />
          </div>
          <p className="field__hint">Items you add are always recorded as yours.</p>
        </div>

        <div className={`field${errors.shared ? ' has-error' : ''}`}>
          <span className="field__label" id="l-shared">
            Sharing status <span className="req">*</span>
          </span>
          <div ref={refs.shared} className="segmented" role="group" aria-labelledby="l-shared" tabIndex={-1}>
            <button
              type="button"
              className={`segmented__opt${form.shared === true ? ' is-on' : ''}`}
              aria-pressed={form.shared === true}
              onClick={() => set({ shared: true })}
            >
              Shared
            </button>
            <button
              type="button"
              className={`segmented__opt${form.shared === false ? ' is-on' : ''}`}
              aria-pressed={form.shared === false}
              onClick={() => set({ shared: false })}
            >
              <Icon name="lock" size={14} />
              Private
            </button>
          </div>
          <p className="field__hint">
            Shared items are available to housemates. Private items remain clearly marked as yours.
          </p>
          {errors.shared && <p className="field__error">{errors.shared}</p>}
        </div>

        <div className={`field${errors.expiry ? ' has-error' : ''}`}>
          <label htmlFor="f-exp">
            Expiry date <span className="req">*</span>
          </label>
          <div className="input-wrap">
            <input
              ref={refs.expiry}
              id="f-exp"
              type="date"
              value={form.expiry}
              onChange={(e) => set({ expiry: e.target.value })}
              aria-invalid={Boolean(errors.expiry)}
              aria-describedby={errors.expiry ? 'e-exp' : undefined}
            />
            <Icon name="calendar" size={18} className="input-wrap__icon" />
          </div>
          {errors.expiry && (
            <p id="e-exp" className="field__error">
              {errors.expiry}
            </p>
          )}
        </div>

        <div className="field">
          <label htmlFor="f-store">
            Storage location <span className="opt">optional</span>
          </label>
          <div className="select-wrap">
            <select id="f-store" value={form.storage} onChange={(e) => set({ storage: e.target.value })}>
              <option value="">Select a location</option>
              {STORAGE_LOCATIONS.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
            <Icon name="chevron" size={18} className="select-wrap__icon" />
          </div>
        </div>

        <div className="form-footer">
          <button type="submit" className="btn btn--primary btn--block">
            {isEdit ? 'Save changes' : 'Save Food'}
          </button>
        </div>
      </form>
    </div>
  );
}
