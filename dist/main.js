"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = require("dotenv");
const compression_1 = __importDefault(require("compression"));
const helmet_1 = __importDefault(require("helmet"));
const cors_1 = __importDefault(require("cors"));
const morgan_1 = __importDefault(require("morgan"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const body_parser_1 = __importDefault(require("body-parser"));
const routers_1 = __importDefault(require("./routers"));
const mongo_connect_1 = __importDefault(require("./db/mongo.connect"));
const errorHandler_1 = __importDefault(require("./helpers/errorHandler"));
const http_1 = require("http");
const socket_io_1 = require("socket.io");
const Socket_service_1 = __importDefault(require("./services/Socket.service"));
(0, dotenv_1.config)();
const app = (0, express_1.default)();
const server = (0, http_1.createServer)(app);
const io = new socket_io_1.Server(server, {
    cors: {
        origin: process.env.MODE === 'DEV' ? 'http://localhost:3000' : process.env.CLIENT_URL, // Cho phép truy cập từ origin này
        methods: ['GET', 'POST'], // Chỉ cho phép các phương thức GET và POST
        allowedHeaders: ['Content-Type', 'Authorization', 'Cookie'], // Chỉ
        credentials: true
    },
    cookie: true
});
global._io = io; // cach 2
mongo_connect_1.default.Connect();
app.use((0, helmet_1.default)());
app.use((0, compression_1.default)());
app.use((0, morgan_1.default)('dev'));
app.use((0, cookie_parser_1.default)());
app.use(body_parser_1.default.json());
// for parsing application/x-www-form-urlencoded
app.use(body_parser_1.default.urlencoded({ extended: true }));
app.use((0, cors_1.default)({
    origin: process.env.MODE === 'DEV' ? 'http://localhost:3000' : process.env.CLIENT_URL, // Cho phép truy cập từ origin này
    methods: ['GET', 'POST'], // Chỉ cho phép các phương thức GET và POST
    allowedHeaders: ['Content-Type', 'Authorization', 'Cookie'], // Chỉ
    credentials: true
}));
global._io.on('connection', Socket_service_1.default.connection);
app.use('', routers_1.default);
app.use((error, req, res, next) => {
    return (0, errorHandler_1.default)(error, req, res, next);
});
server.listen(process.env.MODE === 'DEV' ? 4000 : process.env.PORT, () => {
    console.log('comming', process.env.MODE);
});
