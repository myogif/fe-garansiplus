import { createContext, useContext, useReducer, useEffect } from 'react';
import {
  login as authLogin,
  logout as authLogout,
  getStoredUser,
  getStoredToken,
  isTokenExpired,
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
      };
    case 'LOGOUT':
      return {
        ...state,
        token: null,
        user: null,
        isAuthed: false,
        role: null,
      };
    case 'RESTORE_SESSION':
      return {
        ...state,
        token: action.payload.token,
        user: action.payload.user,
        isAuthed: true,
        role: action.payload.user.role,
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
};

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  useEffect(() => {
    const token = getStoredToken();
    const user = getStoredUser();

    if (token && user && !isTokenExpired(token)) {
      dispatch({
        type: 'RESTORE_SESSION',
        payload: { token, user },
      });
    } else if (token) {
      authLogout();
    }
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
