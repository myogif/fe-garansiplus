import { useEffect, useState } from 'react';

const Toast = () => {
  const [visible, setVisible] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const handleAuthExpired = (event) => {
      setMessage(event.detail.message);
      setVisible(true);

      setTimeout(() => {
        setVisible(false);
      }, 3000);
    };

    window.addEventListener('auth:expired', handleAuthExpired);

    return () => {
      window.removeEventListener('auth:expired', handleAuthExpired);
    };
  }, []);

  if (!visible) return null;

  return (
    <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-50 animate-fade-in">
      <div className="bg-gray-900 text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-2">
        <span className="text-sm">{message}</span>
      </div>
    </div>
  );
};

export default Toast;
