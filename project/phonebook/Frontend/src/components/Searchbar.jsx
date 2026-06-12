import { TextField, InputAdornment } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';

export default function SearchBar({ value, onChange }) {
  return (
    <TextField
      fullWidth
      variant="outlined"
      placeholder="이름, 전화번호, 이메일 검색..."
      value={value}
      onChange={(e) => onChange(e.target.value)}
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <SearchIcon color="action" />
          </InputAdornment>
        ),
      }}
      sx={{ mb: 2, bgcolor: 'white', borderRadius: 2 }}
    />
  );
}