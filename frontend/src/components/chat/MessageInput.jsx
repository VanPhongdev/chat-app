import { useState, useRef } from 'react';
import { messageApi } from '../../api/message.api';

export default function MessageInput({ onSend, onTyping, disabled }) {
  const [text, setText] = useState('');
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef(null);

  const handleSend = (e) => {
    e?.preventDefault();
    const trimmed = text.trim();
    if (!trimmed || disabled) return;
    onSend({ content: trimmed, type: 'text', file_url: '' });
    setText('');
  };

  const handleKey = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) handleSend();
  };

  const handleFile = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const { data } = await messageApi.uploadImage(file);
      onSend({ content: '', type: 'image', file_url: data.url });
    } catch {
      alert('Tải ảnh thất bại. Vui lòng thử lại.');
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  };

  return (
    <form className="msg-input-bar" onSubmit={handleSend} id="message-form">
      {/* Emoji placeholder */}
      <button type="button" className="icon-btn" title="Emoji" aria-label="Emoji">
        😊
      </button>

      <input
        id="message-input"
        type="text"
        className="msg-input"
        placeholder="Nhập tin nhắn..."
        value={text}
        onChange={(e) => {
          setText(e.target.value);
          onTyping?.(); // trigger typing indicator
        }}
        onKeyDown={handleKey}
        disabled={disabled || uploading}
        autoComplete="off"
      />

      {/* Image upload */}
      <button
        type="button"
        className="icon-btn"
        title="Đính kèm ảnh"
        aria-label="Đính kèm ảnh"
        onClick={() => fileRef.current?.click()}
        disabled={uploading}
      >
        {uploading ? <span className="spinner spinner-primary" style={{ width: 16, height: 16 }} /> : '📎'}
      </button>

      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        style={{ display: 'none' }}
        onChange={handleFile}
      />

      {/* Send */}
      <button
        type="submit"
        className="btn-send"
        disabled={!text.trim() || disabled}
        id="btn-send"
        aria-label="Gửi tin nhắn"
      >
        ➤
      </button>
    </form>
  );
}
