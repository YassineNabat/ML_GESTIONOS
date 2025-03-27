export const setAuthToken = (token) => {
    const expirationTime = new Date().getTime() + 60 * 60 * 1000; // 1 heure
    const authData = { token, expirationTime };
    localStorage.setItem('authToken', JSON.stringify(authData)); // Stocker un objet JSON valide
};

export const getAuthToken = () => {
    const authData = localStorage.getItem('authToken');
    if (!authData) return null;

    try {
        const { token, expirationTime } = JSON.parse(authData); // Parser l'objet JSON
        if (new Date().getTime() > expirationTime) {
            localStorage.removeItem('authToken');
            return null;
        }
        return token;
    } catch (error) {
        console.error('Erreur lors du parsing du token:', error);
        localStorage.removeItem('authToken'); // Nettoyer les données corrompues
        return null;
    }
};

export const clearAuthToken = () => {
    localStorage.removeItem('authToken');
};
