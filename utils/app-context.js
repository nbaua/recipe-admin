import React, { useContext, useState } from 'react';

const AppContext = React.createContext();

export function useAppContext() {
	return useContext(AppContext);
}

export function AppContextProvider({ children }) {
	const [activeUserToken, setActiveUserToken] = useState('');

	function setActiveUserTokenHandler(val) {
		setActiveUserToken(val);
	}

	function getActiveUserTokenHandler() {
		if (activeUserToken) {
			return 'bearer ' + activeUserToken;
		} else {
			return '';
		}
	}

	return <AppContext.Provider value={{ getActiveUserTokenHandler, setActiveUserTokenHandler }}>{children}</AppContext.Provider>;
}
