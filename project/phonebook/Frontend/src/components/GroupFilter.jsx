import { Stack, Chip, IconButton, Tooltip } from '@mui/material';
import StarIcon    from '@mui/icons-material/Star';
import SettingsIcon from '@mui/icons-material/Settings';

export default function GroupFilter({ groups, selected, onSelect, onManage }) {
  const items = [
    { id: null,       label: '전체',     icon: null },
    { id: 'favorite', label: '즐겨찾기', icon: <StarIcon fontSize="small" /> },
    ...groups.map((g) => ({ id: g.id, label: g.name, color: g.color })),
  ];

  return (
    <Stack direction="row" spacing={1} flexWrap="wrap" alignItems="center" sx={{ mb: 2 }}>
      {items.map((item) => (
        <Chip
          key={item.id ?? 'all'}
          label={item.label}
          icon={item.icon}
          onClick={() => onSelect(item.id)}
          variant={selected === item.id ? 'filled' : 'outlined'}
          color={selected === item.id ? 'primary' : 'default'}
          sx={{
            fontWeight: selected === item.id ? 700 : 400,
            ...(item.color && selected === item.id && {
              bgcolor: item.color,
              '&:hover': { bgcolor: item.color + 'dd' },
            }),
          }}
        />
      ))}
      {/* 그룹 관리 버튼 */}
      <Tooltip title="그룹 관리">
        <IconButton size="small" onClick={onManage} sx={{ ml: 'auto' }}>
          <SettingsIcon fontSize="small" />
        </IconButton>
      </Tooltip>
    </Stack>
  );
}