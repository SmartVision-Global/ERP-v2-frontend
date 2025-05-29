/* eslint-disable*/
import { useState } from 'react';
import { Iconify } from 'src/components/iconify';
import { IconButton, TableCell, TextField, TableRow, Stack } from '@mui/material';

// BEB Table Row Component
export default function BEBTableRow({ row, index, onDeleteRow, onUpdateRow }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState(row);

  const handleEdit = () => {
    setIsEditing(true);
    setEditData(row);
  };

  const handleSave = () => {
    onUpdateRow(index, editData);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditData(row);
    setIsEditing(false);
  };

  const handleChange = (field, value) => {
    setEditData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  return (
    <TableRow hover>
      <TableCell>
        {isEditing ? (
          <TextField
            type="date"
            value={editData.date || ''}
            onChange={(e) => handleChange('date', e.target.value)}
            size="small"
            fullWidth
          />
        ) : (
          row.date || '-'
        )}
      </TableCell>

      <TableCell>
        {isEditing ? (
          <TextField
            value={editData.code || ''}
            onChange={(e) => handleChange('code', e.target.value)}
            size="small"
            fullWidth
          />
        ) : (
          row.code || '-'
        )}
      </TableCell>

      <TableCell>
        {isEditing ? (
          <TextField
            value={editData.applicant || ''}
            onChange={(e) => handleChange('applicant', e.target.value)}
            size="small"
            fullWidth
          />
        ) : (
          row.applicant || '-'
        )}
      </TableCell>

      <TableCell>
        {isEditing ? (
          <TextField
            value={editData.service || ''}
            onChange={(e) => handleChange('service', e.target.value)}
            size="small"
            fullWidth
          />
        ) : (
          row.service || '-'
        )}
      </TableCell>

      <TableCell>
        {isEditing ? (
          <TextField
            value={editData.observation || ''}
            onChange={(e) => handleChange('observation', e.target.value)}
            size="small"
            multiline
            rows={2}
            fullWidth
          />
        ) : (
          row.observation || '-'
        )}
      </TableCell>

      <TableCell align="right">
        <Stack direction="row" spacing={1}>
          {isEditing ? (
            <>
              <IconButton size="small" color="primary" onClick={handleSave} title="Sauvegarder">
                <Iconify icon="mdi:check" />
              </IconButton>
              <IconButton size="small" color="default" onClick={handleCancel} title="Annuler">
                <Iconify icon="mdi:close" />
              </IconButton>
            </>
          ) : (
            <>
              <IconButton size="small" color="primary" onClick={handleEdit} title="Modifier">
                <Iconify icon="mdi:pencil" />
              </IconButton>
              <IconButton size="small" color="error" onClick={onDeleteRow} title="Supprimer">
                <Iconify icon="mdi:delete" />
              </IconButton>
            </>
          )}
        </Stack>
      </TableCell>
    </TableRow>
  );
}
