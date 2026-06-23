import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { signup } from '../api/auth';
import { useState } from 'react';

export default function SignupPage() {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const navigate = useNavigate();
  const [error, setError] = useState('');

  const onSubmit = async (data) => {
    setError('');
    try {
      await signup(data);
      navigate('/login');
    } catch (e) {
      setError(e.message || '회원가입에 실패했습니다.');
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h1 className="auth-title">회원가입</h1>
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
              placeholder="영문+숫자+특수문자(!@#$%) 8~20자"
              {...register('password', {
                required: '비밀번호를 입력하세요.',
                minLength: { value: 8, message: '8자 이상 입력하세요.' },
                pattern: {
                  value: /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[!@#$%]).+$/,
                  message: '영문, 숫자, 특수문자(!@#$%)를 포함해야 합니다.',
                },
              })}
            />
            {errors.password && <p className="form-error">{errors.password.message}</p>}
          </div>
          <div className="form-group">
            <label className="form-label">이름</label>
            <input
              className={`form-input ${errors.name ? 'form-input--error' : ''}`}
              {...register('name', { required: '이름을 입력하세요.' })}
            />
            {errors.name && <p className="form-error">{errors.name.message}</p>}
          </div>
          <div className="form-group">
            <label className="form-label">전화번호 (선택)</label>
            <input className="form-input" {...register('phone')} placeholder="010-0000-0000" />
          </div>
          <div className="form-group">
            <label className="form-label">주소 (선택)</label>
            <input className="form-input" {...register('address')} />
          </div>
          {error && <p className="form-error form-error--block">{error}</p>}
          <button className="btn btn--primary btn--full" type="submit">가입하기</button>
        </form>
        <p className="auth-link">이미 계정이 있으신가요? <Link to="/login">로그인</Link></p>
      </div>
    </div>
  );
}
