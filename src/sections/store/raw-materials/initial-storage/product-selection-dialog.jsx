import { useState, useEffect } from 'react';

import { Close as CloseIcon } from '@mui/icons-material';
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
  Divider,
} from '@mui/material';

import { useGetStocks } from 'src/actions/stores/raw-materials/stocks';

import { Iconify } from 'src/components/iconify';

export function ProductSelectionDialog({ open, onClose, onProductSelect }) {
  const [searchQuery, setSearchQuery] = useState('');
  const { stocks, stocksLoading } = useGetStocks({
    limit: 100,
    offset: 0,
    search: searchQuery,
  });

  const handleProductSelect = (product) => {
    onProductSelect(product);
    onClose();
  };

  const getUnitMeasure = (unit) => {
    if (!unit) return '';
    return typeof unit === 'object' ? unit.name || unit.designation || '' : String(unit);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        Sélectionner un produit
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <Box sx={{ mb: 2 }}>
          <TextField
            fullWidth
            placeholder="Rechercher un produit..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
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

        <Box sx={{ height: '60vh', overflow: 'auto' }}>
          <List>
            {stocks?.map((product) => (
              <ListItem
                key={product.id}
                button
                onDoubleClick={() => handleProductSelect(product)}
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
              </ListItem>
            ))}
          </List>
        </Box>
      </DialogContent>
    </Dialog>
  );
}
