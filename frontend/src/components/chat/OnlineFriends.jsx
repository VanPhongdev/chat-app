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
        const { data } = await friendApi.getOnlineFriends();
        setFriends(data);
      } catch (err) {
        console.error('Failed to fetch friends:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchFriends();
  }, [refreshTrigger]);

  const onlineFriendsCount = friends.filter(f => f.is_online).length;

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

        {friends.map((friend) => (
          <button
            key={friend._id}
            type="button"
            className={`friend-item ${friend.is_online ? 'online' : 'offline'}`}
            onClick={() => onSelectFriend?.(friend)}
          >
            <div className="friend-avatar-wrapper">
              <Avatar name={friend.full_name} src={friend.avatar} size="sm" />
              <span className={`status-indicator ${friend.is_online ? 'online' : ''}`}></span>
            </div>
            <div className="friend-details">
              <div className="friend-name">{friend.full_name}</div>
              <div className="friend-status">{friend.is_online ? 'Đang hoạt động' : 'Ngoại tuyến'}</div>
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
