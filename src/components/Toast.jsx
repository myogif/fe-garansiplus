import { useEffect, useState } from 'react';
import { CheckCircle, XCircle, Info } from 'lucide-react';

const Toast = ({ message, type = 'success' }) => {
  const [authMessage, setAuthMessage] = useState('');
  const [authVisible, setAuthVisible] = useState(false);

  useEffect(() => {
    const handleAuthExpired = (event) => {
      setAuthMessage(event.detail.message);
      setAuthVisible(true);

      setTimeout(() => {
        setAuthVisible(false);
      }, 3000);
    };

    window.addEventListener('auth:expired', handleAuthExpired);

    return () => {
      window.removeEventListener('auth:expired', handleAuthExpired);
    };
  }, []);

  const displayMessage = message || authMessage;
  const visible = message || authVisible;

  if (!visible) return null;

  const typeStyles = {
    success: 'bg-green-600 text-white',
    error: 'bg-red-600 text-white',
    info: 'bg-blue-600 text-white',
  };

  const icons = {
    success: <CheckCircle size={20} />,
    error: <XCircle size={20} />,
    info: <Info size={20} />,
  };

  return (
    <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-50 animate-fade-in">
      <div className={`${typeStyles[type]} px-6 py-3 rounded-lg shadow-lg flex items-center gap-3`}>
        {icons[type]}
        <span className="text-sm font-medium">{displayMessage}</span>
      </div>
    </div>
  );
};

export default Toast;
