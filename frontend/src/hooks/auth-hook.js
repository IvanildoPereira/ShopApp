import { useState, useCallback, useEffect } from 'react';
import openSocket from 'socket.io-client';

let logoutTimer;

export const useAuth = () => {
  const [token, setToken] = useState(false);
  const [tokenExpirationDate, setTokenExpirationDate] = useState();
  const [userId, setUserId] = useState(false);
  const [isLoading, setLoading] = useState(true)
  const [socket, setSocket] = useState()


  // Login
  const login = useCallback((uid, token, expirationDate) => {
    setToken(token);
    setUserId(uid);
    const socket = openSocket(`${process.env.REACT_APP_BACKEND}/`)
    socket.emit('user_connected', uid)
    setSocket(socket);
    setLoading(false)
    const tokenExpirationDate = expirationDate || new Date(new Date().getTime() + 1000 * 60 * 60);
    setTokenExpirationDate(tokenExpirationDate);
    localStorage.setItem(
      'userData',
      JSON.stringify({
        userId: uid,
        token: token,
        expiration: tokenExpirationDate.toISOString()
      })
    );
  }, []);

  // Logout
  const logout = useCallback(async (socketOut, userId) => {
    if (socketOut) {
      socketOut.emit('user_disconnected', userId)
    }
    setToken(null);
    setTokenExpirationDate(null);
    setUserId(null);
    setSocket(null);
    localStorage.removeItem('userData');
  }, []);


  // Auto-Logout to expirate
  useEffect(() => {
    if (token && tokenExpirationDate) {
      const remainingTime = tokenExpirationDate.getTime() - new Date().getTime();
      logoutTimer = setTimeout(logout, remainingTime);
    } else {
      clearTimeout(logoutTimer);
    }
    setLoading(false)
  }, [token, logout, tokenExpirationDate]);

  useEffect(() => {
    const storedData = JSON.parse(localStorage.getItem('userData'));
    if (
      storedData &&
      storedData.token &&
      new Date(storedData.expiration) > new Date()
    ) {
      login(storedData.userId, storedData.token, new Date(storedData.expiration));
    }
    setLoading(false)
  }, [login]);

  return { token, login, logout, userId, isLoading, socket };
};