import {
  Card, CardContent, Avatar, Typography, IconButton,
  Chip, Stack, Tooltip, Box,
} from '@mui/material';
import StarIcon       from '@mui/icons-material/Star';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import EditIcon       from '@mui/icons-material/Edit';
import DeleteIcon     from '@mui/icons-material/Delete';
import PhoneIcon      from '@mui/icons-material/Phone';
import EmailIcon      from '@mui/icons-material/Email';
import LocationOnIcon from '@mui/icons-material/LocationOn';

export default function ContactCard({ contact, onEdit, onDelete, onToggleFavorite }) {
  const { name, phone, email, groupName, groupColor, favorite, memo, addrRoad, addrDetail } = contact;

  return (
    <Card variant="outlined" sx={{
      mb: 1.5, borderRadius: 3,
      boxShadow: '0 2px 8px rgba(0,0,0,0.06)', border: '1px solid #e2e8f0',
      transition: 'box-shadow .2s',
      '&:hover': { boxShadow: '0 4px 16px rgba(0,0,0,0.12)' },
    }}>
      <CardContent sx={{ py: 1.5, '&:last-child': { pb: 1.5 } }}>
        <Stack direction="row" alignItems="center" spacing={2}>

          <Avatar sx={{
            bgcolor: groupColor || '#6366f1', width: 46, height: 46,
            fontWeight: 700, fontSize: 18,
          }}>
            {name.charAt(0)}
          </Avatar>

          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Stack direction="row" alignItems="center" spacing={1} mb={0.3}>
              <Typography fontWeight={700} fontSize={15} noWrap>{name}</Typography>
              {groupName && (
                <Chip label={groupName} size="small" sx={{
                  fontSize: 11, height: 20,
                  bgcolor: groupColor + '22', color: groupColor,
                  fontWeight: 600, border: 'none',
                }} />
              )}
            </Stack>
            <Stack direction="row" alignItems="center" spacing={0.5}>
              <PhoneIcon sx={{ fontSize: 13, color: 'text.secondary' }} />
              <Typography fontSize={13} color="text.secondary">{phone}</Typography>
            </Stack>
            {email && (
              <Stack direction="row" alignItems="center" spacing={0.5}>
                <EmailIcon sx={{ fontSize: 13, color: 'text.disabled' }} />
                <Typography fontSize={12} color="text.disabled" noWrap>{email}</Typography>
              </Stack>
            )}
            {addrRoad && (
              <Stack direction="row" alignItems="flex-start" spacing={0.5}>
                <LocationOnIcon sx={{ fontSize: 13, color: 'text.disabled', mt: '2px' }} />
                <Typography fontSize={12} color="text.disabled" noWrap>
                  {addrRoad}{addrDetail && ` ${addrDetail}`}
                </Typography>
              </Stack>
            )}
            {memo && (
              <Typography fontSize={12} color="text.disabled" fontStyle="italic" noWrap>
                {memo}
              </Typography>
            )}
          </Box>

          <Stack direction="row" alignItems="center">
            <Tooltip title={favorite ? '즐겨찾기 해제' : '즐겨찾기'}>
              <IconButton onClick={() => onToggleFavorite(contact.id)} size="small">
                {favorite
                  ? <StarIcon sx={{ color: '#f59e0b' }} />
                  : <StarBorderIcon sx={{ color: '#d1d5db' }} />}
              </IconButton>
            </Tooltip>
            <Tooltip title="수정">
              <IconButton onClick={() => onEdit(contact)} size="small">
                <EditIcon fontSize="small" />
              </IconButton>
            </Tooltip>
            <Tooltip title="삭제">
              <IconButton onClick={() => onDelete(contact.id)} size="small" color="error">
                <DeleteIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          </Stack>

        </Stack>
      </CardContent>
    </Card>
  );
}