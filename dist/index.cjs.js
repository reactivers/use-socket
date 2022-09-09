'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var react = require('react');
var jsxRuntime = require('react/jsx-runtime');

/******************************************************************************
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

var SocketContext = react.createContext({});
var useSocketContext = function () {
    var context = react.useContext(SocketContext);
    if (context === undefined) {
        throw new Error('useSocketContext must be used within an SocketContext.Provider');
    }
    return context;
};

var useSocket = function (_a) {
    var _b = _a === void 0 ? {} : _a, propUrl = _b.url, propWss = _b.wss, propDisconnectOnUnmount = _b.disconnectOnUnmount;
    var _c = useSocketContext(), contextConnect = _c.connect, contextUrl = _c.url, contextDisconnectOnUnmount = _c.disconnectOnUnmount, contextWss = _c.wss;
    var socket = react.useRef();
    var onOpenRef = react.useRef();
    var onMessageRef = react.useRef();
    var onCloseRef = react.useRef();
    var onErrorRef = react.useRef();
    var disconnectOnUnmount = react.useRef(propDisconnectOnUnmount || contextDisconnectOnUnmount);
    var _d = react.useState({ readyState: 0, lastData: undefined }), socketState = _d[0], setSocketState = _d[1];
    react.useEffect(function () {
        return function () {
            var _a, _b;
            if (disconnectOnUnmount.current) {
                if ((_a = socket.current) === null || _a === void 0 ? void 0 : _a.close) {
                    (_b = socket.current) === null || _b === void 0 ? void 0 : _b.close(1000, "User disconnected!");
                }
            }
        };
    }, [disconnectOnUnmount.current]);
    var connect = react.useCallback(function (_a) {
        var _b = _a === void 0 ? {} : _a, _disconnectOnUnmount = _b.disconnectOnUnmount, endpoint = _b.endpoint, onClose = _b.onClose, onError = _b.onError, onMessage = _b.onMessage, onOpen = _b.onOpen, _url = _b.url, wss = _b.wss;
        var url = _url || propUrl || contextUrl;
        var isSecure = wss || propWss || contextWss;
        var protocol = isSecure ? "wss" : "ws";
        var path = "".concat(protocol, "://").concat(url).concat(endpoint);
        onOpenRef.current = onOpen;
        onMessageRef.current = onMessage;
        onCloseRef.current = onClose;
        onErrorRef.current = onError;
        disconnectOnUnmount.current = _disconnectOnUnmount || propDisconnectOnUnmount || contextDisconnectOnUnmount;
        socket.current = contextConnect({ path: path });
        setSocketState(function (old) { var _a; return (__assign(__assign({}, old), { readyState: (_a = socket.current) === null || _a === void 0 ? void 0 : _a.readyState })); });
        return socket.current;
    }, [contextConnect, propUrl, contextUrl, propDisconnectOnUnmount, contextDisconnectOnUnmount, propWss, contextWss]);
    var onopen = react.useCallback(function (event) {
        setSocketState(function (old) { return (__assign(__assign({}, old), { readyState: WebSocket.OPEN })); });
        if (onOpenRef.current)
            onOpenRef.current(event);
    }, [onOpenRef.current]);
    var onmessage = react.useCallback(function (event) {
        setSocketState(function (old) { return (__assign(__assign({}, old), { lastData: event.data })); });
        var data = event.data;
        try {
            data = JSON.parse(data);
        }
        catch (e) {
            //console.error("JSON PARSE error", e)
        }
        if (onMessageRef.current)
            onMessageRef.current(event, data);
    }, [onMessageRef.current]);
    var onclose = react.useCallback(function (event) {
        setSocketState(function (old) { return (__assign(__assign({}, old), { readyState: WebSocket.CLOSED })); });
        if (onCloseRef.current)
            onCloseRef.current(event);
    }, [onCloseRef.current]);
    var onerror = react.useCallback(function (event) {
        setSocketState(function (old) { return (__assign(__assign({}, old), { readyState: WebSocket.CLOSING })); });
        if (onErrorRef.current)
            onErrorRef.current(event);
    }, [onErrorRef.current]);
    react.useEffect(function () {
        var _a, _b;
        if ((_a = socket.current) === null || _a === void 0 ? void 0 : _a.addEventListener)
            (_b = socket.current) === null || _b === void 0 ? void 0 : _b.addEventListener('open', onopen);
        return function () {
            var _a, _b;
            if ((_a = socket.current) === null || _a === void 0 ? void 0 : _a.removeEventListener)
                (_b = socket.current) === null || _b === void 0 ? void 0 : _b.removeEventListener('open', onopen);
        };
    }, [socket.current, onopen]);
    react.useEffect(function () {
        var _a, _b;
        if ((_a = socket.current) === null || _a === void 0 ? void 0 : _a.addEventListener)
            (_b = socket.current) === null || _b === void 0 ? void 0 : _b.addEventListener('close', onclose);
        return function () {
            var _a, _b;
            if ((_a = socket.current) === null || _a === void 0 ? void 0 : _a.removeEventListener)
                (_b = socket.current) === null || _b === void 0 ? void 0 : _b.removeEventListener('close', onclose);
        };
    }, [socket.current, onclose]);
    react.useEffect(function () {
        var _a, _b;
        if ((_a = socket.current) === null || _a === void 0 ? void 0 : _a.addEventListener)
            (_b = socket.current) === null || _b === void 0 ? void 0 : _b.addEventListener('message', onmessage);
        return function () {
            var _a, _b;
            if ((_a = socket.current) === null || _a === void 0 ? void 0 : _a.removeEventListener)
                (_b = socket.current) === null || _b === void 0 ? void 0 : _b.removeEventListener('message', onmessage);
        };
    }, [socket.current, onmessage]);
    react.useEffect(function () {
        var _a, _b;
        if ((_a = socket.current) === null || _a === void 0 ? void 0 : _a.addEventListener)
            (_b = socket.current) === null || _b === void 0 ? void 0 : _b.addEventListener('error', onerror);
        return function () {
            var _a, _b;
            if ((_a = socket.current) === null || _a === void 0 ? void 0 : _a.removeEventListener)
                (_b = socket.current) === null || _b === void 0 ? void 0 : _b.removeEventListener('error', onerror);
        };
    }, [socket.current, onerror]);
    var sendData = react.useCallback(function (data) {
        var _a;
        (_a = socket.current) === null || _a === void 0 ? void 0 : _a.send(data);
    }, [socket.current]);
    return __assign({ connect: connect, socket: socket.current, sendData: sendData }, socketState);
};

var SocketProvider = function (_a) {
    var children = _a.children, disconnectOnUnmount = _a.disconnectOnUnmount, url = _a.url, wss = _a.wss;
    var sockets = react.useRef({});
    var connect = react.useCallback(function (_a) {
        var path = _a.path;
        var socket = sockets.current[path];
        if (!!socket) {
            var readyState = socket.readyState;
            if (readyState === WebSocket.OPEN || readyState === WebSocket.CONNECTING)
                return socket;
        }
        var _socket = new WebSocket(path);
        sockets.current[path] = _socket;
        return _socket;
    }, [sockets.current]);
    return (jsxRuntime.jsx(SocketContext.Provider, __assign({ value: { connect: connect, disconnectOnUnmount: disconnectOnUnmount, url: url, wss: wss } }, { children: children })));
};

exports.SocketContext = SocketContext;
exports.SocketProvider = SocketProvider;
exports.useSocket = useSocket;
exports.useSocketContext = useSocketContext;
