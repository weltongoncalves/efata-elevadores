/**
 * Efata Prime Elevadores - Dashboard Integration
 * Arquivo para integração do dashboard com o backend Django
 */

document.addEventListener('DOMContentLoaded', function() {
    // Verificar se usuário está autenticado
    if (!AuthService.isAuthenticated()) {
        // Redirecionar para login se não estiver autenticado
        window.location.href = '../pages/login.html';
        return;
    }

    // Carregar dados do usuário
    loadUserData();
    
    // Carregar dados do dashboard
    loadDashboardData();
    
    // Configurar eventos de logout
    setupLogoutEvents();
    
    // Configurar menu mobile
    setupMobileMenu();
    
    // Carregar notificações
    loadNotifications();
});

// Função para carregar dados do usuário
async function loadUserData() {
    try {
        // Tentar obter dados do localStorage primeiro (para carregamento rápido)
        const cachedUserData = localStorage.getItem('user_data');
        if (cachedUserData) {
            updateUserInterface(JSON.parse(cachedUserData));
        }
        
        // Atualizar com dados frescos do servidor
        const userData = await AuthService.getCurrentUser();
        localStorage.setItem('user_data', JSON.stringify(userData));
        updateUserInterface(userData);
    } catch (error) {
        console.error('Erro ao carregar dados do usuário:', error);
        // Se houver erro na obtenção dos dados, fazer logout
        if (error.message.includes('Sessão expirada')) {
            AuthService.logout();
        }
    }
}

// Função para atualizar interface com dados do usuário
function updateUserInterface(userData) {
    // Atualizar nome do usuário em todos os lugares
    const userNameElements = document.querySelectorAll('.user-name, .user-name-display');
    userNameElements.forEach(element => {
        element.textContent = userData.first_name ? `${userData.first_name} ${userData.last_name}` : userData.username;
    });
    
    // Atualizar cargo/tipo do usuário
    const userRoleElements = document.querySelectorAll('.user-role');
    userRoleElements.forEach(element => {
        element.textContent = getTipoUsuarioFormatado(userData.tipo);
    });
    
    // Atualizar avatar se disponível
    if (userData.foto) {
        const avatarElements = document.querySelectorAll('.user-avatar img');
        avatarElements.forEach(element => {
            element.src = userData.foto;
        });
    }
    
    // Ajustar permissões baseado no tipo de usuário
    adjustPermissions(userData.tipo);
}

// Função para formatar o tipo de usuário
function getTipoUsuarioFormatado(tipo) {
    const tipos = {
        'admin': 'Administrador',
        'tecnico': 'Técnico',
        'cliente': 'Cliente',
        'atendimento': 'Atendimento'
    };
    
    return tipos[tipo] || tipo;
}

// Função para ajustar permissões baseado no tipo de usuário
function adjustPermissions(tipo) {
    // Exemplo: esconder certas opções de menu para não-administradores
    if (tipo !== 'admin') {
        const adminOnlyElements = document.querySelectorAll('.admin-only');
        adminOnlyElements.forEach(element => {
            element.style.display = 'none';
        });
    }
    
    // Exemplo: mostrar apenas elementos específicos para técnicos
    if (tipo === 'tecnico') {
        const tecnicoElements = document.querySelectorAll('.tecnico-only');
        tecnicoElements.forEach(element => {
            element.style.display = 'block';
        });
    }
}

// Função para carregar dados do dashboard
async function loadDashboardData() {
    try {
        // Verificar se estamos na página do dashboard
        const dashboardStats = document.querySelector('.dashboard-stats');
        if (!dashboardStats) return;
        
        // Mostrar indicador de carregamento
        dashboardStats.innerHTML = '<div class="loading-indicator"><i class="fas fa-spinner fa-spin"></i> Carregando dados...</div>';
        
        // Obter dados do dashboard
        const dashboardData = await DashboardService.obterDados();
        
        // Atualizar estatísticas
        updateDashboardStats(dashboardData);
        
        // Atualizar gráficos
        updateDashboardCharts(dashboardData);
        
        // Atualizar listas recentes
        updateRecentLists(dashboardData);
    } catch (error) {
        console.error('Erro ao carregar dados do dashboard:', error);
        const dashboardStats = document.querySelector('.dashboard-stats');
        if (dashboardStats) {
            dashboardStats.innerHTML = '<div class="error-message"><i class="fas fa-exclamation-triangle"></i> Erro ao carregar dados. Tente novamente mais tarde.</div>';
        }
    }
}

