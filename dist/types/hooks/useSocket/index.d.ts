import { ISocketJSONType, SocketProps, SocketResponse } from "../../utils/types";
declare const useSocket: <T extends ISocketJSONType>(params?: SocketProps) => SocketResponse<T>;
export default useSocket;
