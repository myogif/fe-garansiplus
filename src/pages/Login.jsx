import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Eye, EyeOff, Shield } from 'lucide-react';

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const user = await login(phone, password);
      if (user.role === 'MANAGER') {
        navigate('/dashboard');
      } else {
        navigate('/products');
      }
    } catch (err) {
      setError('Invalid phone number or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black">
      <div className="flex flex-col items-center justify-start min-h-screen">
        <div className="w-full max-w-md px-6 pt-24 pb-8">
          <div className="flex items-center justify-center mb-12">
            <div className="flex items-center gap-1">
              <Shield className="w-12 h-12 text-white" strokeWidth={1.5} />
              <div className="flex items-center">
                <span className="text-white text-3xl font-bold">GARANSI</span>
                <span className="text-[#C9F35B] text-3xl font-bold">+</span>
              </div>
            </div>
          </div>
        </div>

        <div className="w-full max-w-md px-6">
          <div className="bg-white rounded-t-[2rem] px-8 py-10 shadow-2xl">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Login</h1>
            <p className="text-gray-500 text-sm mb-8">
              Silahkan login ke akun anda!
            </p>

            {error && (
              <div className="mb-6 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="mb-6">
                <label className="block text-gray-700 text-sm mb-2">
                  No. Hp
                </label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C9F35B] focus:border-transparent"
                  placeholder="082xxxxxxx"
                  required
                />
              </div>

              <div className="mb-4">
                <label className="block text-gray-700 text-sm mb-2">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C9F35B] focus:border-transparent pr-12"
                    placeholder="••••••••"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>

              <div className="text-right mb-8">
                <Link
                  to="/forgot-password"
                  className="text-sm text-gray-600 hover:text-gray-900"
                >
                  Lupa Password?
                </Link>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#C9F35B] hover:bg-[#BCEB4F] text-gray-900 font-semibold py-4 rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Loading...' : 'Login'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