// Função para atualizar estatísticas do dashboard
function updateDashboardStats(data) {
    const dashboardStats = document.querySelector('.dashboard-stats');
    if (!dashboardStats) return;
    
    dashboardStats.innerHTML = `
        <div class="stat-card">
            <div class="stat-icon bg-primary">
                <i class="fas fa-users"></i>
            </div>
            <div class="stat-content">
                <h3>${data.total_clientes}</h3>
                <p>Clientes</p>
            </div>
        </div>
        <div class="stat-card">
            <div class="stat-icon bg-success">
                <i class="fas fa-building"></i>
            </div>
            <div class="stat-content">
                <h3>${data.total_elevadores}</h3>
                <p>Elevadores</p>
            </div>
        </div>
        <div class="stat-card">
            <div class="stat-icon bg-warning">
                <i class="fas fa-clipboard-check"></i>
            </div>
            <div class="stat-content">
                <h3>${data.vistorias_pendentes}</h3>
                <p>Vistorias Pendentes</p>
            </div>
        </div>
        <div class="stat-card">
            <div class="stat-icon bg-danger">
                <i class="fas fa-tools"></i>
            </div>
            <div class="stat-content">
                <h3>${data.ordens_servico_abertas + data.ordens_servico_em_andamento}</h3>
                <p>Ordens de Serviço Ativas</p>
            </div>
        </div>
    `;
}

// Função para atualizar gráficos do dashboard
function updateDashboardCharts(data) {
    // Verificar se estamos na página do dashboard e se o elemento de gráficos existe
    const chartContainer = document.getElementById('dashboardCharts');
    if (!chartContainer) return;
    
    // Limpar conteúdo anterior
    chartContainer.innerHTML = '';
    
    // Criar elementos para os gráficos
    const ordensServicoChartElement = document.createElement('div');
    ordensServicoChartElement.className = 'chart-container';
    ordensServicoChartElement.innerHTML = '<canvas id="ordensServicoChart"></canvas>';
    
    const vistoriasChartElement = document.createElement('div');
    vistoriasChartElement.className = 'chart-container';
    vistoriasChartElement.innerHTML = '<canvas id="vistoriasChart"></canvas>';
    
    // Adicionar elementos ao container
    chartContainer.appendChild(ordensServicoChartElement);
    chartContainer.appendChild(vistoriasChartElement);
    
    // Criar gráfico de ordens de serviço
    const ordensServicoCtx = document.getElementById('ordensServicoChart').getContext('2d');
    new Chart(ordensServicoCtx, {
        type: 'pie',
        data: {
            labels: ['Abertas', 'Em Andamento', 'Aguardando Peça', 'Concluídas'],
            datasets: [{
                data: [
                    data.ordens_servico_abertas,
                    data.ordens_servico_em_andamento,
                    data.ordens_servico_aguardando_peca,
                    data.total_ordens_servico - data.ordens_servico_abertas - data.ordens_servico_em_andamento - data.ordens_servico_aguardando_peca
                ],
                backgroundColor: [
                    '#dc3545',
                    '#ffc107',
                    '#17a2b8',
                    '#28a745'
                ]
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            title: {
                display: true,
                text: 'Ordens de Serviço por Status'
            }
        }
    });
    
    // Criar gráfico de vistorias
    const vistoriasCtx = document.getElementById('vistoriasChart').getContext('2d');
    new Chart(vistoriasCtx, {
        type: 'pie',
        data: {
            labels: ['Pendentes', 'Concluídas'],
            datasets: [{
                data: [
                    data.vistorias_pendentes,
                    data.total_vistorias - data.vistorias_pendentes
                ],
                backgroundColor: [
                    '#ffc107',
                    '#28a745'
                ]
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            title: {
                display: true,
                text: 'Vistorias por Status'
            }
        }
    });
}

// Função para atualizar listas recentes
function updateRecentLists(data) {
    // Atualizar lista de vistorias recentes
    updateVistoriasRecentes(data.vistorias_recentes);
    
    // Atualizar lista de ordens de serviço recentes
    updateOrdensServicoRecentes(data.ordens_servico_recentes);
}

// Função para atualizar lista de vistorias recentes
function updateVistoriasRecentes(vistorias) {
    const vistoriasRecentesElement = document.getElementById('vistoriasRecentes');
    if (!vistoriasRecentesElement) return;
    
    if (vistorias.length === 0) {
        vistoriasRecentesElement.innerHTML = '<p class="empty-list">Nenhuma vistoria encontrada.</p>';
        return;
    }
    
    let html = '<div class="table-responsive"><table class="data-table"><thead><tr>';
    html += '<th>ID</th><th>Elevador</th><th>Cliente</th><th>Data</th><th>Status</th><th>Ações</th>';
    html += '</tr></thead><tbody>';
    
    vistorias.forEach(vistoria => {
        const dataFormatada = new Date(vistoria.data_agendada).toLocaleDateString('pt-BR');
        const statusClass = getStatusClass(vistoria.status);
        const statusText = getStatusText(vistoria.status);
        
        html += `<tr>
            <td>${vistoria.id}</td>
            <td>${vistoria.elevador_identificacao}</td>
            <td>${vistoria.cliente_nome}</td>
            <td>${dataFormatada}</td>
            <td><span class="status-badge ${statusClass}">${statusText}</span></td>
            <td class="actions">
                <a href="vistorias.html?id=${vistoria.id}" class="btn-icon" title="Ver Detalhes">
                    <i class="fas fa-eye"></i>
                </a>
            </td>
        </tr>`;
    });
    
    html += '</tbody></table></div>';
    vistoriasRecentesElement.innerHTML = html;
}

// Função para atualizar lista de ordens de serviço recentes
function updateOrdensServicoRecentes(ordensServico) {
    const ordensServicoRecentesElement = document.getElementById('ordensServicoRecentes');
    if (!ordensServicoRecentesElement) return;
    
    if (ordensServico.length === 0) {
        ordensServicoRecentesElement.innerHTML = '<p class="empty-list">Nenhuma ordem de serviço encontrada.</p>';
        return;
    }
    
    let html = '<div class="table-responsive"><table class="data-table"><thead><tr>';
    html += '<th>Número</th><th>Cliente</th><th>Elevador</th><th>Data</th><th>Status</th><th>Ações</th>';
    html += '</tr></thead><tbody>';
    
    ordensServico.forEach(os => {
        const dataFormatada = new Date(os.data_abertura).toLocaleDateString('pt-BR');
        const statusClass = getStatusClass(os.status);
        const statusText = getStatusText(os.status);
        
        html += `<tr>
            <td>${os.numero}</td>
            <td>${os.cliente_nome}</td>
            <td>${os.elevador_identificacao}</td>
            <td>${dataFormatada}</td>
            <td><span class="status-badge ${statusClass}">${statusText}</span></td>
            <td class="actions">
                <a href="ordens-servico.html?id=${os.id}" class="btn-icon" title="Ver Detalhes">
                    <i class="fas fa-eye"></i>
                </a>
            </td>
        </tr>`;
    });
    
    html += '</tbody></table></div>';
    ordensServicoRecentesElement.innerHTML = html;
}

// Função para obter classe CSS baseada no status
function getStatusClass(status) {
    const statusClasses = {
        'agendada': 'pending',
        'em_andamento': 'in-progress',
        'concluida': 'completed',
        'cancelada': 'cancelled',
        'aberta': 'pending',
        'aguardando_peca': 'waiting'
    };
    
    return statusClasses[status] || 'default';
}

// Função para obter texto formatado baseado no status
function getStatusText(status) {
    const statusTexts = {
        'agendada': 'Agendada',
        'em_andamento': 'Em Andamento',
        'concluida': 'Concluída',
        'cancelada': 'Cancelada',
        'aberta': 'Aberta',
        'aguardando_peca': 'Aguardando Peça'
    };
    
    return statusTexts[status] || status;
}

// Função para configurar eventos de logout
function setupLogoutEvents() {
    const logoutButtons = document.querySelectorAll('#logoutBtn, #logoutBtnDropdown');
    logoutButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            AuthService.logout();
        });
    });
}

