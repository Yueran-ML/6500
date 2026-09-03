import Icon from './Icon.jsx';

export default function ScreenHeader({ title, subtitle, onBack, right }) {
  return (
    <header className={`screen-header${onBack ? ' screen-header--sub' : ''}`}>
      {onBack && (
        <button type="button" className="icon-btn" onClick={onBack} aria-label="Back">
          <Icon name="back" size={22} />
        </button>
      )}
      <div className="screen-header__titles">
        {title && <h1 className="screen-header__title">{title}</h1>}
        {subtitle && <p className="screen-header__subtitle">{subtitle}</p>}
      </div>
      {right && <div className="screen-header__right">{right}</div>}
    </header>
  );
}
