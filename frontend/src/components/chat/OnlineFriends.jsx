import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { friendApi } from '../../api/friend.api';
import Avatar from '../common/Avatar';

export default function OnlineFriends({ refreshTrigger, onSelectFriend }) {
  const [friends, setFriends] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFriends = async () => {
      setLoading(true);
      try {
        // fetch full friend list (includes online status)
        const { data } = await friendApi.getAllFriends();
        setFriends(data || []);
      } catch (err) {
        console.error('Failed to fetch friends:', err);
        setFriends([]);
      } finally {
        setLoading(false);
      }
    };

    fetchFriends();
  }, [refreshTrigger]);

  const onlineFriends = friends.filter((f) => f.is_online);
  const offlineFriends = friends.filter((f) => !f.is_online);
  const onlineFriendsCount = onlineFriends.length;

  return (
    <div className="online-friends-panel">
      <div className="panel-header">
        <h4>Bạn bè online</h4>
        <span className="count-badge">{onlineFriendsCount}</span>
      </div>

      <div className="friends-list">
        {loading && <div className="loading-sm">Đang tải...</div>}

        {!loading && friends.length === 0 && (
          <div className="empty-state-sm">Chưa có bạn bè</div>
        )}

        {/* Online friends */}
        {onlineFriends.length > 0 && (
          <div>
            {onlineFriends.map((friend) => (
              <button
                key={friend._id}
                type="button"
                className={`friend-item online`}
                onClick={() => onSelectFriend?.(friend)}
              >
                <div className="friend-avatar-wrapper">
                  <Avatar name={friend.full_name} src={friend.avatar} size="sm" />
                  <span className={`status-indicator online`}></span>
                </div>
                <div className="friend-details">
                  <div className="friend-name">{friend.full_name}</div>
                  <div className="friend-status">Đang hoạt động</div>
                </div>
              </button>
            ))}
          </div>
        )}

        {/* Offline friends header */}
        {!loading && offlineFriends.length > 0 && (
          <div className="panel-header offline-header" style={{ marginTop: '12px' }}>
            <h5>Bạn bè ngoại tuyến</h5>
            <span className="count-badge">{offlineFriends.length}</span>
          </div>
        )}

        {/* Offline friends list */}
        {offlineFriends.map((friend) => (
          <button
            key={friend._id}
            type="button"
            className={`friend-item offline`}
            onClick={() => onSelectFriend?.(friend)}
          >
            <div className="friend-avatar-wrapper">
              <Avatar name={friend.full_name} src={friend.avatar} size="sm" />
              <span className={`status-indicator`}></span>
            </div>
            <div className="friend-details">
              <div className="friend-name">{friend.full_name}</div>
              <div className="friend-status">Ngoại tuyến</div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

OnlineFriends.propTypes = {
  refreshTrigger: PropTypes.number,
  onSelectFriend: PropTypes.func,
};
