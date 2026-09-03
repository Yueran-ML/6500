import { HOUSEHOLD, HOUSEMATES, CURRENT_USER } from '../data.js';
import ScreenHeader from '../components/ScreenHeader.jsx';
import BottomNav from '../components/BottomNav.jsx';
import Icon from '../components/Icon.jsx';
import { OwnerDot } from '../components/Tags.jsx';

export default function HousematesScreen({ items, onNav }) {
  return (
    <div className="screen">
      <ScreenHeader title="Housemates" subtitle={HOUSEHOLD} />

      <main className="screen-body">
        <ul className="people-list">
          {HOUSEMATES.map((h) => {
            const owned = items.filter((i) => i.owner === h.name);
            const shared = owned.filter((i) => i.shared).length;
            return (
              <li key={h.name} className="person">
                <OwnerDot name={h.name} size={40} />
                <div className="person__text">
                  <p className="person__name">
                    {h.name}
                    {h.name === CURRENT_USER && <span className="you-pill">You</span>}
                  </p>
                  <p className="person__meta">
                    {owned.length} {owned.length === 1 ? 'item' : 'items'} in the fridge · {shared} shared
                  </p>
                </div>
              </li>
            );
          })}
        </ul>

        <p className="notice">
          <Icon name="info" size={16} />
          Everyone in {HOUSEHOLD} can see the whole fridge. Only the owner of an item can change or remove it.
        </p>
      </main>

      <BottomNav active="housemates" onNav={onNav} />
    </div>
  );
}