// Função para configurar menu mobile
function setupMobileMenu() {
    const sidebarToggle = document.querySelector('.sidebar-toggle');
    const sidebar = document.querySelector('.sidebar');
    
    if (sidebarToggle && sidebar) {
        sidebarToggle.addEventListener('click', function() {
            sidebar.classList.toggle('expanded');
        });
        
        // Fechar sidebar ao clicar fora em dispositivos móveis
        document.addEventListener('click', function(e) {
            if (window.innerWidth <= 768 && 
                sidebar.classList.contains('expanded') && 
                !sidebar.contains(e.target) && 
                e.target !== sidebarToggle) {
                sidebar.classList.remove('expanded');
            }
        });
    }
}

// Função para carregar notificações
async function loadNotifications() {
    // Esta função seria implementada para buscar notificações do backend
    // Por enquanto, apenas simular com dados estáticos
    
    const notificationDropdown = document.querySelector('.notification-dropdown');
    if (!notificationDropdown) return;
    
    // Aqui seria feita uma chamada à API para obter notificações
    // Por enquanto, usar dados estáticos
    const notifications = [
        {
            id: 1,
            title: 'Nova vistoria agendada',
            time: 'Há 30 minutos',
            icon: 'clipboard-check',
            iconClass: 'bg-primary',
            read: false
        },
        {
            id: 2,
            title: 'Ordem de serviço #123 atualizada',
            time: 'Há 2 horas',
            icon: 'tools',
            iconClass: 'bg-warning',
            read: false
        },
        {
            id: 3,
            title: 'Novo cliente cadastrado',
            time: 'Há 1 dia',
            icon: 'user',
            iconClass: 'bg-success',
            read: false
        }
    ];
    
    // Atualizar contador de notificações
    const unreadCount = notifications.filter(n => !n.read).length;
    const notificationBadge = document.querySelector('.notification-btn .badge');
    if (notificationBadge) {
        notificationBadge.textContent = unreadCount;
        notificationBadge.style.display = unreadCount > 0 ? 'block' : 'none';
    }
}
