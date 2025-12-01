import { useEffect, useState } from 'react';
import { CheckCircle, XCircle, Info, X } from 'lucide-react';

const Toast = ({ show, message, type = 'success', onClose }) => {
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

  useEffect(() => {
    if (show && onClose) {
      const timer = setTimeout(() => {
        onClose();
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [show, onClose]);

  const displayMessage = message || authMessage;
  const visible = show || authVisible;

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

  const handleClose = () => {
    if (onClose) {
      onClose();
    }
  };

  return (
    <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-50 animate-fade-in">
      <div className={`${typeStyles[type]} px-6 py-3 rounded-lg shadow-lg flex items-center gap-3`}>
        {icons[type]}
        <span className="text-sm font-medium">{displayMessage}</span>
        {onClose && (
          <button
            onClick={handleClose}
            className="ml-2 hover:opacity-80 transition-opacity"
            aria-label="Close"
          >
            <X size={16} />
          </button>
        )}
      </div>
    </div>
  );
};

export default Toast;
