import { useState, useEffect, useCallback } from 'react';
import {
  Container, Box, Stack, Typography, Button,
  Divider, CircularProgress, Avatar, Tooltip,
} from '@mui/material';
import AddIcon     from '@mui/icons-material/Add';
import LogoutIcon from '@mui/icons-material/Logout';
import { useAuth } from './context/AuthContext';
import LoginPage   from './components/LoginPage';
import SearchBar   from './components/SearchBar';
import GroupFilter from './components/GroupFilter';
import ContactForm from './components/ContactForm';
import ContactCard from './components/ContactCard';
import {
  getContacts, createContact, updateContact,
  toggleFavorite, deleteContact, getGroups,
} from './api/contactApi';

export default function App() {
  const { isLoggedIn, user, logout } = useAuth();

  // 1. 모든 상태(State) 선언
  const [contacts, setContacts] = useState([]);
  const [groups,   setGroups]   = useState([]);
  const [keyword,  setKeyword]  = useState('');
  const [filter,   setFilter]   = useState(null);
  const [editing,  setEditing]  = useState(undefined);
  const [loading,  setLoading]  = useState(false);

  // 2. 모든 콜백(useCallback) 선언
 const loadGroups = useCallback(async () => {
    try {
      const { data } = await getGroups();
      setGroups(data);
    } catch (error) {
      console.error("그룹 로딩 실패:", error);
    }
  }, []);

  const loadContacts = useCallback(async () => {
    setLoading(true);
    try {
      const params = {};
      if (keyword)           params.keyword  = keyword;
      else if (filter === 'favorite') params.favorite = true;
      else if (filter)                params.groupId  = filter;
      
      const { data } = await getContacts(params);
      setContacts(data);
    } catch (error) {
      console.error("연락처 로딩 실패:", error);
    } finally {
      setLoading(false);
    }
  }, [keyword, filter]);

  // 3. 모든 효과(useEffect) 선언
  // 린트 경고를 피하기 위해 .then()을 사용하거나 비동기 함수를 래핑합니다.
  useEffect(() => {
    if (isLoggedIn) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      loadGroups();
    }
  }, [loadGroups, isLoggedIn]);

  useEffect(() => {
    if (isLoggedIn) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      loadContacts();
    }
  }, [loadContacts, isLoggedIn]);

  // 4. 이벤트 핸들러
  const handleSubmit = async (form) => {
    if (editing?.id) await updateContact(editing.id, form);
    else             await createContact(form);
    setEditing(undefined);
    loadContacts();
  };

  const handleToggle = async (id) => {
    await toggleFavorite(id);
    loadContacts();
  };

  const handleDelete = async (id) => {
    if (!window.confirm('삭제하시겠습니까?')) return;
    await deleteContact(id);
    loadContacts();
  };

  // 5. 조건부 렌더링 (Hook 선언부보다 아래에 위치해야 함)
  if (!isLoggedIn) return <LoginPage />;

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default', py: 4 }}>
      <Container maxWidth="md">

        <Stack direction="row" justifyContent="space-between" alignItems="center" mb={3}>
          <Typography variant="h5" fontWeight={800} letterSpacing={-0.5}>
            📒 전화번호부
          </Typography>
          <Stack direction="row" alignItems="center" spacing={1.5}>
            <Avatar sx={{ width: 32, height: 32, bgcolor: 'primary.main', fontSize: 14 }}>
              {user?.username?.charAt(0).toUpperCase()}
            </Avatar>
            <Typography variant="body2" fontWeight={600}>{user?.username}</Typography>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => setEditing(null)}
              sx={{ borderRadius: 2, fontWeight: 600 }}
            >
              새 연락처
            </Button>
            <Tooltip title="로그아웃">
              <Button variant="outlined" color="inherit" onClick={logout}
                startIcon={<LogoutIcon />} sx={{ borderRadius: 2 }}>
                로그아웃
              </Button>
            </Tooltip>
          </Stack>
        </Stack>

        <SearchBar
          value={keyword}
          onChange={(kw) => { setKeyword(kw); setFilter(null); }}
        />
        <GroupFilter
          groups={groups}
          selected={filter}
          onSelect={(f) => { setFilter(f); setKeyword(''); }}
        />
        <Divider sx={{ mb: 2 }} />

        <Typography variant="body2" color="text.secondary" mb={1.5}>
          {loading ? '불러오는 중...' : `${contacts.length}명의 연락처`}
        </Typography>

        {loading ? (
          <Box textAlign="center" py={6}><CircularProgress /></Box>
        ) : contacts.length === 0 ? (
          <Box textAlign="center" py={8} color="text.disabled">
            <Typography fontSize={40}>📭</Typography>
            <Typography mt={1}>연락처가 없습니다.</Typography>
          </Box>
        ) : (
          contacts.map((c) => (
            <ContactCard key={c.id} contact={c}
              onEdit={(c) => setEditing(c)}
              onDelete={handleDelete}
              onToggleFavorite={handleToggle}
            />
          ))
        )}
      </Container>

      {editing !== undefined && (
        <ContactForm
          initial={editing}
          groups={groups}
          onSubmit={handleSubmit}
          onCancel={() => setEditing(undefined)}
        />
      )}
    </Box>
  );
}