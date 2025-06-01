import { varAlpha, mergeClasses } from 'minimal-shared/utils';

import { styled } from '@mui/material/styles';
import IconButton from '@mui/material/IconButton';

import { Iconify } from '../../iconify';
import { uploadClasses } from '../classes';

// ----------------------------------------------------------------------

export function SingleFilePreview({ file, sx, className, ...other }) {
  // Determine file name for display (extract from URL or use name property)
  let fileName;
  if (typeof file === 'string') {
    // extract file name from URL or path
    fileName = file.split('/').pop();
  } else if (file && (file.name || file.url)) {
    fileName = file.name || (typeof file.url === 'string' ? file.url.split('/').pop() : '');
  } else {
    fileName = '';
  }

  // Determine preview URL (handle string URLs, Blob/File objects, or objects with url/preview/path)
  let previewUrl;
  if (typeof file === 'string') {
    previewUrl = file;
  } else if (file instanceof Blob) {
    previewUrl = URL.createObjectURL(file);
  } else if (file && (file.url || file.preview || file.path)) {
    previewUrl = file.url || file.preview || file.path;
  } else {
    previewUrl = '';
  }

  return (
    <PreviewRoot
      className={mergeClasses([uploadClasses.uploadSinglePreview, className])}
      sx={sx}
      {...other}
    >
      <img alt={fileName} src={previewUrl} />
    </PreviewRoot>
  );
}

// ----------------------------------------------------------------------

const PreviewRoot = styled('div')(({ theme }) => ({
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  position: 'absolute',
  padding: theme.spacing(1),
  '& > img': {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    borderRadius: theme.shape.borderRadius,
  },
}));

// ----------------------------------------------------------------------

export function DeleteButton({ sx, ...other }) {
  return (
    <IconButton
      size="small"
      sx={[
        (theme) => ({
          top: 16,
          right: 16,
          zIndex: 9,
          position: 'absolute',
          color: varAlpha(theme.vars.palette.common.whiteChannel, 0.8),
          bgcolor: varAlpha(theme.vars.palette.grey['900Channel'], 0.72),
          '&:hover': { bgcolor: varAlpha(theme.vars.palette.grey['900Channel'], 0.48) },
        }),
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
      {...other}
    >
      <Iconify icon="mingcute:close-line" width={18} />
    </IconButton>
  );
}
