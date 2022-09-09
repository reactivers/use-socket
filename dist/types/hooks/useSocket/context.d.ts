import { ISocketContext } from "./types";
declare const SocketContext: import("react").Context<ISocketContext>;
declare const useSocketContext: () => ISocketContext;
export { useSocketContext, SocketContext };
