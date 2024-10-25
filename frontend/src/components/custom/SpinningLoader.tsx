import React from 'react';
import { LoaderCircle } from 'lucide-react';

const SpinningLoader: React.FC = () => {
  const styles = {
    animation: 'spin 1s linear infinite',
    display: 'inline-block',
  };

  const keyframes = `
    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
  `;

  return (
    <>
      <style>{keyframes}</style>
      <LoaderCircle style={styles} />
    </>
  );
};

export default SpinningLoader;
