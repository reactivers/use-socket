import { FC, PropsWithChildren, useCallback, useRef } from "react";
import { SocketProps } from "../../utils/types";
import { SocketContext } from "./context";

const SocketProvider: FC<PropsWithChildren<SocketProps>> = ({
  children,
  disconnectOnUnmount,
  url,
  wss,
}) => {
  const sockets = useRef<Record<string, WebSocket>>({});

  const connect: ({ path }: { path: string }) => WebSocket = useCallback(
    ({ path }) => {
      const socket = sockets.current[path];
      if (socket) {
        const { readyState } = socket;
        if (
          readyState === WebSocket.OPEN ||
          readyState === WebSocket.CONNECTING
        )
          return socket;
      }
      const _socket = new WebSocket(path);
      sockets.current[path] = _socket;
      return _socket;
    },
    [sockets.current],
  );

  return (
    <SocketContext.Provider value={{ connect, disconnectOnUnmount, url, wss }}>
      {children}
    </SocketContext.Provider>
  );
};

export default SocketProvider;
