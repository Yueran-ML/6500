import Icon from './Icon.jsx';

const TABS = [
  { id: 'home', label: 'Fridge', icon: 'fridge' },
  { id: 'housemates', label: 'Housemates', icon: 'users' },
  { id: 'settings', label: 'Settings', icon: 'sliders' },
];

export default function BottomNav({ active, onNav }) {
  return (
    <nav className="bottom-nav" aria-label="Main">
      {TABS.map((t) => {
        const isActive = active === t.id;
        return (
          <button
            key={t.id}
            type="button"
            className={`bottom-nav__tab${isActive ? ' is-active' : ''}`}
            onClick={() => onNav(t.id)}
            aria-current={isActive ? 'page' : undefined}
          >
            <Icon name={t.icon} size={22} />
            <span>{t.label}</span>
          </button>
        );
      })}
    </nav>
  );
}
