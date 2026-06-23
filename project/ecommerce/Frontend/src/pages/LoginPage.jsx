import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { login as loginApi } from '../api/auth';
import useAuthStore from '../store/authStore';
import { useState } from 'react';

export default function LoginPage() {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const { login } = useAuthStore();
  const navigate = useNavigate();
  const [error, setError] = useState('');

  const onSubmit = async (data) => {
    setError('');
    try {
      const res = await loginApi(data);
      login({ memberId: res.data.memberId, name: res.data.name, role: res.data.role }, res.data.accessToken);
      navigate('/');
    } catch (e) {
      setError(e.message || '로그인에 실패했습니다.');
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h1 className="auth-title">로그인</h1>
        <form onSubmit={handleSubmit(onSubmit)} className="form">
          <div className="form-group">
            <label className="form-label">이메일</label>
            <input
              className={`form-input ${errors.email ? 'form-input--error' : ''}`}
              type="email"
              {...register('email', { required: '이메일을 입력하세요.' })}
            />
            {errors.email && <p className="form-error">{errors.email.message}</p>}
          </div>
          <div className="form-group">
            <label className="form-label">비밀번호</label>
            <input
              className={`form-input ${errors.password ? 'form-input--error' : ''}`}
              type="password"
              {...register('password', { required: '비밀번호를 입력하세요.' })}
            />
            {errors.password && <p className="form-error">{errors.password.message}</p>}
          </div>
          {error && <p className="form-error form-error--block">{error}</p>}
          <button className="btn btn--primary btn--full" type="submit">로그인</button>
        </form>
        <p className="auth-link">계정이 없으신가요? <Link to="/signup">회원가입</Link></p>
      </div>
    </div>
  );
}
