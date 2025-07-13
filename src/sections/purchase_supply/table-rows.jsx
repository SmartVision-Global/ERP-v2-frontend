import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import { Typography } from '@mui/material';
import ListItemText from '@mui/material/ListItemText';

import { RouterLink } from 'src/routes/components';

import { fCurrency } from 'src/utils/format-number';
import { fDate, fTime } from 'src/utils/format-time';

import {
  PRODUCT_TYPE_OPTIONS,
  PRIORITY_OPTIONS,
  ORDER_STATUS_OPTIONS,
} from 'src/_mock/expression-of-needs/Beb/Beb';
import {
  SUPPLIER_STATUS_OPTIONS,
  COMMAND_ORDER_STATUS_OPTIONS,
  PAYMENT_METHOD_OPTIONS,
  BILLING_STATUS_OPTIONS,
} from 'src/_mock/purchase/data';

import { Label } from 'src/components/label';

export function RenderCellId({ params, href }) {
  return (
    <Box
      sx={{
        py: 2,
        gap: 2,
        width: 1,
        display: 'flex',
        alignItems: 'center',
      }}
    >
      <ListItemText
        primary={
          <Link component={RouterLink} href={href} color="inherit">
            {params.row.id}
          </Link>
        }
        slotProps={{
          primary: { noWrap: true },
          secondary: { sx: { color: 'text.disabled' } },
        }}
      />
    </Box>
  );
}
export function RenderCellCreatedAt({ params }) {
  return (
    <Box sx={{ gap: 0.5, display: 'flex', flexDirection: 'column' }}>
      <span>{fDate(params.row.created_at)}</span>
      <Box component="span" sx={{ typography: 'caption', color: 'text.secondary' }}>
        {fTime(params.row.created_at)}
      </Box>
    </Box>
  );
}
export function RenderCellTemp({ params }) {
  return (
    <Label variant="soft" color="default">
      {params.row.temp}
    </Label>
  );
}
export function RenderCellStatus({ params }) {
  const status = ORDER_STATUS_OPTIONS.find((option) => option.value == params.row.status);
  const color = status ? status.color : 'default';
  const label = status ? status.label : 'N/I';
  return (
    <Label variant="soft" color={color}>
      {label}
    </Label>
  );
}

export function RenderCellCommandOrderStatus({ params }) {
  const status = COMMAND_ORDER_STATUS_OPTIONS.find((option) => option.value == params.row.status);
  const color = status ? status.color : 'default';
  const label = status ? status.label : 'N/I';
  return (
    <Label variant="soft" color={color}>
      {label}
    </Label>
  );
}



export function RenderCellBEB({ params }) {
  return fCurrency(params.row.beb);
}
export function RenderCellSite({ params }) {
  return <Typography fontSize={14}>{params.row.site?.name}</Typography>;
}

export function RenderCellType({ params }) {
  const type = PRODUCT_TYPE_OPTIONS.find((option) => option.value == params.row.type);
  const color = type ? type.color : 'default';
  const label = type ? type.label : 'N/I';
  return (
    <Label variant="soft" color={color}>
      {label}
    </Label>
  );
}

export function RenderCellSupplierType({ params }) {
    if (!Array.isArray(params.row.type)) {
        const type = PRODUCT_TYPE_OPTIONS.find((option) => option.value == params.row.type);
        const color = type ? type.color : 'default';
        const label = type ? type.label : 'N/I';
        return (
            <Label variant="soft" color={color}>
            {label}
            </Label>
        );
    }

    return (
      <Box sx={{ display: 'flex', gap: 0.5 }}>
        {params.row.type.map((typeId) => {
          const type = PRODUCT_TYPE_OPTIONS.find((option) => option.value == typeId);
          const color = type ? type.color : 'default';
          const label = type ? type.label : 'N/A';
          return (
            <Label key={typeId} variant="soft" color={color}>
              {label}
            </Label>
          );
        })}
      </Box>
    );
  }

export function RenderCellCode({ params }) {
  return <Typography fontSize={14}>{params.row.eon_voucher?.code}</Typography>;
}

export function RenderCellPriority({ params }) {
  const priority = PRIORITY_OPTIONS.find((option) => option.value == params.row.priority);
  const color = priority ? priority.color : 'default';
  const label = priority ? priority.label : 'N/I';
  return (
    <Label variant="soft" color={color}>
      {label}
    </Label>
  );
}

// supplier

export function RenderCellName({ params }) {
  return <Typography fontSize={14}>{params.row.name}</Typography>;
}


export function RenderCellSupplier({ params }) {
  return <Typography fontSize={14}>{params.row.code}</Typography>;
}

export function RenderCellExerciseStartDate({ params }) {
  return <span>{fDate(params.row.created_at)}</span>;
}

export function RenderCellSupplierStatus({ params }) {
    const status = SUPPLIER_STATUS_OPTIONS.find((option) => option.value == params.row.status); 
    const color = status ? status.color : 'default';
    const label = status ? status.label : 'N/I';
    return (
        <Label variant="soft" color={color}>
            {label}
        </Label>
    );
}
export function RenderCellSupplierName({ params }) {
  return <Typography fontSize={14}>{params.row.supplier?.name}</Typography>;
}

export function RenderCellService({ params }) {
  return <Typography fontSize={14}>{params.row.service?.name}</Typography>;
}

export function RenderCellHT({ params }) {
  return <Typography variant="body2">{fCurrency(params.row.ht)}</Typography>;
}

export function RenderCellDiscount({ params }) {
  return <Typography variant="body2">{fCurrency(params.row.remise)}</Typography>;
}

export function RenderCellTVA({ params }) {
  return <Typography variant="body2">{fCurrency(params.row.tva)}</Typography>;
}

export function RenderCellTax({ params }) {
  return <Typography variant="body2">{fCurrency(params.row.tax)}</Typography>;
}

export function RenderCellStamp({ params }) {
  return <Typography variant="body2">{fCurrency(params.row.stamp)}</Typography>;
}

export function RenderCellTTC({ params }) {
  return <Typography variant="body2" sx={{fontWeight: 'bold'}}>{fCurrency(params.row.ttc)}</Typography>;
}

export function RenderCellPaymentMethod({ params }) {
  const paymentMethod = PAYMENT_METHOD_OPTIONS.find(
    (option) => option.value == params.row.payment_method
  );
  const color = paymentMethod ? paymentMethod.color : 'default';
  const label = paymentMethod ? paymentMethod.label : 'N/I';
  return (
    <Label variant="soft" color={color}>
      {label}
    </Label>
  );
}

export function RenderCellProforma({ params }) {
  return <Typography fontSize={14}>N/I</Typography>;
}

export function RenderCellDeliveryDate({ params }) {
  if (!params.row.delivery_dates || params.row.delivery_dates.length === 0) {
    return null;
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, py: 1 }}>
      {params.row.delivery_dates.map(({ id, delivery_date }) => (
        <Box key={id} sx={{ display: 'flex', flexDirection: 'column' }}>
          <span>{fDate(delivery_date)}</span>
          <Box component="span" sx={{ typography: 'caption', color: 'text.secondary' }}>
            {fTime(delivery_date)}
          </Box>
        </Box>
      ))}
    </Box>
  );
}

export function RenderCellBilled({ params }) {
  const status = BILLING_STATUS_OPTIONS.find((option) => option.value == String(params.row.billed));
  const color = status ? status.color : 'default';
  const label = status ? status.label : 'N/I';
  return (
    <Label variant="soft" color={color}>
      {label}
    </Label>
  );
}
