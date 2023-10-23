import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Callback: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Vous pouvez ici extraire les tokens ou toute autre information depuis l'URL
    // puis les stocker dans le local storage, ou les envoyer au backend pour y être stockés
    // Puis rediriger l'utilisateur vers la page souhaitée
    navigate('/profile');
  }, [navigate]);

  return <div>En cours de traitement...</div>;
};

export default Callback;