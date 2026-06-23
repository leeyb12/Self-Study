import { useState } from 'react';
import {
  Box, Card, CardContent, TextField, Button,
  Typography, Alert, Tabs, Tab, Stack,
} from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { login, signup } from '../api/authApi';
import { useAuth } from '../context/auth-context';

export default function LoginPage() {
  const { saveAuth } = useAuth();
  const [tab,     setTab]     = useState(0);   // 0=로그인, 1=회원가입
  const [form,    setForm]    = useState({ username: '', password: '' });
  const [error,   setError]   = useState('');
  const [success, setSuccess] = useState(''); // 회원가입 성공 메시지용 상태 추가
  const [loading, setLoading] = useState(false);

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const handleSubmit = async () => {
    if (!form.username || !form.password) {
      setError('아이디와 비밀번호를 입력해주세요.');
      return;
    }
    setLoading(true);
    setError('');
    setSuccess('');
    
    try {
      const fn = tab === 0 ? login : signup;
      const { data } = await fn(form);
      
      if (tab === 1) {
        // 회원가입 성공 시 탭을 로그인으로 이동시키고 안내 메시지 출력
        setSuccess('회원가입이 완료되었습니다! 로그인을 진행해주세요.');
        setTab(0);
        setForm({ username: '', password: '' });
      } else {
        saveAuth({ token: data.token, username: data.username });
      }
    } catch (e) {
      setError(e.response?.data?.message || '오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{
      minHeight: '100vh',
      bgcolor: 'grey.50', // ⭐️ 배경을 차분하고 밝은 회색조로 변경
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      p: 2
    }}>
      <Card sx={{ 
        width: 400, 
        borderRadius: 4, 
        // ⭐️ 부드러운 프리미엄 섀도우와 가벼운 보더 조합
        boxShadow: '0 12px 40px rgba(0,0,0,0.06)',
        border: '1px solid',
        borderColor: 'grey.100',
        bgcolor: 'background.paper'
      }}>
        <CardContent sx={{ p: 4 }}>

          {/* 상단 로고 및 타이틀 섹션 */}
          <Stack alignItems="center" mb={4}>
            <Box sx={{
              // ⭐️ 트렌디한 그라데이션 백그라운드 아이콘 박스
              background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)', 
              borderRadius: 3, // 완전한 원형 대신 스퀘어 라운드 형태
              p: 1.5, 
              mb: 2, 
              color: '#fff', 
              display: 'flex',
              boxShadow: '0 4px 14px rgba(29, 78, 216, 0.3)'
            }}>
              <LockOutlinedIcon fontSize="medium" />
            </Box>
            <Typography variant="h5" fontWeight={800} letterSpacing={-0.8} color="text.primary">
              📒 전화번호부
            </Typography>
            <Typography variant="caption" color="text.disabled" fontWeight={600} mt={0.5}>
              {tab === 0 ? '서비스 이용을 위해 로그인하세요' : '새로운 계정을 생성하세요'}
            </Typography>
          </Stack>

          {/* 탭 메뉴 슬라이더 */}
          <Tabs
            value={tab}
            onChange={(_, v) => { setTab(v); setError(''); setSuccess(''); }}
            variant="fullWidth"
            sx={{ 
              mb: 3,
              borderBottom: '1px solid',
              borderColor: 'grey.100',
              '& .MuiTabs-indicator': { height: 3, borderRadius: '3px 3px 0 0' },
              '& .MuiTab-root': { fontWeight: 700, fontSize: '0.95rem', color: 'text.secondary' }
            }}
          >
            <Tab label="로그인" />
            <Tab label="회원가입" />
          </Tabs>

          {/* 알림 피드백 구역 */}
          {error && <Alert severity="error" variant="soft" sx={{ mb: 2.5, borderRadius: 2, fontWeight: 600 }}>{error}</Alert>}
          {success && <Alert severity="success" variant="soft" sx={{ mb: 2.5, borderRadius: 2, fontWeight: 600 }}>{success}</Alert>}

          {/* 입력 폼 필드 구성 */}
          <Stack spacing={2.5}>
            <TextField
              label="아이디" 
              fullWidth
              value={form.username}
              onChange={set('username')}
              InputProps={{ sx: { borderRadius: 2 } }} // 라운딩 처리
            />
            <TextField
              label="비밀번호" 
              type="password" 
              fullWidth
              value={form.password}
              onChange={set('password')}
              onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
              InputProps={{ sx: { borderRadius: 2 } }} // 라운딩 처리
            />
            
            <Button
              variant="contained" 
              fullWidth 
              size="large"
              disableElevation // 플랫하고 모던한 스타일을 위해 입체 섀도우 제거
              onClick={handleSubmit}
              disabled={loading}
              sx={{ 
                fontWeight: 700, 
                py: 1.4, 
                borderRadius: 2,
                fontSize: '1rem',
                textTransform: 'none',
                mt: 1
              }}
            >
              {loading ? '처리 중...' : tab === 0 ? '로그인' : '회원가입하기'}
            </Button>
          </Stack>

        </CardContent>
      </Card>
    </Box>
  );
}