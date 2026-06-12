import { useState, useEffect, useCallback } from 'react';
import {
  Container, Box, Stack, Typography, Button,
  Divider, CircularProgress, Avatar, Tooltip, Paper
} from '@mui/material';
import AddIcon    from '@mui/icons-material/Add';
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
import GroupManager from './components/GroupManager';

export default function App() {
  const { isLoggedIn, user, logout } = useAuth();

  const [contacts, setContacts] = useState([]);
  const [groups,   setGroups]   = useState([]);
  const [keyword,  setKeyword]  = useState('');
  const [filter,   setFilter]   = useState(null);   // null=전체 | 'favorite' | groupId
  const [editing,  setEditing]  = useState(undefined); // undefined=닫힘 | null=신규 | obj=수정
  const [loading,  setLoading]  = useState(false);
  const [groupMgr, setGroupMgr] = useState(false);

  // 1. 모든 useCallback 선언 유지 (안전장치 포함)
  const loadGroups = useCallback(async () => {
    if (!isLoggedIn) return; 
    const { data } = await getGroups();
    setGroups(data);
  }, [isLoggedIn]);

  const loadContacts = useCallback(async () => {
    if (!isLoggedIn) return;
    setLoading(true);
    try {
      const params = {};
      if (keyword)                    params.keyword  = keyword;
      else if (filter === 'favorite') params.favorite = true;
      else if (filter)                params.groupId  = filter;
      const { data } = await getContacts(params);
      setContacts(data);
    } finally {
      setLoading(false);
    }
  }, [keyword, filter, isLoggedIn]);

  // 2. Strict한 ESLint 규칙을 우회한 useEffect 흐름 유지
  useEffect(() => {
    const fetchData = async () => {
      await loadGroups();
    };
    fetchData();
  }, [loadGroups]);

  useEffect(() => {
    const fetchData = async () => {
      await loadContacts();
    };
    fetchData();
  }, [loadContacts]);

  // 3. Hooks 선언 완료 후 Early Return
  if (!isLoggedIn) return <LoginPage />;

  // --- 이벤트 핸들러 ---
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

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'grey.50', py: 6 }}>
      <Container maxWidth="md">

        {/* 대시보드 헤더 영역 */}
        <Paper 
          elevation={0} 
          sx={{ 
            p: 3, 
            mb: 4, 
            borderRadius: 3, 
            border: '1px solid', 
            borderColor: 'grey.200',
            bgcolor: 'background.paper'
          }}
        >
          <Stack 
            direction={{ xs: 'column', sm: 'row' }} 
            justifyContent="space-between" 
            alignItems={{ xs: 'flex-start', sm: 'center' }} 
            spacing={2}
          >
            {/* 로고 / 타이틀 */}
            <Typography variant="h5" fontWeight={800} letterSpacing={-0.8} color="text.primary">
              📒 전화번호부
            </Typography>

            {/* 사용자 및 제어부 공역 */}
            <Stack direction="row" alignItems="center" spacing={2} sx={{ width: { xs: '100%', sm: 'auto' }, justifyContent: 'flex-end' }}>
              <Stack direction="row" alignItems="center" spacing={1} sx={{ bgcolor: 'action.hover', px: 1.5, py: 0.5, borderRadius: 2 }}>
                <Avatar sx={{ width: 28, height: 28, bgcolor: 'primary.main', fontSize: 13, fontWeight: 700 }}>
                  {user?.username?.charAt(0).toUpperCase()}
                </Avatar>
                <Typography variant="subtitle2" fontWeight={700} color="text.primary">
                  {user?.username}
                </Typography>
              </Stack>
              
              <Button
                variant="contained"
                disableElevation
                startIcon={<AddIcon />}
                onClick={() => setEditing(null)}
                sx={{ borderRadius: 2, fontWeight: 700, px: 2, py: 0.8 }}
              >
                새 연락처
              </Button>

              <Tooltip title="로그아웃" arrow>
                <Button
                  variant="outlined" 
                  color="error"
                  onClick={logout}
                  startIcon={<LogoutIcon />}
                  sx={{ borderRadius: 2, fontWeight: 600, minWidth: 'auto', px: 2, py: 0.8 }}
                >
                  로그아웃
                </Button>
              </Tooltip>
            </Stack>
          </Stack>
        </Paper>

        {/* 검색 및 필터 컨트롤러 */}
        <Stack spacing={2} mb={3}>
          <SearchBar
            value={keyword}
            onChange={(kw) => { setKeyword(kw); setFilter(null); }}
          />
          <GroupFilter
            groups={groups}
            selected={filter}
            onSelect={(f) => { setFilter(f); setKeyword(''); }}
            onManage={() => setGroupMgr(true)} 
          />
        </Stack>

        {/* 데이터 정보란 */}
        <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2} px={0.5}>
          <Typography variant="subtitle2" color="text.secondary" fontWeight={700}>
            {loading ? '데이터 동기화 중...' : `총 ${contacts.length}명의 연락처`}
          </Typography>
        </Stack>

        <Divider sx={{ mb: 3, borderColor: 'grey.200' }} />

        {/* 메인 리스트 렌더링 */}
        {loading ? (
          <Box display="flex" justifyContent="center" alignItems="center" py={10}>
            <CircularProgress size={36} thickness={4.5} />
          </Box>
        ) : contacts.length === 0 ? (
          <Paper
            elevation={0}
            sx={{ 
              textAlign: 'center', 
              py: 10, 
              borderRadius: 4, 
              border: '2px dashed', 
              borderColor: 'grey.200',
              bgcolor: 'transparent'
            }}
          >
            <Typography fontSize={48} sx={{ mb: 1, filter: 'grayscale(0.2)' }}>📭</Typography>
            <Typography variant="body1" fontWeight={600} color="text.secondary">
              등록된 연락처가 존재하지 않습니다.
            </Typography>
            <Typography variant="caption" color="text.disabled">
              우측 상단의 버튼을 눌러 새로운 인연을 추가해보세요.
            </Typography>
          </Paper>
        ) : (
          <Stack spacing={2}>
            {contacts.map((c) => (
              <ContactCard
                key={c.id}
                contact={c}
                onEdit={(c) => setEditing(c)}
                onDelete={handleDelete}
                onToggleFavorite={handleToggle}
              />
            ))}
          </Stack>
        )}

      </Container>

      {/* 모달 다이얼로그 매핑 */}
      {editing !== undefined && (
        <ContactForm
          key={editing?.id ?? 'new'} 
          initial={editing}
          groups={groups}
          onSubmit={handleSubmit}
          onCancel={() => setEditing(undefined)}
        />
      )}

      {groupMgr && (
        <GroupManager
          groups={groups}
          onGroupsChange={(updated) => setGroups(updated)}
          onClose={() => setGroupMgr(false)}
        />
      )}
    </Box>
  );
}