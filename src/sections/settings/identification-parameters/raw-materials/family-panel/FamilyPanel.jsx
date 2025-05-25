import React, { useState } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import Popover from '@mui/material/Popover';
import ListItem from '@mui/material/ListItem';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import ListItemText from '@mui/material/ListItemText';

import { useIdentification } from 'src/contexts/IdentificationContext';
import { createEntity, updateEntity } from 'src/actions/settings/identification/raw-materials';

import { Iconify } from 'src/components/iconify';

import AddFamilyDialog from './AddFamilyDialog';
import EditFamilyDialog from './EditFamilyDialog';

export default function FamilyPanel({ families }) {
  const { group } = useIdentification();
  const [anchorEl, setAnchorEl] = useState(null);
  const [childrenList, setChildrenList] = useState([]);
  const [openAdd, setOpenAdd] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [selected, setSelected] = useState(null);

  const handleArrow = (event, children) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
    setChildrenList(children);
  };

  const closePopover = () => {
    setAnchorEl(null);
    setChildrenList([]);
  };

  const handleClickRoot = (f) => {
    setSelected(f);
    setOpenEdit(true);
  };

  const handleClickChild = (ch) => {
    closePopover();
    setSelected(ch);
    setOpenEdit(true);
  };

  return (
    <>
      <Card>
        <Box sx={{ p: 3, pb: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Typography variant="subtitle1">Familles / Sous familles</Typography>
          <IconButton onClick={() => setOpenAdd(true)}>
            <Iconify icon="mdi:add-circle-outline" />
          </IconButton>
        </Box>
        <Divider sx={{ borderStyle: 'dashed' }} />
        <Box sx={{ maxHeight: 300, overflow: 'auto' }}>
          {families.map((f) => (
            <Box
              key={f.id}
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                px: 2,
                py: 1,
                borderRadius: 1,
                cursor: 'pointer',
                '&:hover': { backgroundColor: 'grey.300' },
              }}
              onClick={() => handleClickRoot(f)}
            >
              <Typography variant="body2">
                {`${f.name} / ${f.designation}`}
              </Typography>
              {f.children?.length > 0 && (
                <IconButton size="medium" onClick={(e) => handleArrow(e, f.children)}>
                  <Iconify icon="eva:arrow-right-fill" />
                </IconButton>
              )}
            </Box>
          ))}
        </Box>
      </Card>

      <Popover
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={closePopover}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'left' }}
        PaperProps={{ sx: { p: 2, minWidth: 300, maxHeight: 400 } }}
      >
        <List>
          {childrenList.map((ch) => (
            <ListItem key={ch.id} button="true" sx={{ py: 1.5, px: 2, cursor: 'pointer' }} onClick={() => handleClickChild(ch)}>
              <ListItemText primary={`${ch.name} / ${ch.designation}`} primaryTypographyProps={{ fontSize: '1rem' }} />
            </ListItem>
          ))}
        </List>
      </Popover>

      <AddFamilyDialog
        open={openAdd}
        onClose={() => setOpenAdd(false)}
        families={families}
        group={group}
        onCreate={(payload) => createEntity('families', payload, group)}
      />

      <EditFamilyDialog
        open={openEdit}
        onClose={() => setOpenEdit(false)}
        families={families}
        group={group}
        family={selected}
        onUpdate={(id, payload) => updateEntity('families', id, payload, group)}
      />
    </>
  );
} 