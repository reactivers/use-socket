import { useCallback, useEffect, useRef, useState } from 'react';
import { useSocketContext } from './context';
import { IConnect, onCloseFunc, onErrorFunc, onMessageFunc, onOpenFunc, SocketProps, SocketResponse, SocketState } from './types';

const useSocket: (props?: SocketProps) => SocketResponse = ({ url: propUrl, wss: propWss, disconnectOnUnmount: propDisconnectOnUnmount } = {}) => {
    const { connect: contextConnect, url: contextUrl, disconnectOnUnmount: contextDisconnectOnUnmount, wss: contextWss } = useSocketContext();

    const socket = useRef<WebSocket>();
    const onOpenRef = useRef<onOpenFunc>();
    const onMessageRef = useRef<onMessageFunc>();
    const onCloseRef = useRef<onCloseFunc>();
    const onErrorRef = useRef<onErrorFunc>();
    const disconnectOnUnmount = useRef<boolean>(propDisconnectOnUnmount || contextDisconnectOnUnmount);

    const [socketState, setSocketState] = useState<SocketState>({ readyState: 0, lastData: undefined })

    useEffect(() => {
        return () => {
            if (disconnectOnUnmount.current) {
                if (socket.current?.close) {
                    socket.current?.close(1000, "User disconnected!");
                }
            }
        }
    }, [disconnectOnUnmount.current])

    const connect: (params?: IConnect) => WebSocket = useCallback(({
        disconnectOnUnmount: _disconnectOnUnmount,
        endpoint,
        onClose,
        onError,
        onMessage,
        onOpen,
        url: _url,
        wss
    } = {}) => {

        const url = _url || propUrl || contextUrl;
        const isSecure = wss || propWss || contextWss;
        const protocol = isSecure ? "wss" : "ws"
        const path = `${protocol}://${url}${endpoint || ""}`;

        onOpenRef.current = onOpen;
        onMessageRef.current = onMessage;
        onCloseRef.current = onClose;
        onErrorRef.current = onError;
        disconnectOnUnmount.current = _disconnectOnUnmount || propDisconnectOnUnmount || contextDisconnectOnUnmount;

        socket.current = contextConnect({ path });
        setSocketState(old => ({ ...old, readyState: socket.current?.readyState }));

        return socket.current;
    }, [contextConnect, propUrl, contextUrl, propDisconnectOnUnmount, contextDisconnectOnUnmount, propWss, contextWss])

    const onopen = useCallback((event) => {
        setSocketState(old => ({ ...old, readyState: WebSocket.OPEN }))
        if (onOpenRef.current)
            onOpenRef.current(event)
    }, [onOpenRef.current])

    const onmessage = useCallback((event) => {
        setSocketState(old => ({ ...old, lastData: event.data }))
        let { data } = event;
        try {
            data = JSON.parse(data);
        } catch (e) {
            //console.error("JSON PARSE error", e)
        }
        if (onMessageRef.current)
            onMessageRef.current(event, data)
    }, [onMessageRef.current])

    const onclose = useCallback((event) => {
        setSocketState(old => ({ ...old, readyState: WebSocket.CLOSED }))
        if (onCloseRef.current)
            onCloseRef.current(event)
    }, [onCloseRef.current])

    const onerror = useCallback((event) => {
        setSocketState(old => ({ ...old, readyState: WebSocket.CLOSING }))
        if (onErrorRef.current)
            onErrorRef.current(event)
    }, [onErrorRef.current])

    useEffect(() => {
        if (socket.current?.addEventListener) socket.current?.addEventListener('open', onopen)
        return () => {
            if (socket.current?.removeEventListener)
                socket.current?.removeEventListener('open', onopen);
        }
    }, [socket.current, onopen])

    useEffect(() => {
        if (socket.current?.addEventListener) socket.current?.addEventListener('close', onclose)
        return () => {
            if (socket.current?.removeEventListener)
                socket.current?.removeEventListener('close', onclose);
        }
    }, [socket.current, onclose])

    useEffect(() => {
        if (socket.current?.addEventListener) socket.current?.addEventListener('message', onmessage)
        return () => {
            if (socket.current?.removeEventListener)
                socket.current?.removeEventListener('message', onmessage);
        }
    }, [socket.current, onmessage])

    useEffect(() => {
        if (socket.current?.addEventListener) socket.current?.addEventListener('error', onerror)
        return () => {
            if (socket.current?.removeEventListener)
                socket.current?.removeEventListener('error', onerror);
        }
    }, [socket.current, onerror])


    const sendData = useCallback((data) => {
        socket.current?.send(data)
    }, [socket.current])

    return { connect, socket: socket.current, sendData, ...socketState }
}

export default useSocket;
