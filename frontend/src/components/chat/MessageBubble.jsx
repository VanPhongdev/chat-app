function formatTime(dateStr) {
  if (!dateStr) return '';
  return new Date(dateStr).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

export default function MessageBubble({ message, isMine }) {
  const { type, content, file_url, sender, createdAt } = message;

  return (
    <div className={`msg-row ${isMine ? 'out' : 'in'}`}>
      {!isMine && (
        <div
          className="avatar avatar-sm"
          title={sender?.full_name}
          style={{ flexShrink: 0 }}
        >
          {sender?.avatar ? (
            <img
              src={sender.avatar}
              alt={sender.full_name}
              style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }}
            />
          ) : (
            (sender?.full_name || '?')[0].toUpperCase()
          )}
        </div>
      )}

      <div className="msg-bubble">
        {type === 'image' || file_url ? (
          <img
            src={file_url || content}
            alt="Sent image"
            className="msg-image"
            onError={(e) => { e.target.style.display = 'none'; }}
          />
        ) : (
          <span>{content}</span>
        )}
        <span className="msg-time">{formatTime(createdAt)}</span>
      </div>
    </div>
  );
}
