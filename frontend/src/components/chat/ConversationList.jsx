import { useState } from 'react';
import Avatar from '../common/Avatar';

function formatTime(dateStr) {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  const now = new Date();
  const diffDays = Math.floor((now - d) / 86400000);
  if (diffDays === 0) return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  if (diffDays === 1) return 'Yesterday';
  return d.toLocaleDateString([], { month: 'short', day: 'numeric' });
}

export default function ConversationList({ rooms, activeRoomId, onSelect }) {
  const [search, setSearch] = useState('');

  const filtered = rooms.filter((r) =>
    r.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="conv-list">
      <div className="conv-list-header">
        <div className="search-bar">
          <span className="search-icon">🔍</span>
          <input
            id="search-conversations"
            type="text"
            className="search-input"
            placeholder="Tìm kiếm cuộc trò chuyện..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="conv-list-body">
        {filtered.length === 0 && (
          <div style={{ padding: '20px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '13px' }}>
            Không tìm thấy cuộc trò chuyện nào. Hãy thử tìm kiếm khác hoặc bắt đầu một cuộc trò chuyện mới!
          </div>
        )}
        {filtered.map((room) => {
          const lastMsg = room.last_message;
          const preview = lastMsg?.content
            ? lastMsg.content.length > 40
              ? lastMsg.content.slice(0, 40) + '…'
              : lastMsg.content
            : 'No messages yet';

          return (
            <div
              key={room._id}
              className={`conv-item ${activeRoomId === room._id ? 'active' : ''}`}
              onClick={() => onSelect(room)}
              id={`conv-${room._id}`}
            >
              <Avatar name={room.name} src={room.avatar} size="md" />
              <div className="conv-info">
                <div className="conv-name">{room.name}</div>
                <div className="conv-preview">{preview}</div>
              </div>
              <div className="conv-meta">
                <span className="conv-time">
                  {formatTime(lastMsg?.created_at || room.updatedAt)}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
