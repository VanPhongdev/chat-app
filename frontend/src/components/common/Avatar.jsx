export default function Avatar({ name = '', src = '', size = 'sm', online = false }) {
  const initials = name
    .split(' ')
    .map((w) => w[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  return (
    <div className="avatar-wrap">
      {src ? (
        <img
          src={src}
          alt={name}
          className={`avatar avatar-${size}`}
          style={{ borderRadius: '50%', objectFit: 'cover' }}
        />
      ) : (
        <div className={`avatar avatar-${size}`}>{initials || '?'}</div>
      )}
      {online && <span className="online-dot" />}
    </div>
  );
}
