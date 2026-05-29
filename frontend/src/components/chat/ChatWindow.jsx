import { useEffect, useRef, useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import { messageApi } from '../../api/message.api';
import { getSocket } from '../../socket/socket';
import { useAuth } from '../../context/AuthContext';
import Avatar from '../common/Avatar';
import MessageBubble from './MessageBubble';
import MessageInput from './MessageInput';

export default function ChatWindow({ room, onMessageReceived }) {
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [typingUsers, setTypingUsers] = useState([]);
  const bottomRef = useRef(null);
  const typingTimeout = useRef(null);

  // Fetch history
  useEffect(() => {
    if (!room) return;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMessages([]);
    setLoading(true);

    messageApi
      .getMessages(room._id)
      .then(({ data }) => {
        // Backend already reverses and returns messages in ascending order
        const list = data.messages || data || [];
        setMessages(list);
      })
      .catch(() => setMessages([]))
      .finally(() => setLoading(false));
  }, [room]);

  // Socket events
  useEffect(() => {
    if (!room) return;
    const socket = getSocket();
    if (!socket) return;

    // user.id (not user._id) — backend login returns { id, email, ... }
    const myId = user?.id;

    const doJoin = () => socket.emit('join_room', room._id);

    // If already connected, join immediately; otherwise wait for connect
    if (socket.connected) {
      doJoin();
    } else {
      socket.once('connect', doJoin);
    }

    const onNewMessage = (msg) => {
      setMessages((prev) => [...prev, msg]);
      onMessageReceived?.(msg, room._id);
    };
    const onTyping = ({ userId }) => {
      if (userId !== myId)
        setTypingUsers((prev) => [...new Set([...prev, userId])]);
    };
    const onStopTyping = ({ userId }) => {
      setTypingUsers((prev) => prev.filter((id) => id !== userId));
    };

    socket.on('new_message', onNewMessage);
    socket.on('user_typing', onTyping);
    socket.on('user_stop_typing', onStopTyping);

    return () => {
      socket.off('connect', doJoin);
      socket.emit('leave_room', room._id);
      socket.off('new_message', onNewMessage);
      socket.off('user_typing', onTyping);
      socket.off('user_stop_typing', onStopTyping);
      setTypingUsers([]);
    };
  }, [room, user?.id, onMessageReceived]);

  // Auto-scroll
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, typingUsers]);

  const handleSend = useCallback(
    ({ content, type, file_url }) => {
      const socket = getSocket();
      if (!socket || !room) return;
      socket.emit('send_message', { roomId: room._id, content, type, file_url });
    },
    [room]
  );

  const handleTyping = useCallback(() => {
    const socket = getSocket();
    if (!socket || !room) return;
    socket.emit('typing', { roomId: room._id });
    clearTimeout(typingTimeout.current);
    typingTimeout.current = setTimeout(() => {
      socket.emit('stop_typing', { roomId: room._id });
    }, 2000);
  }, [room]);

  const partner = room?.members?.find((member) => {
    const userId = member.user?._id ? member.user._id : member.user;
    return userId?.toString() !== user?.id?.toString();
  });

  const partnerStatus = partner?.user?.is_online ? 'Đang online' : 'Ngoại tuyến';

  if (!room) {
    return (
      <div className="chat-window">
        <div className="empty-state">
          <span className="empty-icon">💬</span>
          <span className="empty-text">Trò chuyện</span>
          <span className="empty-sub">Bắt đầu một cuộc trò chuyện</span>
        </div>
      </div>
    );
  }

  return (
    <div className="chat-window">
      <div className="chat-header">
        <div className="chat-header-left">
          <Avatar name={room.name} src={room.avatar} size="sm" />
          <div>
            <div className="chat-header-name">{room.name}</div>
            <div className="chat-header-status">
              {typingUsers.length > 0 ? 'typing…' : partnerStatus || 'Active now'}
            </div>
          </div>
        </div>
        <div className="chat-header-actions">
          <button className="icon-btn" title="Video call" aria-label="Video call">📹</button>
          <button className="icon-btn" title="Voice call" aria-label="Voice call">📞</button>
          <button className="icon-btn" title="More options" aria-label="More options">⋮</button>
        </div>
      </div>

      {/* Messages */}
      <div className="messages-area" id="messages-area">
        {loading && (
          <div style={{ textAlign: 'center', padding: '20px' }}>
            <span className="spinner spinner-primary" style={{ display: 'inline-block' }} />
          </div>
        )}

        {!loading && messages.length === 0 && (
          <div className="empty-state" style={{ flex: 'none', paddingTop: '40px' }}>
            <span className="empty-icon">👋</span>
            <span className="empty-text">No messages yet</span>
            <span className="empty-sub">Hãy bắt đầu cuộc trò chuyện!</span>
          </div>
        )}

        {messages.map((msg) => (
          <MessageBubble
            key={msg._id}
            message={msg}
            isMine={
              msg.sender?._id === user?.id ||
              msg.sender === user?.id
            }
          />
        ))}

        {typingUsers.length > 0 && (
          <div className="msg-row in">
            <div className="typing-indicator">
              <span className="typing-dot" />
              <span className="typing-dot" />
              <span className="typing-dot" />
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <MessageInput
        roomId={room._id}
        onSend={handleSend}
        onTyping={handleTyping}
      />
    </div>
  );
}

ChatWindow.propTypes = {
  room: PropTypes.object,
  onMessageReceived: PropTypes.func,
};
