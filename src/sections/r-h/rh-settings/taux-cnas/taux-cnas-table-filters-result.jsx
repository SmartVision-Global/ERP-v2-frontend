import { useCallback } from 'react';
import { upperFirst } from 'es-toolkit';

import Chip from '@mui/material/Chip';

import { chipProps, FiltersBlock, FiltersResult } from 'src/components/filters-result';

// ----------------------------------------------------------------------

export function TauxCnasTableFiltersResult({ filters, totalResults, sx }) {
  const { state: currentFilters, setState: updateFilters, resetState: resetFilters } = filters;

  const handleRemoveStatus = useCallback(
    (inputValue) => {
      const newValue = currentFilters.status.filter((item) => item !== inputValue);
      updateFilters({ status: newValue });
    },
    [updateFilters, currentFilters.status]
  );

  const handleRemoveCategory = useCallback(
    (inputValue) => {
      const newValue = currentFilters.category.filter((item) => item !== inputValue);
      updateFilters({ category: newValue });
    },
    [updateFilters, currentFilters.category]
  );

  const handleRemoveId = useCallback(() => {
    updateFilters({ id: '' });
  }, [updateFilters]);

  return (
    <FiltersResult totalResults={totalResults} onReset={() => resetFilters()} sx={sx}>
      <FiltersBlock label="Status:" isShow={!!currentFilters.status?.length}>
        {currentFilters.status?.map((item) => (
          <Chip
            {...chipProps}
            key={item}
            label={upperFirst(item)}
            onDelete={() => handleRemoveStatus(item)}
          />
        ))}
      </FiltersBlock>

      <FiltersBlock label="Category:" isShow={!!currentFilters.category?.length}>
        {currentFilters.category?.map((item) => (
          <Chip
            {...chipProps}
            key={item}
            label={upperFirst(item)}
            onDelete={() => handleRemoveCategory(item)}
          />
        ))}
      </FiltersBlock>

      <FiltersBlock label="ID:" isShow={!!currentFilters.id}>
        <Chip {...chipProps} label={currentFilters.id} onDelete={handleRemoveId} />
      </FiltersBlock>
    </FiltersResult>
  );
}