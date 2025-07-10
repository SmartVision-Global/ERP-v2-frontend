
// import React from 'react'; // useEffect might be needed if you fetch product details async
// import { useBoolean, usePopover } from 'minimal-shared/hooks';

// import Button from '@mui/material/Button';
// import Divider from '@mui/material/Divider';
// import MenuList from '@mui/material/MenuList';
// import MenuItem from '@mui/material/MenuItem';
// import TableRow from '@mui/material/TableRow';
// import TableCell from '@mui/material/TableCell';
// import IconButton from '@mui/material/IconButton';
// import TextField from '@mui/material/TextField'; // For Observation
// import Select from '@mui/material/Select'; // For Product Selection (Designation)
// import FormControl from '@mui/material/FormControl';
// import InputLabel from '@mui/material/InputLabel';
// import FormHelperText from '@mui/material/FormHelperText';

// import { useWatch, Controller, useFormContext } from 'react-hook-form';

// import { Iconify } from 'src/components/iconify';
// import { NumberInput } from 'src/components/number-input'; // For Qte à acheter
// import { ConfirmDialog } from 'src/components/custom-dialog';
// import { CustomPopover } from 'src/components/custom-popover';
// // Assuming Field.Lookup is not available or you want to use MUI Select directly here
// // If Field.Lookup from src/components/hook-form can be used, prefer that for consistency.

// // ----------------------------------------------------------------------

// export function BebTableRowCell({
//   index,
//   onDeleteRow,
//   availableProducts = [], // Pass the list of products for the dropdown
//   // 'row' prop might not be needed if all data is derived via RHF or product selection
//   // 'selected', 'update', 'fields' props might also be context-dependent and can be removed if not used
// }) {
//   const menuActions = usePopover();
//   const confirmDialog = useBoolean();
//   const { control, watch, setValue } = useFormContext(); // RHF context

//   // Watch the selected product ID to derive other display values
//   const selectedProductId = useWatch({
//     control,
//     name: `products.${index}.productId`,
//   });

//   // Find the full product object based on selectedProductId
//   const selectedProductData = React.useMemo(() => {
//     if (!selectedProductId || !availableProducts.length) return null;
//     return availableProducts.find((p) => p.id === selectedProductId);
//   }, [selectedProductId, availableProducts]);

//   const renderMenuActions = () => (
//     <CustomPopover
//       open={menuActions.open}
//       anchorEl={menuActions.anchorEl}
//       onClose={menuActions.onClose}
//       slotProps={{ arrow: { placement: 'right-top' } }}
//     >
//       <MenuList>
//         <Divider sx={{ borderStyle: 'dashed' }} />
//         <MenuItem
//           onClick={() => {
//             confirmDialog.onTrue();
//             menuActions.onClose();
//           }}
//           sx={{ color: 'error.main' }}
//         >
//           <Iconify icon="solar:trash-bin-trash-bold" />
//           Supprimer
//         </MenuItem>
//       </MenuList>
//     </CustomPopover>
//   );

//   const renderConfirmDialog = () => (
//     <ConfirmDialog
//       open={confirmDialog.value}
//       onClose={confirmDialog.onFalse}
//       title="Supprimer le produit"
//       content="Êtes-vous sûr de vouloir supprimer ce produit de la demande ?"
//       action={
//         <Button variant="contained" color="error" onClick={() => onDeleteRow(index)}>
//           Supprimer
//         </Button>
//       }
//     />
//   );

//   return (
//     <>
//       <TableRow hover /* selected={selected} // if you need row selection visual */>
//         {/* Code (Display Only) */}
//         <TableCell align="left">{selectedProductData?.code || '-'}</TableCell>

//         {/* Code Fournisseur (Display Only) */}
//         <TableCell align="left">{selectedProductData?.supplierCode || '-'}</TableCell>

//         {/* Designation (Product Selection - Input) */}
//         <TableCell sx={{ minWidth: 200 }}>
//           <Controller
//             name={`products.${index}.productId`}
//             control={control}
//             render={({ field, fieldState: { error } }) => (
//               <FormControl fullWidth error={!!error}>
//                 <InputLabel>Désignation</InputLabel>
//                 <Select
//                   {...field}
//                   label="Désignation"
//                   onChange={(e) => {
//                     field.onChange(e.target.value);
//                     // Optionally, clear/reset other fields if product changes, or prefill if needed
//                     // const product = availableProducts.find(p => p.id === e.target.value);
//                     // if (product) {
//                     //   setValue(`products.${index}.quantity`, product.defaultOrderQuantity || 1);
//                     // }
//                   }}
//                 >
//                   <MenuItem value="">
//                     <em>Sélectionner un produit</em>
//                   </MenuItem>
//                   {availableProducts.map((product) => (
//                     <MenuItem key={product.id} value={product.id}>
//                       {product.name}
//                     </MenuItem>
//                   ))}
//                 </Select>
//                 {error && <FormHelperText>{error?.message}</FormHelperText>}
//               </FormControl>
//             )}
//           />
//         </TableCell>

//         {/* Qte actuelle (Display Only) */}
//         <TableCell align="center">{selectedProductData?.currentStock ?? '-'}</TableCell>

//         {/* Qte à acheter (Input) */}
//         <TableCell sx={{ minWidth: 120 }}>
//           <Controller
//             name={`products.${index}.quantity`}
//             control={control}
//             render={({ field, fieldState: { error } }) => (
//               <NumberInput // Or your custom Field.Text type="number"
//                 {...field}
//                 label="Qté à acheter"
//                 // value={field.value ?? 0} // RHF Controller handles value
//                 onChange={(event, val) => field.onChange(val === null ? '' : Number(val))} // NumberInput might return null
//                 error={!!error}
//                 helperText={error?.message}
//                 sx={{ '.MuiInputBase-input': { textAlign: 'center' } }}
//               />
//             )}
//           />
//         </TableCell>

//         {/* Observation (Input) */}
//         <TableCell sx={{ minWidth: 200 }}>
//           <Controller
//             name={`products.${index}.notes`}
//             control={control}
//             render={({ field, fieldState: { error } }) => (
//               <TextField
//                 {...field}
//                 fullWidth
//                 multiline
//                 rows={1} // Adjust as needed, can be 1 for a compact view
//                 label="Observation"
//                 error={!!error}
//                 helperText={error?.message}
//                 variant="outlined" // Or "standard" / "filled"
//               />
//             )}
//           />
//         </TableCell>

//         {/* Actions Menu */}
//         <TableCell align="right" sx={{ px: 1 }}>
//           <IconButton color={menuActions.open ? 'inherit' : 'default'} onClick={menuActions.onOpen}>
//             <Iconify icon="eva:more-vertical-fill" />
//           </IconButton>
//         </TableCell>
//       </TableRow>

//       {renderMenuActions()}
//       {renderConfirmDialog()}
//     </>
//   );
// }
