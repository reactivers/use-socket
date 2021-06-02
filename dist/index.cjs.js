'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var react = require('react');
var jsxRuntime = require('react/jsx-runtime');

/*! *****************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */

var __assign = function() {
    __assign = Object.assign || function __assign(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};

var emptyFunction = function () { };

var SocketContext = react.createContext({});
var SocketProvider = function (_a) {
    var children = _a.children;
    var sockets = react.useRef({});
    var connect = react.useCallback(function (_a) {
        var path = _a.path;
        var socket = sockets.current[path] || {};
        var readyState = socket.readyState;
        if (readyState === WebSocket.OPEN || readyState === WebSocket.CONNECTING)
            return socket;
        var _socket = new WebSocket(path);
        sockets.current[path] = _socket;
        return _socket;
    }, [sockets.current]);
    return (jsxRuntime.jsx(SocketContext.Provider, __assign({ value: { connect: connect } }, { children: children }), void 0));
};
var useSocketContext = function () {
    var context = react.useContext(SocketContext);
    if (context === undefined) {
        throw new Error('useSocketContext must be used within an SocketContext.Provider');
    }
    return context;
};

var useSocket = function (_a) {
    var url = _a.url, _b = _a.wss, wss = _b === void 0 ? false : _b, _c = _a.disconnectOnUnmount, disconnectOnUnmount = _c === void 0 ? true : _c, _d = _a.onOpen, onOpen = _d === void 0 ? emptyFunction : _d, _e = _a.onClose, onClose = _e === void 0 ? emptyFunction : _e, _f = _a.onError, onError = _f === void 0 ? emptyFunction : _f, _g = _a.onMessage, onMessage = _g === void 0 ? emptyFunction : _g;
    var protocol = wss ? "wss" : "ws";
    var connectContext = useSocketContext().connect;
    //@ts-ignore
    var socket = react.useRef({});
    var _h = react.useState({ readyState: 0, lastData: undefined }), socketState = _h[0], setSocketState = _h[1];
    react.useEffect(function () {
        return function () {
            if (disconnectOnUnmount) {
                if (socket.current.close) {
                    socket.current.close(1000, "User disconnected!");
                }
            }
        };
    }, [disconnectOnUnmount]);
    var connect = react.useCallback(function (_a) {
        var _url = _a.url;
        var path = protocol + "://" + (_url || url);
        socket.current = connectContext({ path: path });
        setSocketState(function (old) { return (__assign(__assign({}, old), { readyState: socket.current.readyState })); });
        return socket.current;
    }, [connectContext, protocol, url, disconnectOnUnmount]);
    var onopen = react.useCallback(function (event) {
        setSocketState(function (old) { return (__assign(__assign({}, old), { readyState: WebSocket.OPEN })); });
        onOpen(event);
    }, [onOpen]);
    var onmessage = react.useCallback(function (event) {
        setSocketState(function (old) { return (__assign(__assign({}, old), { lastData: event.data })); });
        var data = event.data;
        try {
            data = JSON.parse(data);
        }
        catch (e) {
            //console.error("JSON PARSE error", e)
        }
        onMessage(event, data);
    }, [onMessage]);
    var onclose = react.useCallback(function (event) {
        setSocketState(function (old) { return (__assign(__assign({}, old), { readyState: WebSocket.CLOSED })); });
        onClose(event);
    }, [onClose]);
    var onerror = react.useCallback(function (event) {
        setSocketState(function (old) { return (__assign(__assign({}, old), { readyState: WebSocket.CLOSING })); });
        onError(event);
    }, [onError]);
    react.useEffect(function () {
        if (socket.current.addEventListener)
            socket.current.addEventListener('open', onopen);
        return function () {
            if (socket.current.removeEventListener)
                socket.current.removeEventListener('open', onopen);
        };
    }, [socket.current, onopen]);
    react.useEffect(function () {
        if (socket.current.addEventListener)
            socket.current.addEventListener('close', onclose);
        return function () {
            if (socket.current.removeEventListener)
                socket.current.removeEventListener('close', onclose);
        };
    }, [socket.current, onclose]);
    react.useEffect(function () {
        if (socket.current.addEventListener)
            socket.current.addEventListener('message', onmessage);
        return function () {
            if (socket.current.removeEventListener)
                socket.current.removeEventListener('message', onmessage);
        };
    }, [socket.current, onmessage]);
    react.useEffect(function () {
        if (socket.current.addEventListener)
            socket.current.addEventListener('error', onerror);
        return function () {
            if (socket.current.removeEventListener)
                socket.current.removeEventListener('error', onerror);
        };
    }, [socket.current, onerror]);
    var sendData = react.useCallback(function (data) {
        socket.current.send(data);
    }, [socket.current]);
    return __assign({ connect: connect, socket: socket.current, sendData: sendData }, socketState);
};

exports.SocketProvider = SocketProvider;
exports.useSocket = useSocket;
