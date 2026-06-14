// public/js/toast-notification.js

function initToastSystem() {
    if (typeof socket === 'undefined') {
        if (typeof io !== 'undefined') {
            window.socket = io(); 
        } else {
            return;
        }
    }

    if (typeof socket !== 'undefined') {
        socket.on('new-event', (event) => {
            let toastContainer = document.querySelector('.toast-container');
            if (!toastContainer) {
                toastContainer = document.createElement('div');
                toastContainer.className = 'toast-container position-fixed bottom-0 end-0 p-3';
                toastContainer.style.zIndex = '1080';
                document.body.appendChild(toastContainer);
            }

            const toastId = 'toast-' + Date.now();

            const toastHtml = `
                <div id="${toastId}" class="toast text-bg-dark border-0 shadow-lg" role="alert" aria-live="assertive" aria-atomic="true" data-bs-delay="8000">
                    <div class="toast-header text-bg-dark border-bottom border-secondary">
                        <i class="bi bi-exclamation-triangle-fill text-danger me-2"></i>
                        <strong class="me-auto text-danger fw-bold">ALERTA DE QUEDA</strong>
                        <small class="text-muted">Agora</small>
                        <button type="button" class="btn-close btn-close-white" data-bs-dismiss="toast" aria-label="Close"></button>
                    </div>
                    <div class="toast-body p-3">
                        <p class="mb-2 fw-semibold">Uma possível queda foi detectada!</p>
                        <ul class="list-unstyled small text-muted mb-0">
                            <li><strong>Dispositivo:</strong> ${event.device_name || 'Não identificado'}</li>
                            <li><strong>Horário:</strong> ${new Date().toLocaleTimeString('pt-BR')}</li>
                        </ul>
                        <hr class="border-secondary my-2">
                        <a href="/dashboard/events" class="btn btn-sm btn-danger w-100 fw-bold">
                            <i class="bi bi-eye-fill me-1"></i> Verificar Emergência
                        </a>
                    </div>
                </div>
            `;

            toastContainer.insertAdjacentHTML('afterbegin', toastHtml);

            const newToastElement = document.getElementById(toastId);
            if (newToastElement) {
                const toastInstance = bootstrap.Toast.getOrCreateInstance(newToastElement);
                toastInstance.show();

                newToastElement.addEventListener('hidden.bs.toast', () => {
                    newToastElement.remove();
                });
            }
        });
    }
}

if (document.body) {
    initToastSystem();
} else {
    document.addEventListener('DOMContentLoaded', initToastSystem);
}