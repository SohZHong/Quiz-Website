import { useState, useEffect } from 'react';

function useAuth() {
    const [isAuthenticated, setIsAuthenticated] = useState(
        localStorage.getItem('isAuthenticated') === 'true'
    );

    const login = () => {
        setIsAuthenticated(true);
        localStorage.setItem('isAuthenticated', 'true');
    };

    const logout = () => {
        setIsAuthenticated(false);
        localStorage.setItem('isAuthenticated', 'false');
    };

    useEffect(() => {
        const storedAuth = localStorage.getItem('isAuthenticated');
        if (storedAuth !== null) {
            setIsAuthenticated(storedAuth === 'true');
        }
    }, []);

    return {
        isAuthenticated,
        login,
        logout
    };
}

export default useAuth;
