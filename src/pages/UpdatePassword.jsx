import { useState } from 'react';
import { Lock, Eye, EyeOff } from 'lucide-react';

const UpdatePassword = () => {
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [toast, setToast] = useState(null);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = () => {
    if (formData.newPassword !== formData.confirmPassword) {
      setToast({
        type: 'error',
        message: 'New password and confirm password do not match',
      });
      return;
    }

    if (formData.newPassword.length < 8) {
      setToast({
        type: 'error',
        message: 'New password must be at least 8 characters long',
      });
      return;
    }

    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      setToast({
        type: 'success',
        message: 'Password updated successfully',
      });
      setIsLoading(false);
      
      // Reset form after success
      setTimeout(() => {
        setFormData({
          currentPassword: '',
          newPassword: '',
          confirmPassword: '',
        });
        setToast(null);
      }, 2000);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      {toast && (
        <div className={`fixed top-4 right-4 px-6 py-3 rounded-lg shadow-lg ${
          toast.type === 'success' ? 'bg-green-500' : 'bg-red-500'
        } text-white font-medium z-50`}>
          {toast.message}
        </div>
      )}

      <div className="w-full max-w-md">
        <div className="bg-white rounded-3xl shadow-2xl p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Update Password
          </h2>
          <p className="text-gray-500 text-sm mb-8">
            Silahkan ubah password anda!
          </p>

          <div className="space-y-5">
            <div>
              <label
                htmlFor="currentPassword"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Password Saat Ini
              </label>
              <div className="relative">
                <input
                  type={showCurrentPassword ? 'text' : 'password'}
                  id="currentPassword"
                  name="currentPassword"
                  value={formData.currentPassword}
                  onChange={handleChange}
                  className="w-full bg-white border border-gray-300 rounded-lg px-4 pr-11 py-3 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#C9F35B] focus:border-transparent"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showCurrentPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            <div>
              <label
                htmlFor="newPassword"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Password Baru
              </label>
              <div className="relative">
                <input
                  type={showNewPassword ? 'text' : 'password'}
                  id="newPassword"
                  name="newPassword"
                  value={formData.newPassword}
                  onChange={handleChange}
                  className="w-full bg-white border border-gray-300 rounded-lg px-4 pr-11 py-3 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#C9F35B] focus:border-transparent"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showNewPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Konfirmasi Password Baru
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="w-full bg-white border border-gray-300 rounded-lg px-4 pr-11 py-3 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#C9F35B] focus:border-transparent"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showConfirmPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            <button
              onClick={handleSubmit}
              disabled={isLoading}
              className="w-full px-4 py-3 bg-[#C9F35B] text-gray-900 rounded-lg hover:bg-[#b8e04a] transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed mt-6"
            >
              {isLoading ? 'Updating...' : 'Update Password'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpdatePassword;