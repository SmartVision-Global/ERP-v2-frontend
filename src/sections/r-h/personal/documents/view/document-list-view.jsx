import { useState, useCallback } from 'react';
import { useBoolean, useSetState } from 'minimal-shared/hooks';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

import { fIsAfter, fIsBetween } from 'src/utils/format-time';

import { _allFiles } from 'src/_mock';
import { DashboardContent } from 'src/layouts/dashboard';

import { toast } from 'src/components/snackbar';
import { fileFormat } from 'src/components/file-thumbnail';
import { EmptyContent } from 'src/components/empty-content';
import { ConfirmDialog } from 'src/components/custom-dialog';
import { useTable, rowInPage, getComparator } from 'src/components/table';

import { FileManagerGridView } from '../document-grid-view';
import { FileManagerNewFolderDialog } from '../file-manager-new-folder-dialog';

// ----------------------------------------------------------------------

export function DocumentListView() {
  const table = useTable({ defaultRowsPerPage: 10 });

  const confirmDialog = useBoolean();
  const newFilesDialog = useBoolean();

  const [tableData, setTableData] = useState(_allFiles);

  const filters = useSetState({
    name: '',
    type: [],
    startDate: null,
    endDate: null,
  });
  const { state: currentFilters } = filters;

  const dateError = fIsAfter(currentFilters.startDate, currentFilters.endDate);

  const dataFiltered = applyFilter({
    inputData: tableData,
    comparator: getComparator(table.order, table.orderBy),
    filters: currentFilters,
    dateError,
  });

  const dataInPage = rowInPage(dataFiltered, table.page, table.rowsPerPage);

  const canReset =
    !!currentFilters.name ||
    currentFilters.type.length > 0 ||
    (!!currentFilters.startDate && !!currentFilters.endDate);

  const notFound = (!dataFiltered.length && canReset) || !dataFiltered.length;

  const handleDeleteItem = useCallback(
    (id) => {
      const deleteRow = tableData.filter((row) => row.id !== id);

      toast.success('Delete success!');

      setTableData(deleteRow);

      table.onUpdatePageDeleteRow(dataInPage.length);
    },
    [dataInPage.length, table, tableData]
  );

  const handleDeleteItems = useCallback(() => {
    const deleteRows = tableData.filter((row) => !table.selected.includes(row.id));

    toast.success('Delete success!');

    setTableData(deleteRows);

    table.onUpdatePageDeleteRows(dataInPage.length, dataFiltered.length);
  }, [dataFiltered.length, dataInPage.length, table, tableData]);

  const renderNewFilesDialog = () => (
    <FileManagerNewFolderDialog open={newFilesDialog.value} onClose={newFilesDialog.onFalse} />
  );

  const renderConfirmDialog = () => (
    <ConfirmDialog
      open={confirmDialog.value}
      onClose={confirmDialog.onFalse}
      title="Delete"
      content={
        <>
          Are you sure want to delete <strong> {table.selected.length} </strong> items?
        </>
      }
      action={
        <Button
          variant="contained"
          color="error"
          onClick={() => {
            handleDeleteItems();
            confirmDialog.onFalse();
          }}
        >
          Delete
        </Button>
      }
    />
  );

  const renderList = () => (
    <FileManagerGridView
      table={table}
      dataFiltered={dataFiltered}
      onDeleteItem={handleDeleteItem}
      onOpenConfirm={confirmDialog.onTrue}
    />
  );

  return (
    <>
      <DashboardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Typography variant="h4">Gestion des dossier</Typography>
          {/* <Button
            variant="contained"
            startIcon={<Iconify icon="eva:cloud-upload-fill" />}
            onClick={newFilesDialog.onTrue}
          >
            Upload
          </Button> */}
        </Box>

        {notFound ? <EmptyContent filled sx={{ py: 10 }} /> : renderList()}
      </DashboardContent>

      {renderNewFilesDialog()}
      {renderConfirmDialog()}
    </>
  );
}

// ----------------------------------------------------------------------

function applyFilter({ inputData, comparator, filters, dateError }) {
  const { name, type, startDate, endDate } = filters;

  const stabilizedThis = inputData.map((el, index) => [el, index]);

  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });

  inputData = stabilizedThis.map((el) => el[0]);

  if (name) {
    inputData = inputData.filter((file) => file.name.toLowerCase().includes(name.toLowerCase()));
  }

  if (type.length) {
    inputData = inputData.filter((file) => type.includes(fileFormat(file.type)));
  }

  if (!dateError) {
    if (startDate && endDate) {
      inputData = inputData.filter((file) => fIsBetween(file.createdAt, startDate, endDate));
    }
  }

  return inputData;
}
