import { useState, useCallback } from 'react';
import { friendApi } from '../../api/friend.api';
import Avatar from '../common/Avatar';

export default function FriendSearch({ onClose }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [sentRequests, setSentRequests] = useState({});
  const [error, setError] = useState('');

  const handleSearch = useCallback(async (searchQuery) => {
    if (!searchQuery.trim()) {
      setResults([]);
      setError('');
      return;
    }

    setLoading(true);
    setError('');
    try {
      const { data } = await friendApi.search(searchQuery);
      setResults(data);
    } catch (err) {
      setError(err.response?.data?.message || 'Search failed');
      setResults([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleSendRequest = async (userId) => {
    try {
      await friendApi.sendRequest(userId);
      setSentRequests(prev => ({ ...prev, [userId]: true }));
      setTimeout(() => {
        setSentRequests(prev => ({ ...prev, [userId]: false }));
      }, 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send request');
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content friend-search-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>Tìm kiếm bạn bè</h3>
          <button type="button" className="close-btn" onClick={onClose}>✕</button>
        </div>

        <div className="modal-body">
          <div className="search-box">
            <input
              type="text"
              placeholder="Nhập tên để tìm kiếm..."
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                handleSearch(e.target.value);
              }}
              autoFocus
            />
          </div>

          {error && <div className="error-msg">{error}</div>}

          <div className="search-results">
            {loading && <div className="loading">Đang tìm kiếm...</div>}
            {!loading && results.length === 0 && query && (
              <div className="empty-state">Không tìm thấy user nào</div>
            )}
            {results.map((user) => (
              <div key={user._id} className="search-result-item">
                <Avatar name={user.full_name} src={user.avatar} size="md" />
                <div className="result-info">
                  <div className="result-name">{user.full_name}</div>
                  <div className="result-email">{user.email}</div>
                </div>
                <button
                  type="button"
                  className={`btn-add ${sentRequests[user._id] ? 'sent' : ''}`}
                  onClick={() => handleSendRequest(user._id)}
                  disabled={sentRequests[user._id]}
                >
                  {sentRequests[user._id] ? '✓ Đã gửi' : 'Kết bạn'}
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
