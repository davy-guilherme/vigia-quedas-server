async function handleFall(topic, payload) {
    if (!payload.timestamp) {
        console.log('Payload inválido');
        return;
    }

    const deviceId = topic.split('/')[2];

    console.log('-------------------------');
    console.log(`Queda detectada: ${deviceId}`);

    console.log(payload);

    /*
        Aqui você pode:

        - salvar no banco
        - emitir websocket
        - criar ocorrência
        - iniciar timer
        - enviar push notification
        - chamar API
    */
}

module.exports = { handleFall };