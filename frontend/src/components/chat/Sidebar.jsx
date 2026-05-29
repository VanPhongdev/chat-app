import Avatar from '../common/Avatar';
import PropTypes from 'prop-types';
import { useAuth } from '../../context/AuthContext';

const NAV = [
  { key: 'chats', icon: '💬', label: 'Nhắn tin' },
  { key: 'contacts', icon: '👥', label: 'Liên hệ' },
  { key: 'settings', icon: '⚙', label: 'Cài đặt' },
  { key: 'archive', icon: '🗂', label: 'Lưu trữ' },
];

export default function Sidebar({ activeNav, onNavChange, onFindFriends, onViewRequests }) {
  const { user, logout } = useAuth();

  return (
    <aside className="left-sidebar">
      {/* User profile */}
      <div className="sidebar-user">
        <Avatar name={user?.full_name} src={user?.avatar} size="sm" online />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div className="sidebar-user-name truncate">{user?.full_name}</div>
          <div className="sidebar-user-status">Online</div>
        </div>
      </div>

      {/* Friend Actions */}
      <div className="friend-actions">
        <button 
          className="btn-friend-action" 
          onClick={onFindFriends}
          title="Tìm kiếm và kết bạn"
          id="btn-find-friends"
        >
          <span>🔍</span> Tìm bạn
        </button>
        <button 
          className="btn-friend-action" 
          onClick={onViewRequests}
          title="Xem lời mời kết bạn"
          id="btn-view-requests"
        >
          <span>📬</span> Lời mời
        </button>
      </div>

      {/* Navigation */}
      {NAV.map(({ key, icon, label }) => (
        <button
          key={key}
          className={`nav-item ${activeNav === key ? 'active' : ''}`}
          onClick={() => onNavChange(key)}
          id={`nav-${key}`}
        >
          <span className="nav-icon">{icon}</span>
          {label}
        </button>
      ))}

      {/* Bottom */}
      <div className="sidebar-bottom">
        <button className="nav-item" id="nav-help">
          <span className="nav-icon">❓</span> Trợ giúp
        </button>
        <button className="nav-item" onClick={logout} id="btn-logout">
          <span className="nav-icon">🚪</span> Đăng xuất
        </button>
      </div>
    </aside>
  );
}

Sidebar.propTypes = {
  activeNav: PropTypes.string,
  onNavChange: PropTypes.func,
  onFindFriends: PropTypes.func,
  onViewRequests: PropTypes.func,
};
