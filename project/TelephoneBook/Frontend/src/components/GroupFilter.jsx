import { Stack, Chip } from '@mui/material';
import StarIcon from '@mui/icons-material/Star';

export default function GroupFilter({ groups, selected, onSelect }) {
  const items = [
    { id: null,       label: '전체',     icon: null },
    { id: 'favorite', label: '즐겨찾기', icon: <StarIcon fontSize="small" /> },
    ...groups.map((g) => ({ id: g.id, label: g.name, color: g.color })),
  ];

  return (
    <Stack direction="row" spacing={1} flexWrap="wrap" sx={{ mb: 2 }}>
      {items.map((item) => (
        <Chip
          key={item.id}
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
    </Stack>
  );
}