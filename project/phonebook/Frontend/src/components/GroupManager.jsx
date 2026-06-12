import { useState } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Button, Stack, TextField, IconButton, Tooltip,
  Typography, Box, Divider,
} from '@mui/material';
import AddIcon        from '@mui/icons-material/Add';
import EditIcon       from '@mui/icons-material/Edit';
import DeleteIcon     from '@mui/icons-material/Delete';
import CheckIcon      from '@mui/icons-material/Check';
import CloseIcon      from '@mui/icons-material/Close';
import { createGroup, updateGroup, deleteGroup } from '../api/contactApi';

const PRESET_COLORS = [
  '#ef4444', '#f97316', '#f59e0b', '#84cc16',
  '#10b981', '#06b6d4', '#3b82f6', '#8b5cf6',
  '#ec4899', '#6b7280',
];

// 단일 그룹 행 (보기 / 편집 토글)
function GroupRow({ group, onSaved, onDeleted }) {
  const [editing, setEditing] = useState(false);
  const [name,    setName]    = useState(group.name);
  const [color,   setColor]   = useState(group.color);
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    if (!name.trim()) return;
    setLoading(true);
    try {
      const { data } = await updateGroup(group.id, { name, color });
      onSaved(data);
      setEditing(false);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setName(group.name);
    setColor(group.color);
    setEditing(false);
  };

  const handleDelete = async () => {
    if (!window.confirm(`'${group.name}' 그룹을 삭제하시겠습니까?\n해당 그룹의 연락처는 '그룹 없음'으로 변경됩니다.`)) return;
    await deleteGroup(group.id);
    onDeleted(group.id);
  };

  return (
    <Box sx={{ py: 1 }}>
      {editing ? (
        <Stack spacing={1.5}>
          <TextField
            label="그룹 이름" size="small" fullWidth
            value={name} onChange={(e) => setName(e.target.value)}
            autoFocus
          />
          {/* 색상 팔레트 */}
          <Stack direction="row" spacing={0.8} flexWrap="wrap">
            {PRESET_COLORS.map((c) => (
              <Box
                key={c}
                onClick={() => setColor(c)}
                sx={{
                  width: 28, height: 28, borderRadius: '50%',
                  bgcolor: c, cursor: 'pointer',
                  border: color === c ? '3px solid #1e293b' : '2px solid transparent',
                  transition: 'border .15s',
                }}
              />
            ))}
            {/* 직접 입력 */}
            <Tooltip title="직접 입력">
              <Box sx={{ position: 'relative', width: 28, height: 28 }}>
                <input
                  type="color"
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                  style={{
                    opacity: 0, position: 'absolute',
                    inset: 0, width: '100%', height: '100%', cursor: 'pointer',
                  }}
                />
                <Box sx={{
                  width: 28, height: 28, borderRadius: '50%',
                  bgcolor: color, border: '2px dashed #94a3b8',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 13,
                }}>
                  🎨
                </Box>
              </Box>
            </Tooltip>
          </Stack>

          <Stack direction="row" justifyContent="flex-end" spacing={1}>
            <Button size="small" onClick={handleCancel} startIcon={<CloseIcon />}>
              취소
            </Button>
            <Button
              size="small" variant="contained"
              onClick={handleSave} disabled={loading}
              startIcon={<CheckIcon />}
            >
              저장
            </Button>
          </Stack>
        </Stack>
      ) : (
        <Stack direction="row" alignItems="center" spacing={1.5}>
          <Box sx={{
            width: 18, height: 18, borderRadius: '50%',
            bgcolor: group.color, flexShrink: 0,
          }} />
          <Typography fontSize={14} fontWeight={500} flex={1}>{group.name}</Typography>
          <Tooltip title="수정">
            <IconButton size="small" onClick={() => setEditing(true)}>
              <EditIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="삭제">
            <IconButton size="small" color="error" onClick={handleDelete}>
              <DeleteIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Stack>
      )}
    </Box>
  );
}

// 새 그룹 추가 폼
function AddGroupRow({ onAdded }) {
  const [open,    setOpen]    = useState(false);
  const [name,    setName]    = useState('');
  const [color,   setColor]   = useState('#6366f1');
  const [loading, setLoading] = useState(false);

  const handleAdd = async () => {
    if (!name.trim()) return;
    setLoading(true);
    try {
      const { data } = await createGroup({ name, color });
      onAdded(data);
      setName('');
      setColor('#6366f1');
      setOpen(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ pt: 1 }}>
      {open ? (
        <Stack spacing={1.5}>
          <TextField
            label="새 그룹 이름" size="small" fullWidth
            value={name} onChange={(e) => setName(e.target.value)}
            autoFocus
            onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
          />
          <Stack direction="row" spacing={0.8} flexWrap="wrap">
            {PRESET_COLORS.map((c) => (
              <Box
                key={c}
                onClick={() => setColor(c)}
                sx={{
                  width: 28, height: 28, borderRadius: '50%', bgcolor: c,
                  cursor: 'pointer',
                  border: color === c ? '3px solid #1e293b' : '2px solid transparent',
                  transition: 'border .15s',
                }}
              />
            ))}
            <Tooltip title="직접 입력">
              <Box sx={{ position: 'relative', width: 28, height: 28 }}>
                <input
                  type="color"
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                  style={{
                    opacity: 0, position: 'absolute',
                    inset: 0, width: '100%', height: '100%', cursor: 'pointer',
                  }}
                />
                <Box sx={{
                  width: 28, height: 28, borderRadius: '50%',
                  bgcolor: color, border: '2px dashed #94a3b8',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 13,
                }}>🎨</Box>
              </Box>
            </Tooltip>
          </Stack>
          <Stack direction="row" justifyContent="flex-end" spacing={1}>
            <Button size="small" onClick={() => { setOpen(false); setName(''); }}
              startIcon={<CloseIcon />}>
              취소
            </Button>
            <Button size="small" variant="contained"
              onClick={handleAdd} disabled={loading}
              startIcon={<AddIcon />}>
              추가
            </Button>
          </Stack>
        </Stack>
      ) : (
        <Button
          startIcon={<AddIcon />} size="small"
          onClick={() => setOpen(true)}
          sx={{ color: 'text.secondary' }}
        >
          새 그룹 추가
        </Button>
      )}
    </Box>
  );
}

// 메인 모달
export default function GroupManager({ groups, onGroupsChange, onClose }) {
  const [list, setList] = useState(groups);

  const handleSaved = (updated) => {
    const next = list.map((g) => g.id === updated.id ? updated : g);
    setList(next);
    onGroupsChange(next);
  };

  const handleDeleted = (id) => {
    const next = list.filter((g) => g.id !== id);
    setList(next);
    onGroupsChange(next);
  };

  const handleAdded = (newGroup) => {
    const next = [...list, newGroup];
    setList(next);
    onGroupsChange(next);
  };

  return (
    <Dialog open onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle sx={{ fontWeight: 700 }}>🏷️ 그룹 관리</DialogTitle>

      <DialogContent dividers>
        {list.length === 0 ? (
          <Typography fontSize={14} color="text.secondary" textAlign="center" py={2}>
            그룹이 없습니다.
          </Typography>
        ) : (
          list.map((g, i) => (
            <Box key={g.id}>
              <GroupRow
                group={g}
                onSaved={handleSaved}
                onDeleted={handleDeleted}
              />
              {i < list.length - 1 && <Divider />}
            </Box>
          ))
        )}

        <Divider sx={{ my: 1 }} />
        <AddGroupRow onAdded={handleAdded} />
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={onClose} variant="contained">닫기</Button>
      </DialogActions>
    </Dialog>
  );
}