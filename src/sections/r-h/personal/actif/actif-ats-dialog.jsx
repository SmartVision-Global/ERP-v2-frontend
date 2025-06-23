import dayjs from 'dayjs';
import { useState } from 'react';

import { LoadingButton } from '@mui/lab';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';

import { usePdfViewer } from 'src/hooks/use-pdf-viewer';

import { fDate } from 'src/utils/format-time';
import { showError } from 'src/utils/toast-error';

import { getPersonalDocument } from 'src/actions/personal';

import { useDateRangePicker, CustomDateRangePicker } from 'src/components/custom-date-range-picker';

// ----------------------------------------------------------------------

export function ActifAtsDialog({ open, action, content, personalId, onClose, ...other }) {
  const rangePicker = useDateRangePicker(dayjs(new Date()), null);
  const openPdfViewer = usePdfViewer();
  const [isDownloading, setIsDownloading] = useState(false);
  const onSubmit = async () => {
    if (!rangePicker.startDate || !rangePicker.endDate) {
      showError({ message: 'Veuillez choisir une date' });
    } else {
      try {
        setIsDownloading(true);
        const response = await getPersonalDocument(personalId, 'ats', {
          from: rangePicker.startDate.format('YYYY-MM-DD'),
          to: rangePicker.endDate.format('YYYY-MM-DD'),
        });
        const blob = new Blob([response.data], {
          type: response.headers['content-type'],
        });
        openPdfViewer(blob);
        setIsDownloading(false);
        onClose();
        // Extract filename from headers (optional but recommended)
        // const contentDisposition = response.headers['content-disposition'];
        // let fileName = 'downloaded-file';

        // if (contentDisposition) {
        //   const match = contentDisposition.match(/filename="?(.+)"?/);
        //   if (match?.[1]) {
        //     fileName = decodeURIComponent(match[1]);
        //   }
        // }

        // // Create a temporary download link
        // const url = window.URL.createObjectURL(blob);
        // const a = document.createElement('a');
        // a.href = url;
        // a.download = fileName;
        // a.click();
        // // Cleanup
        // window.URL.revokeObjectURL(url);
        // setIsDownloading(false);
        // onClose();
      } catch (error) {
        setIsDownloading(false);

        showError(error);
        console.log('Error in downoloadinf ATS', error);
      } finally {
        setIsDownloading(false);
      }
    }
  };
  return (
    <Dialog fullWidth maxWidth="sm" open={open} onClose={onClose} {...other}>
      <DialogTitle sx={{ pb: 2 }}>Télécharger ATS</DialogTitle>

      <DialogContent sx={{ typography: 'body2' }}>
        <Button variant="outlined" onClick={rangePicker.onOpen}>
          {rangePicker.startDate && rangePicker.endDate
            ? `${fDate(rangePicker.startDate)} - ${fDate(rangePicker.endDate)}`
            : 'Date (Sélectionner un intervale)'}
        </Button>
        <CustomDateRangePicker
          variant="calendar"
          title="Choisi une date"
          startDate={rangePicker.startDate}
          endDate={rangePicker.endDate}
          onChangeStartDate={rangePicker.onChangeStartDate}
          onChangeEndDate={rangePicker.onChangeEndDate}
          open={rangePicker.open}
          onClose={rangePicker.onClose}
          selected={rangePicker.selected}
          error={rangePicker.error}
        />
      </DialogContent>

      <DialogActions>
        <LoadingButton onClick={onSubmit} loading={isDownloading}>
          Télécharger
        </LoadingButton>

        <Button variant="outlined" color="inherit" onClick={onClose}>
          Annuler
        </Button>
      </DialogActions>
    </Dialog>
  );
}
