import { useState } from 'react';
import { 
  Box, Card, Tabs, Tab, TextField, 
  Button, Typography, Avatar, Stack, Alert 
} from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { useAuth } from '../context/AuthContext'; // context 경로 확인 필요
import axios from 'axios'; // API 호출용

export default function LoginPage() {
  const [tab, setTab] = useState(0); // 0: 로그인, 1: 회원가입
  const [form, setForm] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const { saveAuth } = useAuth();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // API 엔드포인트 설정 (백엔드 주소에 맞게 수정)
    const url = tab === 0 
      ? 'http://localhost:8080/api/auth/login' 
      : 'http://localhost:8080/api/auth/signup';

    try {
      const response = await axios.post(url, form);
      
      if (tab === 0) {
        // 로그인 성공 시 토큰 저장
        saveAuth(response.data); 
      } else {
        // 회원가입 성공 시 로그인 탭으로 이동하거나 자동 로그인 처리
        alert('회원가입이 완료되었습니다. 로그인해주세요!');
        setTab(0);
      }
    } catch (err) {
      setError(err.response?.data?.message || '오류가 발생했습니다.');
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: '#f0f2f5' }}>
      <Card sx={{ p: 4, width: '100%', maxWidth: 400, borderRadius: 4, boxShadow: '0 8px 24px rgba(0,0,0,0.1)' }}>
        {/* form 태그로 감싸서 엔터 키 작동하게 함 */}
        <Box component="form" onSubmit={handleSubmit}>
          <Stack alignItems="center" spacing={2}>
            <Avatar sx={{ bgcolor: 'primary.main', width: 56, height: 56, mb: 1 }}>
              <LockOutlinedIcon />
            </Avatar>

            <Typography variant="h5" fontWeight={700}>📒 전화번호부</Typography>

            <Tabs value={tab} onChange={(_, v) => { setTab(v); setError(''); }} variant="fullWidth" sx={{ width: '100%', mb: 2 }}>
              <Tab label="로그인" />
              <Tab label="회원가입" />
            </Tabs>

            {error && <Alert severity="error" sx={{ width: '100%' }}>{error}</Alert>}

            <TextField 
              label="아이디" name="username" fullWidth required
              value={form.username} onChange={handleChange}
            />
            <TextField 
              label="비밀번호" name="password" type="password" fullWidth required
              value={form.password} onChange={handleChange}
            />

            <Button 
              type="submit" variant="contained" fullWidth size="large"
              sx={{ mt: 2, py: 1.5, borderRadius: 2, fontWeight: 600 }}
            >
              {tab === 0 ? '로그인' : '회원가입'}
            </Button>
          </Stack>
        </Box>
      </Card>
    </Box>
  );
}