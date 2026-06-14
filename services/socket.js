const EmergencyContact = require('../models/EmergencyContact'); 

let io;

function initialize(socketServer) {
    io = socketServer;

    io.on('connection', (socket) => {
        console.log(`Cliente conectado: ${socket.id}`);

        // Transformamos o callback em async para poder rodar as queries do banco
        socket.on('join-user', async (userId) => {
            console.log(`Tentativa de join recebida. ID do Usuário: ${userId}`);
            
            if (!userId) {
                console.error(`Aviso: userId inválido recebido do socket ${socket.id}`);
                return;
            }

            // 1. O usuário entra na sua própria sala padrão (Ex: user-1)
            socket.join(`user-${userId}`);
            console.log(`Socket ${socket.id} entrou na sala user-${userId}`);

            try {
                // 2. Busca quem esse usuário logado monitora
                const monitoredUsers = await EmergencyContact.findWhoIMonitore(userId);
                
                // 3. Coloca o socket dele para "escutar" a sala de cada monitorado ativo
                monitoredUsers.forEach(monitored => {
                    if (monitored.status === 'active') {
                        const targetRoom = `user-${monitored.monitored_user_id}`;
                        socket.join(targetRoom);
                        console.log(`Socket ${socket.id} (Cuidador) também entrou na sala ${targetRoom} (Monitorado)`);
                    }
                });
            } catch (error) {
                console.error(`Erro ao buscar monitorados para o socket do usuário ${userId}:`, error);
            }
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