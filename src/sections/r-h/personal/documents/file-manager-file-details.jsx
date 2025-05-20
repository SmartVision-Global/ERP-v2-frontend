import { useBoolean } from 'minimal-shared/hooks';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Drawer from '@mui/material/Drawer';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';

import { fData } from 'src/utils/format-number';
import { fDateTime } from 'src/utils/format-time';

import { Iconify } from 'src/components/iconify';
import { Scrollbar } from 'src/components/scrollbar';
import { fileFormat, FileThumbnail } from 'src/components/file-thumbnail';

// ----------------------------------------------------------------------

export function FileManagerFileDetails({
  file,
  open,
  onClose,
  onDelete,
  favorited,
  onFavorite,
  onCopyLink,
  ...other
}) {
  const showProperties = useBoolean(true);

  const renderHead = () => (
    <Box
      sx={{
        p: 2.5,
        display: 'flex',
        alignItems: 'center',
      }}
    >
      <Typography variant="h6" sx={{ flexGrow: 1 }}>
        Info
      </Typography>
    </Box>
  );

  const renderProperties = () => (
    <Stack spacing={1.5}>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          typography: 'subtitle2',
          justifyContent: 'space-between',
        }}
      >
        Properties
        <IconButton size="small" onClick={showProperties.onToggle}>
          <Iconify
            icon={
              showProperties.value ? 'eva:arrow-ios-upward-fill' : 'eva:arrow-ios-downward-fill'
            }
          />
        </IconButton>
      </Box>

      {showProperties.value && (
        <>
          <Box sx={{ display: 'flex', typography: 'caption', textTransform: 'capitalize' }}>
            <Box component="span" sx={{ width: 80, color: 'text.secondary', mr: 2 }}>
              Size
            </Box>

            {fData(file?.size)}
          </Box>

          <Box sx={{ display: 'flex', typography: 'caption', textTransform: 'capitalize' }}>
            <Box component="span" sx={{ width: 80, color: 'text.secondary', mr: 2 }}>
              Modified
            </Box>

            {fDateTime(file?.modifiedAt)}
          </Box>

          <Box sx={{ display: 'flex', typography: 'caption', textTransform: 'capitalize' }}>
            <Box component="span" sx={{ width: 80, color: 'text.secondary', mr: 2 }}>
              Type
            </Box>

            {fileFormat(file?.type)}
          </Box>
        </>
      )}
    </Stack>
  );

  return (
    <Drawer
      open={open}
      onClose={onClose}
      anchor="right"
      slotProps={{ backdrop: { invisible: true } }}
      PaperProps={{ sx: { width: 320 } }}
      {...other}
    >
      <Scrollbar>
        {renderHead()}

        <Stack
          spacing={2.5}
          sx={{ p: 2.5, justifyContent: 'center', bgcolor: 'background.neutral' }}
        >
          <FileThumbnail
            imageView
            file={file?.type === 'folder' ? file?.type : file?.url}
            sx={{ width: 'auto', height: 'auto', alignSelf: 'flex-start' }}
            slotProps={{
              img: { sx: { width: 320, height: 'auto', aspectRatio: '4/3', objectFit: 'cover' } },
              icon: { sx: { width: 64, height: 64 } },
            }}
          />

          <Typography variant="subtitle1" sx={{ wordBreak: 'break-all' }}>
            {file?.name}
          </Typography>

          <Divider sx={{ borderStyle: 'dashed' }} />

          {renderProperties()}
        </Stack>
      </Scrollbar>

      <Box sx={{ p: 2.5 }}>
        <Button
          fullWidth
          variant="soft"
          color="error"
          size="large"
          startIcon={<Iconify icon="solar:trash-bin-trash-bold" />}
          onClick={onDelete}
        >
          Delete
        </Button>
      </Box>
    </Drawer>
  );
}
