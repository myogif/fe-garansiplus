import { createContext, useContext, useReducer, useEffect } from 'react';
import {
  login as authLogin,
  logout as authLogout,
  getStoredUser,
  getStoredToken,
  isTokenExpired,
  isLoggedIn as getIsLoggedIn,
} from '../services/auth';

const AuthContext = createContext();

const authReducer = (state, action) => {
  switch (action.type) {
    case 'LOGIN':
      return {
        ...state,
        token: action.payload.token,
        user: action.payload.user,
        isAuthed: true,
        role: action.payload.user.role,
        loading: false,
      };
    case 'LOGOUT':
      return {
        ...state,
        token: null,
        user: null,
        isAuthed: false,
        role: null,
        loading: false,
      };
    case 'RESTORE_SESSION':
      return {
        ...state,
        token: action.payload.token,
        user: action.payload.user,
        isAuthed: true,
        role: action.payload.user.role,
        loading: false,
      };
    case 'SET_LOADING':
      return {
        ...state,
        loading: action.payload,
      };
    default:
      return state;
  }
};

const initialState = {
  token: null,
  user: null,
  isAuthed: false,
  role: null,
  loading: true,
};

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  useEffect(() => {
    const restoreSession = () => {
      try {
        console.log('🔍 Starting session restoration...');

        const token = getStoredToken();
        const user = getStoredUser();
        const loggedInFlag = getIsLoggedIn();

        console.log('📊 Session Data:');
        console.log('  - Token exists:', !!token);
        console.log('  - Token value:', token ? `${token.substring(0, 20)}...` : 'null');
        console.log('  - User exists:', !!user);
        console.log('  - User data:', user);
        console.log('  - isLoggedIn flag:', loggedInFlag);

        if (!token) {
          console.log('❌ No token found in localStorage');
          dispatch({ type: 'SET_LOADING', payload: false });
          return;
        }

        if (!user) {
          console.log('❌ No user found in localStorage');
          authLogout();
          dispatch({ type: 'SET_LOADING', payload: false });
          return;
        }

        const tokenExpired = isTokenExpired(token);
        console.log('  - Token expired check result:', tokenExpired);

        if (tokenExpired) {
          console.log('❌ Token is expired');
          authLogout();
          dispatch({ type: 'SET_LOADING', payload: false });
          return;
        }

        console.log('✅ All checks passed - restoring session');

        if (!loggedInFlag) {
          console.log('  ℹ️ Setting missing isLoggedIn flag');
          localStorage.setItem('isLoggedIn', 'true');
        }

        dispatch({
          type: 'RESTORE_SESSION',
          payload: { token, user },
        });

        console.log('✅ Session restored successfully');
      } catch (error) {
        console.error('❌ Failed to restore session:', error);
        authLogout();
        dispatch({ type: 'SET_LOADING', payload: false });
      }
    };

    restoreSession();

    const handleAuthExpired = () => {
      dispatch({ type: 'LOGOUT' });
    };

    window.addEventListener('auth:expired', handleAuthExpired);

    return () => {
      window.removeEventListener('auth:expired', handleAuthExpired);
    };
  }, []);

  const login = async (phone, password) => {
    const { token, user } = await authLogin(phone, password);
    dispatch({
      type: 'LOGIN',
      payload: { token, user },
    });
    return user;
  };

  const logout = () => {
    authLogout();
    dispatch({ type: 'LOGOUT' });
  };

  return (
    <AuthContext.Provider
      value={{
        ...state,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
