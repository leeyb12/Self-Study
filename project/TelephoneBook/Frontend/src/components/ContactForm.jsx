import { useState } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, Select, MenuItem, FormControl, InputLabel,
  FormControlLabel, Checkbox, Button, Grid, Stack,
  Divider, Typography,
} from '@mui/material';
import SearchIcon     from '@mui/icons-material/Search';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import StarIcon       from '@mui/icons-material/Star';

const EMPTY = {
  name: '', phone: '', email: '',
  postcode: '', addrRoad: '', addrJibun: '', addrDetail: '', addrExtra: '',
  groupId: '', memo: '', favorite: false,
};

export default function ContactForm({ initial, groups, onSubmit, onCancel }) {
  const [form, setForm] = useState(
    initial ? { ...EMPTY, ...initial, groupId: initial.groupId ?? '' } : EMPTY
  );

  const set = (k) => (e) =>
    setForm((f) => ({
      ...f,
      [k]: e.target.type === 'checkbox' ? e.target.checked : e.target.value,
    }));

  const openAddressSearch = () => {
    new window.daum.Postcode({
      oncomplete(data) {
        setForm((f) => ({
          ...f,
          postcode:   data.zonecode,
          addrRoad:   data.roadAddress,
          addrJibun:  data.jibunAddress,
          addrExtra:  data.buildingName ? `(${data.buildingName})` : '',
          addrDetail: '',
        }));
      },
    }).open();
  };

  return (
    <Dialog open onClose={onCancel} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ fontWeight: 700 }}>
        {initial?.id ? '✏️ 연락처 수정' : '➕ 새 연락처'}
      </DialogTitle>

      <DialogContent dividers>
        <Stack spacing={2.5} sx={{ pt: 1 }}>
          <Typography variant="caption" color="text.secondary" fontWeight={600}>
            기본 정보
          </Typography>

          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField label="이름 *" fullWidth value={form.name} onChange={set('name')} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField label="전화번호 *" fullWidth value={form.phone} onChange={set('phone')}
                placeholder="010-0000-0000" />
            </Grid>
          </Grid>

          <TextField label="이메일" fullWidth value={form.email} onChange={set('email')} />

          <FormControl fullWidth>
            <InputLabel>그룹</InputLabel>
            <Select label="그룹" value={form.groupId}
              onChange={(e) =>
                setForm((f) => ({ ...f, groupId: e.target.value ? Number(e.target.value) : '' }))
              }>
              <MenuItem value=""><em>그룹 없음</em></MenuItem>
              {groups.map((g) => (
                <MenuItem key={g.id} value={g.id}>{g.name}</MenuItem>
              ))}
            </Select>
          </FormControl>

          <Divider />

          <Typography variant="caption" color="text.secondary" fontWeight={600}>
            주소
          </Typography>

          <Grid container spacing={1} alignItems="center">
            <Grid item xs={8}>
              <TextField
                label="우편번호" fullWidth value={form.postcode}
                InputProps={{ readOnly: true }}
                placeholder="우편번호 검색 후 자동 입력"
              />
            </Grid>
            <Grid item xs={4}>
              <Button
                variant="outlined" fullWidth
                startIcon={<SearchIcon />}
                onClick={openAddressSearch}
                sx={{ height: 56 }}
              >
                주소 검색
              </Button>
            </Grid>
          </Grid>

          <TextField
            label="도로명주소" fullWidth value={form.addrRoad}
            InputProps={{ readOnly: true }}
            placeholder="주소 검색 후 자동 입력"
          />

          <TextField
            label="지번주소" fullWidth value={form.addrJibun}
            InputProps={{ readOnly: true }}
            size="small"
            sx={{ '& .MuiInputBase-input': { fontSize: 13, color: 'text.secondary' } }}
          />

          <Grid container spacing={2}>
            <Grid item xs={12} sm={7}>
              <TextField
                label="상세주소" fullWidth value={form.addrDetail}
                onChange={set('addrDetail')}
                placeholder="동, 호수 등 직접 입력"
              />
            </Grid>
            <Grid item xs={12} sm={5}>
              <TextField
                label="참고항목" fullWidth value={form.addrExtra}
                InputProps={{ readOnly: true }}
                size="small"
                sx={{ '& .MuiInputBase-input': { fontSize: 13, color: 'text.secondary' } }}
              />
            </Grid>
          </Grid>

          <Divider />

          <Typography variant="caption" color="text.secondary" fontWeight={600}>
            기타
          </Typography>

          <TextField
            label="메모" fullWidth multiline rows={2}
            value={form.memo} onChange={set('memo')}
          />

          <FormControlLabel
            control={
              <Checkbox
                checked={form.favorite} onChange={set('favorite')}
                icon={<StarBorderIcon />}
                checkedIcon={<StarIcon sx={{ color: '#f59e0b' }} />}
              />
            }
            label="즐겨찾기"
          />
        </Stack>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={onCancel} variant="outlined" color="inherit">취소</Button>
        <Button onClick={() => onSubmit(form)} variant="contained">저장</Button>
      </DialogActions>
    </Dialog>
  );
}