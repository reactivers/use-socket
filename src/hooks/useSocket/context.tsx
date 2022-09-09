import { createContext, useContext } from "react";
import { ISocketContext } from "./types";

const SocketContext = createContext({} as ISocketContext);

const useSocketContext = () => {
    const context = useContext(SocketContext);
    if (context === undefined) {
        throw new Error('useSocketContext must be used within an SocketContext.Provider');
    }
    return context;
};

export { useSocketContext, SocketContext };
