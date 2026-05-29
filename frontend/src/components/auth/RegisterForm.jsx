import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function RegisterForm() {
  const { register, loading } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({ full_name: '', email: '', password: '' });
  const [showPwd, setShowPwd] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.full_name || !form.email || !form.password) {
      setError('Vui lòng nhập đầy đủ thông tin.');
      return;
    }
    if (form.password.length < 6) {
      setError('Mật khẩu phải có ít nhất 6 ký tự.');
      return;
    }
    const result = await register(form);
    if (result.success) {
      setSuccess(true);
      setTimeout(() => navigate('/login'), 1500);
    } else {
      setError(result.message);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h1>Tạo tài khoản</h1>
        <p className="auth-subtitle">Tham gia trò chuyện một cách dễ dàng</p>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label" htmlFor="reg-name">Họ và tên</label>
            <div className="input-wrapper">
              <span className="input-icon"></span>
              <input
                id="reg-name"
                name="full_name"
                type="text"
                className="form-input"
                placeholder="Nguyen Van A"
                value={form.full_name}
                onChange={handleChange}
                autoComplete="name"
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="reg-email">Email</label>
            <div className="input-wrapper">
              <span className="input-icon"></span>
              <input
                id="reg-email"
                name="email"
                type="email"
                className="form-input"
                placeholder="email@example.com"
                value={form.email}
                onChange={handleChange}
                autoComplete="email"
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="reg-password">Mật khẩu</label>
            <div className="input-wrapper">
              <span className="input-icon"></span>
              <input
                id="reg-password"
                name="password"
                type={showPwd ? 'text' : 'password'}
                className="form-input"
                placeholder="••••••••"
                value={form.password}
                onChange={handleChange}
                autoComplete="new-password"
              />
              <button
                type="button"
                className="input-eye"
                onClick={() => setShowPwd((v) => !v)}
                aria-label="Hiển thị mật khẩu"
              >
              </button>
            </div>
            <p className="form-hint">Mật khẩu tối thiểu 6 ký tự</p>
          </div>

          {error && <p className="form-error">{error}</p>}
          {success && (
            <p style={{ color: 'var(--online)', fontSize: '13px', marginBottom: '8px' }}>
              Tạo tài khoản thành công! Đang chuyển hướng đến đăng nhập...
            </p>
          )}

          <button type="submit" className="btn-primary" disabled={loading || success} id="btn-register">
            {loading ? <span className="spinner" /> : 'Đăng Ký'}
          </button>
        </form>

        <div className="auth-divider">HOẶC TIẾP TỤC VỚI</div>

        <div className="social-btns">
          <button type="button" className="btn-social" id="btn-google">
            <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" width={16} />
            Google
          </button>
          <button type="button" className="btn-social" id="btn-apple">
            <img src="https://www.svgrepo.com/show/452210/apple.svg" alt="Apple" width={16} />
            Apple
          </button>
        </div>

        <div className="auth-footer">
          Đã có tài khoản?{' '}
          <Link to="/login" className="auth-link">Đăng Nhập</Link>
        </div>
      </div>
    </div>
  );
}
