// Toast Notification System
class Toast {
    constructor() {
        this.createContainer();
    }

    createContainer() {
        if (!document.querySelector('.toast-container')) {
            const container = document.createElement('div');
            container.className = 'toast-container';
            document.body.appendChild(container);
        }
    }

    show(message, type = 'info', duration = 3000) {
        const container = document.querySelector('.toast-container');
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        
        let icon;
        switch(type) {
            case 'success':
                icon = 'fas fa-check-circle';
                break;
            case 'error':
                icon = 'fas fa-times-circle';
                break;
            case 'warning':
                icon = 'fas fa-exclamation-circle';
                break;
            default:
                icon = 'fas fa-info-circle';
        }

        toast.innerHTML = `
            <i class="${icon}"></i>
            <span class="toast-message">${message}</span>
            <button class="toast-close">&times;</button>
        `;

        container.appendChild(toast);

        // Handle close button click
        const closeBtn = toast.querySelector('.toast-close');
        closeBtn.addEventListener('click', () => this.close(toast));

        // Auto close after duration
        setTimeout(() => this.close(toast), duration);
    }

    close(toast) {
        toast.style.animation = 'slideOut 0.3s ease-out forwards';
        setTimeout(() => toast.remove(), 300);
    }

    success(message, duration) {
        this.show(message, 'success', duration);
    }

    error(message, duration) {
        this.show(message, 'error', duration);
    }

    warning(message, duration) {
        this.show(message, 'warning', duration);
    }

    info(message, duration) {
        this.show(message, 'info', duration);
    }
}

// Create global toast instance
const toast = new Toast();