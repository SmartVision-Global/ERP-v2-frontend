import fr from 'dayjs/locale/fr';
import { useCallback } from 'react';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import { useTheme } from '@mui/material/styles';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import useMediaQuery from '@mui/material/useMediaQuery';
import FormHelperText from '@mui/material/FormHelperText';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

// ----------------------------------------------------------------------

export function CustomDateRangePicker({
  name,
  open,
  error,
  onClose,
  onSubmit,
  /********/
  startDate,
  endDate,
  onChangeStartDate,
  onChangeEndDate,
  /********/
  PaperProps,
  variant = 'input',
  title = 'Sélectionner un intervale',
  views,
  ...other
}) {
  const theme = useTheme();
  const mdUp = useMediaQuery(theme.breakpoints.up('md'));

  const isCalendarView = variant === 'calendar';

  const handleSubmit = useCallback(() => {
    onClose();
    onSubmit?.(name, startDate, endDate);
  }, [onClose, onSubmit, name, startDate, endDate]);

  const contentStyles = {
    py: 1,
    gap: 3,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    ...(isCalendarView && mdUp && { flexDirection: 'row' }),
  };

  const blockStyles = {
    borderRadius: 2,
    border: `dashed 1px ${theme.vars.palette.divider}`,
  };

  return (
    <Dialog
      fullWidth
      open={open}
      onClose={onClose}
      maxWidth={isCalendarView ? false : 'xs'}
      PaperProps={{
        ...PaperProps,
        sx: [
          { ...(isCalendarView && { maxWidth: 720 }) },
          ...(Array.isArray(PaperProps?.sx) ? (PaperProps?.sx ?? []) : [PaperProps?.sx]),
        ],
      }}
      {...other}
    >
      <DialogTitle sx={{ pb: 2 }}>{title}</DialogTitle>

      <DialogContent sx={{ ...(isCalendarView && mdUp && { overflow: 'unset' }) }}>
        <Box sx={contentStyles}>
          {isCalendarView ? (
            <>
              <Box sx={blockStyles}>
                <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale={fr}>
                  <DateCalendar value={startDate} onChange={onChangeStartDate} views={views} />
                </LocalizationProvider>
              </Box>

              <Box sx={blockStyles}>
                <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale={fr}>
                  <DateCalendar value={endDate} onChange={onChangeEndDate} views={views} />
                </LocalizationProvider>
              </Box>
            </>
          ) : (
            <>
              <DatePicker label="Start date" value={startDate} onChange={onChangeStartDate} />
              <DatePicker label="End date" value={endDate} onChange={onChangeEndDate} />
            </>
          )}
        </Box>

        {error && (
          <FormHelperText error sx={{ px: 2 }}>
            End date must be later than start date
          </FormHelperText>
        )}
      </DialogContent>

      <DialogActions>
        <Button variant="outlined" color="inherit" onClick={onClose}>
          Annuler
        </Button>
        <Button disabled={error} variant="contained" onClick={handleSubmit}>
          Confirmer
        </Button>
      </DialogActions>
    </Dialog>
  );
}
