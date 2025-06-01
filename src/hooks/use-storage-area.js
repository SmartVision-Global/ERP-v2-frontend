import { useState } from 'react';

import { useGetStores } from 'src/actions/store';

export function useStorageArea() {
  const { stores } = useGetStores();
  const [storageAreas, setStorageAreas] = useState([]);

  const addStorageArea = (newArea) => {
    setStorageAreas((prev) => [
      ...prev,
      {
        id: Math.random().toString(36).substr(2, 9), // temporary ID generation
        site: newArea.site_id,
        magazin: stores.find((store) => store.id === newArea.magasin_id)?.designation || '',
        entrepot: newArea.entrepot,
        observation: newArea.observation,
        createdAt: new Date().toISOString(),
      },
    ]);
  };

  return {
    storageAreas,
    addStorageArea,
  };
}
