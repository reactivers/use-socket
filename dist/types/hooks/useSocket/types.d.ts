export declare type onOpenFunc = (data: any) => void;
export declare type onCloseFunc = (data: any) => void;
export declare type onErrorFunc = (data: any) => void;
export declare type onMessageFunc = (data: any, json: any) => void;
export interface SocketProps {
    url?: string;
    wss?: boolean;
    disconnectOnUnmount?: boolean;
}
export interface SocketEvents {
    onOpen?: onOpenFunc;
    onClose?: onCloseFunc;
    onError?: onErrorFunc;
    onMessage?: onMessageFunc;
}
export interface ISocketContext extends SocketProps {
    connect: (params: {
        path: string;
    }) => WebSocket;
}
export interface Dict<T = {}> {
    [key: string]: T;
}
export interface SocketState {
    readyState: number;
    lastData: any;
}
export interface SocketResponse extends SocketState {
    connect: (params?: IConnect) => WebSocket;
    socket: WebSocket;
    sendData: (data: any) => void;
}
export interface IConnect extends SocketEvents, SocketProps {
    endpoint?: string;
}
