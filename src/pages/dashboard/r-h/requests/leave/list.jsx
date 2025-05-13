import { Helmet } from 'react-helmet-async';

export default function CongeRequestListPage() {
  return (
    <>
      <Helmet>
        <title>Demande de congé | Liste</title>
      </Helmet>

      <div>
        <h1>Liste des demandes de congé</h1>
        {/* Add your list component here */}
      </div>
    </>
  );
}