import { ISocketContext } from "../../utils/types";
declare const SocketContext: import("react").Context<ISocketContext>;
declare const useSocketContext: () => ISocketContext;
export { useSocketContext, SocketContext };
