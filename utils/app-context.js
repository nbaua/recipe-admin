import React, { useContext, useState } from 'react';

const AppContext = React.createContext();

export function useAppContext() {
	return useContext(AppContext);
}

export function AppContextProvider({ children }) {
	const [activeSession, setActiveSession] = useState('bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2MDhiZjE3MmEyMjI4ODI2OTA2OTk1OTIiLCJpYXQiOjE2MTk3ODQwNTZ9.g8svznwEnikyNg88JDashWLKpAtJdwMjFs3VwkPGigE');

	function setActiveSessionHandler(val) {
		setActiveSession(val);
	}
	return <AppContext.Provider value={{ activeSession, setActiveSessionHandler }}>{children}</AppContext.Provider>;
}
