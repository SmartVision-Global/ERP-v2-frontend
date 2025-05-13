import { Helmet } from 'react-helmet-async';

export default function PretRequestListPage() {
  return (
    <>
      <Helmet>
        <title>Demande de prêt | Liste</title>
      </Helmet>

      <div>
        <h1>Liste des demandes de prêt</h1>
        {/* Add your list component here */}
      </div>
    </>
  );
}