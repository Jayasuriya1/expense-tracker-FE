import React, { createContext, useContext, useState } from "react";


export const AppContext = createContext(null)

export default function AppProvider({children}){
    const [user,setUser] = useState(null)
    const [transactionData,setTransactionData] = useState(null)
    
    return(
        <AppContext.Provider
        value={{
            user,
            setUser,
            transactionData,
            setTransactionData
        }}
        >
            {children}
        </AppContext.Provider>
    )
}

export const AppState = ()=>{
    return useContext(AppContext)
}