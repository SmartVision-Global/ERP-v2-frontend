import { useState, useMemo } from 'react';

import {
  Dialog,
  DialogTitle,
  DialogContent,
  Box,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
} from '@mui/material';

import { useGetStocks } from 'src/actions/stores/raw-materials/stocks';

export function ProductSelectionDialog({ open, onClose, onSelect }) {
  const [searchQuery, setSearchQuery] = useState('');
  const { stocks = [], stocksLoading } = useGetStocks(1);

  const filteredStocks = useMemo(() => {
    if (!searchQuery.trim()) return stocks;

    const query = searchQuery.toLowerCase();
    return stocks.filter(
      (product) =>
        product.code?.toLowerCase().includes(query) ||
        product.designation?.toLowerCase().includes(query)
    );
  }, [stocks, searchQuery]);

  const handleRowDoubleClick = (product) => {
    onSelect(product);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xl" fullWidth>
      <DialogTitle>Sélectionner un produit</DialogTitle>
      <DialogContent>
        <Box sx={{ mb: 2, mt: 1 }}>
          <TextField
            fullWidth
            placeholder="Rechercher un produit..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            size="small"
          />
        </Box>
        <Box sx={{ height: '60vh', overflow: 'auto' }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Code</TableCell>
                <TableCell>Désignation</TableCell>
                {/* Add more columns as needed */}
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredStocks.map((product) => (
                <TableRow
                  key={product.id}
                  hover
                  style={{ cursor: 'pointer' }}
                  onDoubleClick={() => handleRowDoubleClick(product)}
                >
                  <TableCell>{product.code}</TableCell>
                  <TableCell>{product.designation}</TableCell>
                  {/* Add more cells as needed */}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Box>
      </DialogContent>
    </Dialog>
  );
}
