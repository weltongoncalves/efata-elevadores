/**
 * Efata Prime Elevadores - Login Integration
 * Arquivo para integração do login com o backend Django
 */

document.addEventListener('DOMContentLoaded', function() {
    // Verificar se usuário já está autenticado
    if (AuthService.isAuthenticated()) {
        // Redirecionar para dashboard se já estiver logado
        window.location.href = '../dashboard/index.html';
        return;
    }

    // Referências aos elementos do formulário
    const loginForm = document.getElementById('loginForm');
    const usernameInput = document.getElementById('username');
    const passwordInput = document.getElementById('password');
    const loginButton = document.getElementById('loginButton');
    const errorMessage = document.getElementById('errorMessage');
    const forgotPasswordLink = document.getElementById('forgotPasswordLink');

    // Adicionar evento de submit ao formulário
    if (loginForm) {
        loginForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            // Validar campos
            if (!usernameInput.value || !passwordInput.value) {
                showError('Por favor, preencha todos os campos.');
                return;
            }
            
            // Desabilitar botão durante o login
            loginButton.disabled = true;
            loginButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Entrando...';
            
            try {
                // Tentar fazer login
                await AuthService.login(usernameInput.value, passwordInput.value);
                
                // Obter informações do usuário
                const userData = await AuthService.getCurrentUser();
                
                // Armazenar dados do usuário no localStorage para uso no dashboard
                localStorage.setItem('user_data', JSON.stringify(userData));
                
                // Redirecionar para o dashboard
                window.location.href = '../dashboard/index.html';
            } catch (error) {
                // Mostrar mensagem de erro
                showError('Usuário ou senha inválidos. Por favor, tente novamente.');
                
                // Resetar senha
                passwordInput.value = '';
                
                // Habilitar botão novamente
                loginButton.disabled = false;
                loginButton.innerHTML = 'Entrar';
            }
        });
    }

    // Função para mostrar mensagem de erro
    function showError(message) {
        if (errorMessage) {
            errorMessage.textContent = message;
            errorMessage.style.display = 'block';
            
            // Esconder mensagem após 5 segundos
            setTimeout(() => {
                errorMessage.style.display = 'none';
            }, 5000);
        }
    }

    // Adicionar evento ao link de esqueci minha senha
    if (forgotPasswordLink) {
        forgotPasswordLink.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Verificar se o campo de usuário está preenchido
            if (!usernameInput.value) {
                showError('Por favor, informe seu nome de usuário para recuperar a senha.');
                return;
            }
            
            // Aqui seria implementada a lógica de recuperação de senha
            // Por enquanto, apenas mostrar uma mensagem
            alert(`Um email de recuperação de senha será enviado para o usuário ${usernameInput.value} se ele estiver cadastrado no sistema.`);
        });
    }
});
