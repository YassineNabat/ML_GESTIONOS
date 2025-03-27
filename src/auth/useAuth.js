import { useState, useEffect } from 'react';
import { getAuthToken, setAuthToken, clearAuthToken } from './authService';

export const useAuth = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(!!getAuthToken());

    useEffect(() => {
        const token = getAuthToken();
        setIsAuthenticated(!!token);
    }, []);

    const login = (token) => {
        setAuthToken(token);
        setIsAuthenticated(true);
    };

    const logout = () => {
        clearAuthToken();
        setIsAuthenticated(false);
    };

    return { isAuthenticated, login, logout };
};
