/**
 * Efata Prime Elevadores - Script Principal
 * Versão: 2.0
 * Data: Maio 2025
 */

// Esperar pelo carregamento completo do DOM
document.addEventListener('DOMContentLoaded', function() {
    console.log('Efata Prime Elevadores - Site carregado');
    
    // Inicializar componentes
    initMobileMenu();
    initSmoothScroll();
    initFormValidation();
    initAnimations();
    initWhatsAppTracking();
});

/**
 * Inicializa o menu mobile
 */
function initMobileMenu() {
    const menuToggle = document.querySelector('.menu-toggle');
    const navMenu = document.querySelector('.nav-menu');
    
    if (!menuToggle || !navMenu) return;
    
    menuToggle.addEventListener('click', function() {
        navMenu.classList.toggle('active');
        menuToggle.classList.toggle('active');
        
        // Alternar ícone do menu
        const icon = menuToggle.querySelector('i');
        if (icon) {
            if (navMenu.classList.contains('active')) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-times');
            } else {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        }
    });
    
    // Fechar menu ao clicar em um link
    const navLinks = navMenu.querySelectorAll('a');
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            navMenu.classList.remove('active');
            menuToggle.classList.remove('active');
            
            const icon = menuToggle.querySelector('i');
            if (icon) {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        });
    });
    
    // Fechar menu ao redimensionar a janela para desktop
    window.addEventListener('resize', function() {
        if (window.innerWidth > 768 && navMenu.classList.contains('active')) {
            navMenu.classList.remove('active');
            menuToggle.classList.remove('active');
            
            const icon = menuToggle.querySelector('i');
            if (icon) {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        }
    });
}

/**
 * Inicializa o scroll suave para links internos
 */
function initSmoothScroll() {
    const scrollLinks = document.querySelectorAll('a[href^="#"]');
    
    scrollLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            // Ignorar se o link é apenas "#"
            if (this.getAttribute('href') === '#') return;
            
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                // Calcular a posição considerando o header fixo
                const headerHeight = document.querySelector('.header').offsetHeight;
                const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

/**
 * Inicializa a validação de formulários
 */
function initFormValidation() {
    const contactForm = document.getElementById('contactForm');
    
    if (!contactForm) return;
    
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Validar campos
        let isValid = true;
        const requiredFields = contactForm.querySelectorAll('[required]');
        
        requiredFields.forEach(field => {
            if (!field.value.trim()) {
                isValid = false;
                showError(field, 'Este campo é obrigatório');
            } else {
                removeError(field);
                
                // Validação específica para email
                if (field.type === 'email' && !isValidEmail(field.value)) {
                    isValid = false;
                    showError(field, 'Por favor, insira um email válido');
                }
                
                // Validação específica para telefone
                if (field.id === 'telefone' && !isValidPhone(field.value)) {
                    isValid = false;
                    showError(field, 'Por favor, insira um telefone válido');
                }
            }
        });
        
        if (isValid) {
            // Simulação de envio bem-sucedido
            showNotification('Mensagem enviada com sucesso! Entraremos em contato em breve.', 'success');
            contactForm.reset();
        }
    });
    
    // Validar em tempo real
    const inputs = contactForm.querySelectorAll('input, textarea');
    inputs.forEach(input => {
        input.addEventListener('blur', function() {
            if (this.hasAttribute('required') && !this.value.trim()) {
                showError(this, 'Este campo é obrigatório');
            } else {
                removeError(this);
                
                // Validação específica para email
                if (this.type === 'email' && this.value.trim() && !isValidEmail(this.value)) {
                    showError(this, 'Por favor, insira um email válido');
                }
                
                // Validação específica para telefone
                if (this.id === 'telefone' && this.value.trim() && !isValidPhone(this.value)) {
                    showError(this, 'Por favor, insira um telefone válido');
                }
            }
        });
    });
}

/**
 * Verifica se um email é válido
 */
function isValidEmail(email) {
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email.toLowerCase());
}

/**
 * Verifica se um telefone é válido
 */
