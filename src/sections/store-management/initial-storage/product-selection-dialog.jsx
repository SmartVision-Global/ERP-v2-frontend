import PropTypes from 'prop-types';
import { useState, useCallback } from 'react';

import {
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Box,
  List,
  ListItem,
  ListItemText,
  TextField,
  InputAdornment,
  Typography,
  Button,
  Pagination,
  CircularProgress,
} from '@mui/material';

import { useGetStocks } from 'src/actions/stores/raw-materials/stocks';

import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------

const PAGE_SIZE = 10;

export function ProductSelectionDialog({ open, onClose, onProductSelect }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(1);
  const [editedFilters, setEditedFilters] = useState({});

  const { stocks, stocksLoading, stocksCount } = useGetStocks({
    limit: PAGE_SIZE,
    offset: (page - 1) * PAGE_SIZE,
    search: searchQuery,
    ...editedFilters,
  });

  const handleProductSelect = (product) => {
    onProductSelect(product);
    onClose();
  };

  const handlePageChange = (event, newPage) => {
    setPage(newPage);
  };

  const handleSearch = useCallback((event) => {
    const searchValue = event.target.value;
    setSearchQuery(searchValue);
    setPage(1); // Reset to first page on search
    setEditedFilters((prev) => ({
      ...prev,
      search: searchValue,
    }));
  }, []);

  const getUnitMeasure = (unit) => {
    if (!unit) return '';
    return typeof unit === 'object' ? unit.name || unit.designation || '' : String(unit);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        Sélectionner un produit
        <IconButton
          onClick={onClose}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
          }}
        >
          <Iconify icon="eva:close-fill" />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <Box sx={{ mb: 2 }}>
          <TextField
            fullWidth
            placeholder="Rechercher un produit..."
            value={searchQuery}
            onChange={handleSearch}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Iconify icon="eva:search-fill" sx={{ color: 'text.disabled' }} />
                </InputAdornment>
              ),
            }}
            size="small"
          />
        </Box>

        <Box sx={{ height: '60vh', overflow: 'auto', position: 'relative' }}>
          {stocksLoading ? (
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100%',
              }}
            >
              <CircularProgress />
            </Box>
          ) : (
            <List>
              {stocks?.map((product) => (
                <ListItem
                  key={product.id}
                  sx={{
                    '&:hover': {
                      backgroundColor: 'action.hover',
                    },
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    py: 1.5,
                  }}
                >
                  <ListItemText
                    primary={
                      <Typography
                        variant="subtitle1"
                        sx={{ fontWeight: 'bold', color: 'text.primary' }}
                      >
                        {product.code || ''}
                      </Typography>
                    }
                    secondary={
                      <Box sx={{ display: 'flex', gap: 2, mt: 0.5 }}>
                        <Typography variant="caption" color="text.secondary">
                          Désignation: {product.designation || ''}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          Quantité: {String(product.quantity || 0)}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          Unité: {getUnitMeasure(product.unit_measure)}
                        </Typography>
                      </Box>
                    }
                  />
                  <Button
                    variant="contained"
                    size="small"
                    startIcon={<Iconify icon="eva:plus-fill" />}
                    onClick={() => handleProductSelect(product)}
                    sx={{ minWidth: 'auto', px: 1 }}
                  >
                    Ajouter
                  </Button>
                </ListItem>
              ))}
            </List>
          )}
        </Box>

        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2, mb: 2 }}>
          <Pagination
            count={Math.ceil((stocksCount || 0) / PAGE_SIZE)}
            page={page}
            onChange={handlePageChange}
          />
        </Box>
      </DialogContent>
    </Dialog>
  );
}

ProductSelectionDialog.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func,
  onProductSelect: PropTypes.func,
};
