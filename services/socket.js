let io;

function initialize(socketServer) {
    io = socketServer;

    io.on('connection', (socket) => {
        console.log(`Cliente conectado: ${socket.id}`);

        socket.on('join-user', (userId) => {
            // Se o userId vier nulo ou undefined, o log vai te dedurar o erro
            console.log(`Tentativa de join recebida. ID do Usuário: ${userId}`);
            
            if (!userId) {
                console.error(`Aviso: userId inválido recebido do socket ${socket.id}`);
                return;
            }

            socket.join(`user-${userId}`);
            console.log(`Socket ${socket.id} entrou na sala user-${userId}`);
        });

        socket.on('disconnect', () => {
            console.log(`Cliente desconectado: ${socket.id}`);
        });
    });
}

function getIO() {
    return io;
}

module.exports = {
    initialize,
    getIO
};