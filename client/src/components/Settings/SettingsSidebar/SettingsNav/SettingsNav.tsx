import styles from './SettingsNav.module.css';
import SettingsNavItem from './SettingsNavItem';
import { MdOutlineAccountTree, MdOutlineAccountCircle } from 'react-icons/md';

const navItems = [
  {
    content: 'Profile',
    link: '/settings/profile',
    icon: <MdOutlineAccountCircle size="1.5em" />
  },
  {
    content: 'Account',
    link: '/settings/account',
    icon: <MdOutlineAccountTree size="1.5em" />
  }
];

const SettingsNav = () => {
  return (
    <div className="h-full overflow-y-auto">
      <nav className={styles.navItems}>
        {navItems.map((item) => (
          <SettingsNavItem
            key={item.content}
            content={item.content}
            link={item.link}
            icon={item.icon}
          />
        ))}
      </nav>
    </div>
  );
};

export default SettingsNav;
