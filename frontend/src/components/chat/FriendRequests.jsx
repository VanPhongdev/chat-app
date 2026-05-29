import { useState, useEffect } from 'react';
import { friendApi } from '../../api/friend.api';
import Avatar from '../common/Avatar';

export default function FriendRequests({ onClose, onAccepted }) {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [responding, setResponding] = useState({});

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const { data } = await friendApi.getReceivedRequests();
        setRequests(data);
      } catch (err) {
        console.error('Failed to fetch requests:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
  }, []);

  const handleAccept = async (requestId, senderId) => {
    setResponding(prev => ({ ...prev, [requestId]: 'accepting' }));
    try {
      await friendApi.acceptRequest(requestId);
      setRequests(prev => prev.filter(r => r._id !== requestId));
      onAccepted?.();
    } catch (err) {
      console.error('Failed to accept:', err);
    } finally {
      setResponding(prev => ({ ...prev, [requestId]: false }));
    }
  };

  const handleReject = async (requestId) => {
    setResponding(prev => ({ ...prev, [requestId]: 'rejecting' }));
    try {
      await friendApi.rejectRequest(requestId);
      setRequests(prev => prev.filter(r => r._id !== requestId));
    } catch (err) {
      console.error('Failed to reject:', err);
    } finally {
      setResponding(prev => ({ ...prev, [requestId]: false }));
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content friend-requests-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>Lời mời kết bạn ({requests.length})</h3>
          <button type="button" className="close-btn" onClick={onClose}>✕</button>
        </div>

        <div className="modal-body">
          {loading && <div className="loading">Đang tải...</div>}

          {!loading && requests.length === 0 && (
            <div className="empty-state">Không có lời mời kết bạn nào</div>
          )}

          <div className="requests-list">
            {requests.map((request) => (
              <div key={request._id} className="request-item">
                <Avatar name={request.sender.full_name} src={request.sender.avatar} size="md" />
                <div className="request-info">
                  <div className="request-name">{request.sender.full_name}</div>
                  <div className="request-email">{request.sender.email}</div>
                </div>
                <div className="request-actions">
                  <button
                    type="button"
                    className="btn-accept"
                    onClick={() => handleAccept(request._id, request.sender._id)}
                    disabled={responding[request._id]}
                  >
                    {responding[request._id] === 'accepting' ? '...' : '✓'}
                  </button>
                  <button
                    type="button"
                    className="btn-reject"
                    onClick={() => handleReject(request._id)}
                    disabled={responding[request._id]}
                  >
                    {responding[request._id] === 'rejecting' ? '...' : '✕'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
