import { Helmet } from 'react-helmet-async';

export default function SortieRequestListPage() {
  return (
    <>
      <Helmet>
        <title>Demande de sortie | Liste</title>
      </Helmet>

      <div>
        <h1>Liste des demandes de sortie</h1>
        {/* Add your list component here */}
      </div>
    </>
  );
}