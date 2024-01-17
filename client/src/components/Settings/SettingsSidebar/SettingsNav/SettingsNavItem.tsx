import { NavLink } from 'react-router-dom';
import styles from './SettingsNav.module.css';

interface SettingsNavItemProps {
  icon: React.ReactElement;
  content: string;
  link: string;
}

const SettingsNavItem = ({ content, link, icon }: SettingsNavItemProps) => {
  return (
    <NavLink
      to={link}
      className={({ isActive }) => {
        return isActive ? styles.active : undefined;
      }}
    >
      <div className="flex p-4 border-b items-center font-medium">
        {icon}
        <p className="ml-3 text-gray-700">{content}</p>
      </div>
    </NavLink>
  );
};

export default SettingsNavItem;