function isValidPhone(phone) {
    // Aceita formatos: (11) 99999-9999 ou 11999999999
    const re = /^(?:\(?([0-9]{2})\)?\s?)?(?:9[0-9]{1}|[0-9]{1})[0-9]{3}-?[0-9]{4}$/;
    return re.test(phone);
}

/**
 * Mostra erro de validação
 */
function showError(field, message) {
    // Remover erro existente
    removeError(field);
    
    // Adicionar classe de erro
    field.classList.add('is-invalid');
    
    // Criar mensagem de erro
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.textContent = message;
    
    // Inserir após o campo
    field.parentNode.insertBefore(errorDiv, field.nextSibling);
}

/**
 * Remove erro de validação
 */
function removeError(field) {
    field.classList.remove('is-invalid');
    
    const errorMessage = field.parentNode.querySelector('.error-message');
    if (errorMessage) {
        errorMessage.remove();
    }
}

/**
 * Mostra notificação
 */
function showNotification(message, type = 'info') {
    // Verificar se já existe uma notificação
    let notification = document.querySelector('.notification');
    
    if (!notification) {
        // Criar nova notificação
        notification = document.createElement('div');
        notification.className = 'notification';
        document.body.appendChild(notification);
    }
    
    // Definir tipo e mensagem
    notification.className = `notification ${type}`;
    notification.textContent = message;
    
    // Mostrar notificação
    notification.classList.add('show');
    
    // Remover após 5 segundos
    setTimeout(() => {
        notification.classList.remove('show');
        
        // Remover do DOM após a animação
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 5000);
}

/**
 * Inicializa animações de scroll
 */
function initAnimations() {
    // Animar elementos quando entrarem na viewport
    const animatedElements = document.querySelectorAll('.service-card, .feature-card, .section-title');
    
    // Função para verificar se elemento está visível
    function isElementInViewport(el) {
        const rect = el.getBoundingClientRect();
        return (
            rect.top <= (window.innerHeight || document.documentElement.clientHeight) * 0.8
        );
    }
    
    // Função para animar elementos visíveis
    function animateElements() {
        animatedElements.forEach(element => {
            if (isElementInViewport(element) && !element.classList.contains('animated')) {
                element.classList.add('animated');
            }
        });
    }
    
    // Verificar elementos ao carregar a página
    animateElements();
    
    // Verificar elementos ao rolar a página
    window.addEventListener('scroll', animateElements);
}

/**
 * Inicializa rastreamento de cliques no WhatsApp
 */
function initWhatsAppTracking() {
    const whatsappButton = document.querySelector('.whatsapp-float');
    
    if (!whatsappButton) return;
    
    whatsappButton.addEventListener('click', function() {
        // Aqui você pode adicionar código para rastrear cliques
        // Por exemplo, usando Google Analytics
        console.log('WhatsApp button clicked');
        
        // Exemplo de como seria com Google Analytics
        if (typeof gtag === 'function') {
            gtag('event', 'click', {
                'event_category': 'Contact',
                'event_label': 'WhatsApp Button'
            });
        }
    });
}

/**
 * Função para simular login (para demonstração)
 */
function simulateLogin(email, password) {
    // Esta é apenas uma simulação para demonstração
    // Em um ambiente real, isso seria feito com uma API backend
    
    if (email === 'admin@efataprime.com.br' && password === 'admin123') {
        return {
            success: true,
            user: {
                name: 'Administrador',
                email: 'admin@efataprime.com.br',
                role: 'admin'
            }
        };
    } else if (email === 'tecnico@efataprime.com.br' && password === 'tecnico123') {
        return {
            success: true,
            user: {
                name: 'Técnico',
                email: 'tecnico@efataprime.com.br',
                role: 'tecnico'
            }
        };
    } else if (email === 'cliente@exemplo.com.br' && password === 'cliente123') {
        return {
            success: true,
            user: {
                name: 'Cliente',
                email: 'cliente@exemplo.com.br',
                role: 'cliente'
            }
        };
    } else {
        return {
            success: false,
            message: 'Email ou senha incorretos'
        };
    }
}
