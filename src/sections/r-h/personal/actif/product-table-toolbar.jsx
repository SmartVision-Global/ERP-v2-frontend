import { useState, useCallback } from 'react';
import { varAlpha } from 'minimal-shared/utils';
import { usePopover } from 'minimal-shared/hooks';

import Grid from '@mui/material/Grid2';
import Select from '@mui/material/Select';
import MenuList from '@mui/material/MenuList';
import MenuItem from '@mui/material/MenuItem';
import Checkbox from '@mui/material/Checkbox';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import OutlinedInput from '@mui/material/OutlinedInput';
import { Button, TextField, InputAdornment } from '@mui/material';

import { Iconify } from 'src/components/iconify';
import { CustomPopover } from 'src/components/custom-popover';

// ----------------------------------------------------------------------

export function ProductTableToolbar({ filters, options }) {
  const menuActions = usePopover();
  console.log('filters', filters);

  const { state: currentFilters, setState: updateFilters } = filters;
  const [id, setID] = useState(currentFilters.id);

  const [stock, setStock] = useState(currentFilters.stock);
  const [publish, setPublish] = useState(currentFilters.publish);
  const [fullname, setFullname] = useState(currentFilters.full_name);

  // const handleChangeId = useCallback((event) => {
  //   const newValue =
  //     typeof event.target.value === 'string' ? event.target.value.split(',') : event.target.value;
  //   setID(newValue);
  //   // onResetPage();
  //   // updateFilters({ id: });
  // }, []);

  const handleChangeId = useCallback(
    (event) => {
      // onResetPage();
      updateFilters({ id: event.target.value });
    },
    [updateFilters]
  );

  const handleChangeFullname = useCallback((event) => {
    const {
      target: { value },
    } = event;

    setFullname(typeof value === 'string' ? value.split(',') : value);
  }, []);

  const handleChangeStock = useCallback((event) => {
    const {
      target: { value },
    } = event;

    setStock(typeof value === 'string' ? value.split(',') : value);
  }, []);

  const handleChangePublish = useCallback((event) => {
    const {
      target: { value },
    } = event;

    setPublish(typeof value === 'string' ? value.split(',') : value);
  }, []);

  // const handleFilterStock = useCallback(() => {
  //   updateFilters({ stock });
  // }, [updateFilters, stock]);

  // const handleFilterPublish = useCallback(() => {
  //   updateFilters({ publish });
  // }, [publish, updateFilters]);

  // const handleFilterFullname = useCallback(() => {
  //   updateFilters({ full_name: fullname });
  // }, [fullname, updateFilters]);

  const renderMenuActions = () => (
    <CustomPopover
      open={menuActions.open}
      anchorEl={menuActions.anchorEl}
      onClose={menuActions.onClose}
      slotProps={{ arrow: { placement: 'right-top' } }}
    >
      <MenuList>
        <MenuItem onClick={() => menuActions.onClose()}>
          <Iconify icon="solar:printer-minimalistic-bold" />
          Print
        </MenuItem>

        <MenuItem onClick={() => menuActions.onClose()}>
          <Iconify icon="solar:import-bold" />
          Import
        </MenuItem>

        <MenuItem onClick={() => menuActions.onClose()}>
          <Iconify icon="solar:export-bold" />
          Export
        </MenuItem>
      </MenuList>
    </CustomPopover>
  );

  return (
    <Grid container spacing={2} paddingX={4} paddingY={2}>
      <Grid size={{ xs: 12, md: 3 }}>
        <FormControl sx={{ flexShrink: 0, width: 1 }} size="small">
          <TextField
            fullWidth
            value={currentFilters.id}
            onChange={handleChangeId}
            label="ID"
            size="small"
          />
        </FormControl>
      </Grid>
      {/* nom prenom */}
      <Grid size={{ xs: 12, md: 3 }}>
        <FormControl sx={{ flexShrink: 0, width: 1 }} size="small">
          <InputLabel htmlFor="filter-nom-prenom">Nom-Prénom</InputLabel>

          <Select
            multiple
            value={stock}
            onChange={handleChangeFullname}
            // onClose={handleFilterFullname}
            input={<OutlinedInput label="Nom-Prénom" />}
            renderValue={(selected) => selected.map((value) => value).join(', ')}
            inputProps={{ id: 'filter-nom-prenom' }}
            sx={{ textTransform: 'capitalize' }}
            // size="small"
          >
            {options.stocks.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                <Checkbox disableRipple size="small" checked={stock.includes(option.value)} />
                {option.label}
              </MenuItem>
            ))}
            <MenuItem
              // onClick={handleFilterStock}
              sx={[
                (theme) => ({
                  justifyContent: 'center',
                  fontWeight: theme.typography.button,
                  bgcolor: varAlpha(theme.vars.palette.grey['500Channel'], 0.08),
                  border: `solid 1px ${varAlpha(theme.vars.palette.grey['500Channel'], 0.16)}`,
                }),
              ]}
            >
              Apply
            </MenuItem>
          </Select>
        </FormControl>
      </Grid>
      {/* Sex */}
      <Grid size={{ xs: 12, md: 3 }}>
        <FormControl sx={{ flexShrink: 0, width: 1 }} size="small">
          <InputLabel htmlFor="filter-stock-select">Sexe</InputLabel>

          <Select
            multiple
            value={stock}
            onChange={handleChangeStock}
            // onClose={handleFilterStock}
            input={<OutlinedInput label="Sexe" />}
            renderValue={(selected) => selected.map((value) => value).join(', ')}
            inputProps={{ id: 'filter-sex-select' }}
            sx={{ textTransform: 'capitalize' }}
          >
            {options.stocks.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                <Checkbox disableRipple size="small" checked={stock.includes(option.value)} />
                {option.label}
              </MenuItem>
            ))}
            <MenuItem
              // onClick={handleFilterStock}
              sx={[
                (theme) => ({
                  justifyContent: 'center',
                  fontWeight: theme.typography.button,
                  bgcolor: varAlpha(theme.vars.palette.grey['500Channel'], 0.08),
                  border: `solid 1px ${varAlpha(theme.vars.palette.grey['500Channel'], 0.16)}`,
                }),
              ]}
            >
              Apply
            </MenuItem>
          </Select>
        </FormControl>
      </Grid>
      {/* Etat */}
      <Grid size={{ xs: 12, md: 3 }}>
        <FormControl sx={{ flexShrink: 0, width: 1 }} size="small">
          <InputLabel htmlFor="filter-etat-select">Etat</InputLabel>
          <Select
            multiple
            value={publish}
            onChange={handleChangePublish}
            // onClose={handleFilterPublish}
            input={<OutlinedInput label="Etat" />}
            renderValue={(selected) => selected.map((value) => value).join(', ')}
            inputProps={{ id: 'filter-etat-select' }}
            sx={{ textTransform: 'capitalize' }}
          >
            {options.publishs.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                <Checkbox disableRipple size="small" checked={publish.includes(option.value)} />
                {option.label}
              </MenuItem>
            ))}

            <MenuItem
              disableGutters
              disableTouchRipple
              // onClick={handleFilterPublish}
              sx={[
                (theme) => ({
                  justifyContent: 'center',
                  fontWeight: theme.typography.button,
                  bgcolor: varAlpha(theme.vars.palette.grey['500Channel'], 0.08),
                  border: `solid 1px ${varAlpha(theme.vars.palette.grey['500Channel'], 0.16)}`,
                }),
              ]}
            >
              Apply
            </MenuItem>
          </Select>
        </FormControl>
      </Grid>
      {/* type payment */}
      <Grid size={{ xs: 12, md: 3 }}>
        <FormControl sx={{ flexShrink: 0, width: 1 }} size="small">
          <InputLabel htmlFor="filter-paymant-select">Type de paiement</InputLabel>
          <Select
            multiple
            value={publish}
            onChange={handleChangePublish}
            // onClose={handleFilterPublish}
            input={<OutlinedInput label="Type de paiement" />}
            renderValue={(selected) => selected.map((value) => value).join(', ')}
            inputProps={{ id: 'filter-paymant-select' }}
            sx={{ textTransform: 'capitalize' }}
          >
            {options.publishs.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                <Checkbox disableRipple size="small" checked={publish.includes(option.value)} />
                {option.label}
              </MenuItem>
            ))}

            <MenuItem
              disableGutters
              disableTouchRipple
              // onClick={handleFilterPublish}
              sx={[
                (theme) => ({
                  justifyContent: 'center',
                  fontWeight: theme.typography.button,
                  bgcolor: varAlpha(theme.vars.palette.grey['500Channel'], 0.08),
                  border: `solid 1px ${varAlpha(theme.vars.palette.grey['500Channel'], 0.16)}`,
                }),
              ]}
            >
              Apply
            </MenuItem>
          </Select>
        </FormControl>
      </Grid>
      {/* type equipe */}
      <Grid size={{ xs: 12, md: 3 }}>
        <FormControl sx={{ flexShrink: 0, width: 1 }} size="small">
          <InputLabel htmlFor="filter-equipe-select">Type équipe</InputLabel>
          <Select
            multiple
            value={publish}
            onChange={handleChangePublish}
            // onClose={handleFilterPublish}
            input={<OutlinedInput label="Type équipe" />}
            renderValue={(selected) => selected.map((value) => value).join(', ')}
            inputProps={{ id: 'filter-equipe-select' }}
            sx={{ textTransform: 'capitalize' }}
          >
            {options.publishs.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                <Checkbox disableRipple size="small" checked={publish.includes(option.value)} />
                {option.label}
              </MenuItem>
            ))}

            <MenuItem
              disableGutters
              disableTouchRipple
              // onClick={handleFilterPublish}
              sx={[
                (theme) => ({
                  justifyContent: 'center',
                  fontWeight: theme.typography.button,
                  bgcolor: varAlpha(theme.vars.palette.grey['500Channel'], 0.08),
                  border: `solid 1px ${varAlpha(theme.vars.palette.grey['500Channel'], 0.16)}`,
                }),
              ]}
            >
              Apply
            </MenuItem>
          </Select>
        </FormControl>
      </Grid>
      {/* banque */}
      <Grid size={{ xs: 12, md: 3 }}>
        <FormControl sx={{ flexShrink: 0, width: 1 }} size="small">
          <InputLabel htmlFor="filter-banque-select">Banque</InputLabel>
          <Select
            multiple
            value={publish}
            onChange={handleChangePublish}
            // onClose={handleFilterPublish}
            input={<OutlinedInput label="Banque" />}
            renderValue={(selected) => selected.map((value) => value).join(', ')}
            inputProps={{ id: 'filter-banque-select' }}
            sx={{ textTransform: 'capitalize' }}
          >
            {options.publishs.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                <Checkbox disableRipple size="small" checked={publish.includes(option.value)} />
                {option.label}
              </MenuItem>
            ))}

            <MenuItem
              disableGutters
              disableTouchRipple
              // onClick={handleFilterPublish}
              sx={[
                (theme) => ({
                  justifyContent: 'center',
                  fontWeight: theme.typography.button,
                  bgcolor: varAlpha(theme.vars.palette.grey['500Channel'], 0.08),
                  border: `solid 1px ${varAlpha(theme.vars.palette.grey['500Channel'], 0.16)}`,
                }),
              ]}
            >
              Apply
            </MenuItem>
          </Select>
        </FormControl>
      </Grid>
      {/* type contrat */}
      <Grid size={{ xs: 12, md: 3 }}>
        <FormControl sx={{ flexShrink: 0, width: 1 }} size="small">
          <InputLabel htmlFor="filter-contrat-select">Type de contrat</InputLabel>
          <Select
            multiple
            value={publish}
            onChange={handleChangePublish}
            // onClose={handleFilterPublish}
            input={<OutlinedInput label="Type de contrat" />}
            renderValue={(selected) => selected.map((value) => value).join(', ')}
            inputProps={{ id: 'filter-contrat-select' }}
            sx={{ textTransform: 'capitalize' }}
          >
            {options.publishs.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                <Checkbox disableRipple size="small" checked={publish.includes(option.value)} />
                {option.label}
              </MenuItem>
            ))}

            <MenuItem
              disableGutters
              disableTouchRipple
              // onClick={handleFilterPublish}
              sx={[
                (theme) => ({
                  justifyContent: 'center',
                  fontWeight: theme.typography.button,
                  bgcolor: varAlpha(theme.vars.palette.grey['500Channel'], 0.08),
                  border: `solid 1px ${varAlpha(theme.vars.palette.grey['500Channel'], 0.16)}`,
                }),
              ]}
            >
              Apply
            </MenuItem>
          </Select>
        </FormControl>
      </Grid>

      {/* lieu */}
      <Grid size={{ xs: 12, md: 3 }}>
        <FormControl sx={{ flexShrink: 0, width: 1 }} size="small">
          <InputLabel htmlFor="filter-lieu-select">Lieu de travail</InputLabel>
          <Select
            multiple
            value={publish}
            onChange={handleChangePublish}
            // onClose={handleFilterPublish}
            input={<OutlinedInput label="Lieu de travail" />}
            renderValue={(selected) => selected.map((value) => value).join(', ')}
            inputProps={{ id: 'filter-lieu-select' }}
            sx={{ textTransform: 'capitalize' }}
          >
            {options.publishs.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                <Checkbox disableRipple size="small" checked={publish.includes(option.value)} />
                {option.label}
              </MenuItem>
            ))}

            <MenuItem
              disableGutters
              disableTouchRipple
              // onClick={handleFilterPublish}
              sx={[
                (theme) => ({
                  justifyContent: 'center',
                  fontWeight: theme.typography.button,
                  bgcolor: varAlpha(theme.vars.palette.grey['500Channel'], 0.08),
                  border: `solid 1px ${varAlpha(theme.vars.palette.grey['500Channel'], 0.16)}`,
                }),
              ]}
            >
              Apply
            </MenuItem>
          </Select>
        </FormControl>
      </Grid>

      {/* Département */}
      <Grid size={{ xs: 12, md: 3 }}>
        <FormControl sx={{ flexShrink: 0, width: 1 }} size="small">
          <InputLabel htmlFor="filter-department-select">Département</InputLabel>
          <Select
            multiple
            value={publish}
            onChange={handleChangePublish}
            // onClose={handleFilterPublish}
            input={<OutlinedInput label="Département" />}
            renderValue={(selected) => selected.map((value) => value).join(', ')}
            inputProps={{ id: 'filter-department-select' }}
            sx={{ textTransform: 'capitalize' }}
          >
            {options.publishs.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                <Checkbox disableRipple size="small" checked={publish.includes(option.value)} />
                {option.label}
              </MenuItem>
            ))}

            <MenuItem
              disableGutters
              disableTouchRipple
              // onClick={handleFilterPublish}
              sx={[
                (theme) => ({
                  justifyContent: 'center',
                  fontWeight: theme.typography.button,
                  bgcolor: varAlpha(theme.vars.palette.grey['500Channel'], 0.08),
                  border: `solid 1px ${varAlpha(theme.vars.palette.grey['500Channel'], 0.16)}`,
                }),
              ]}
            >
              Apply
            </MenuItem>
          </Select>
        </FormControl>
      </Grid>
      {/* site */}
      <Grid size={{ xs: 12, md: 3 }}>
        <FormControl sx={{ flexShrink: 0, width: 1 }} size="small">
          <InputLabel htmlFor="filter-site-select">Site</InputLabel>
          <Select
            multiple
            value={publish}
            onChange={handleChangePublish}
            // onClose={handleFilterPublish}
            input={<OutlinedInput label="Site" />}
            renderValue={(selected) => selected.map((value) => value).join(', ')}
            inputProps={{ id: 'filter-site-select' }}
            sx={{ textTransform: 'capitalize' }}
          >
            {options.publishs.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                <Checkbox disableRipple size="small" checked={publish.includes(option.value)} />
                {option.label}
              </MenuItem>
            ))}

            <MenuItem
              disableGutters
              disableTouchRipple
              // onClick={handleFilterPublish}
              sx={[
                (theme) => ({
                  justifyContent: 'center',
                  fontWeight: theme.typography.button,
                  bgcolor: varAlpha(theme.vars.palette.grey['500Channel'], 0.08),
                  border: `solid 1px ${varAlpha(theme.vars.palette.grey['500Channel'], 0.16)}`,
                }),
              ]}
            >
              Apply
            </MenuItem>
          </Select>
        </FormControl>
      </Grid>
      <Grid size={{ xs: 12, md: 3 }}>
        <FormControl sx={{ flexShrink: 0, width: 1 }} size="small">
          <TextField
            fullWidth
            // value={currentFilters.name}
            // onChange={handleFilterName}
            placeholder="Search "
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <Iconify icon="eva:search-fill" sx={{ color: 'text.disabled' }} />
                  </InputAdornment>
                ),
              },
            }}
            size="small"
          />
        </FormControl>
      </Grid>
      <Grid size={{ xs: 12, md: 3 }}>
        <Button variant="contained">Chercher</Button>
      </Grid>
      {renderMenuActions()}
    </Grid>
  );
}
