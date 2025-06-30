/**
 * Efata Prime Elevadores - API Integration
 * Arquivo para integração do frontend com o backend Django
 */

// Configuração base da API
const API_BASE_URL = 'https://api.efataprime.com.br/api';
// Para desenvolvimento local: const API_BASE_URL = 'http://localhost:8000/api';

// Classe para gerenciar autenticação
class AuthService {
    // Armazenar tokens no localStorage
    static setTokens(access, refresh) {
        localStorage.setItem('access_token', access);
        localStorage.setItem('refresh_token', refresh);
    }

    // Obter token de acesso
    static getAccessToken() {
        return localStorage.getItem('access_token');
    }

    // Obter token de refresh
    static getRefreshToken() {
        return localStorage.getItem('refresh_token');
    }

    // Remover tokens (logout)
    static clearTokens() {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
    }

    // Verificar se usuário está autenticado
    static isAuthenticated() {
        return !!this.getAccessToken();
    }

    // Login
    static async login(username, password) {
        try {
            const response = await fetch(`${API_BASE_URL}/token/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password }),
            });

            if (!response.ok) {
                throw new Error('Credenciais inválidas');
            }

            const data = await response.json();
            this.setTokens(data.access, data.refresh);
            return data;
        } catch (error) {
            console.error('Erro no login:', error);
            throw error;
        }
    }

    // Refresh token
    static async refreshToken() {
        const refresh = this.getRefreshToken();
        
        if (!refresh) {
            throw new Error('Refresh token não encontrado');
        }

        try {
            const response = await fetch(`${API_BASE_URL}/token/refresh/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ refresh }),
            });

            if (!response.ok) {
                this.clearTokens();
                throw new Error('Falha ao renovar token');
            }

            const data = await response.json();
            localStorage.setItem('access_token', data.access);
            return data;
        } catch (error) {
            this.clearTokens();
            console.error('Erro ao renovar token:', error);
            throw error;
        }
    }

    // Logout
    static logout() {
        this.clearTokens();
        window.location.href = '/pages/login.html';
    }

    // Obter informações do usuário atual
    static async getCurrentUser() {
        try {
            const response = await ApiService.get('/me/');
            return response;
        } catch (error) {
            console.error('Erro ao obter usuário atual:', error);
            throw error;
        }
    }
}

// Classe para fazer requisições à API
class ApiService {
    // Método para adicionar token de autenticação aos headers
    static getAuthHeaders() {
        const token = AuthService.getAccessToken();
        return {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
        };
    }

    // Método para lidar com respostas da API
    static async handleResponse(response) {
        if (response.status === 401) {
            // Token expirado, tentar refresh
            try {
                await AuthService.refreshToken();
                // Recriar headers com novo token
                const originalRequest = response.request;
                originalRequest.headers = this.getAuthHeaders();
                return fetch(originalRequest);
            } catch (error) {
                // Falha no refresh, fazer logout
                AuthService.logout();
                throw new Error('Sessão expirada. Por favor, faça login novamente.');
            }
        }

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.detail || 'Erro na requisição');
        }

        return response.json();
    }

    // GET request
    static async get(endpoint, params = {}) {
        const url = new URL(`${API_BASE_URL}${endpoint}`);
        
        // Adicionar parâmetros à URL
        Object.keys(params).forEach(key => {
            if (params[key] !== undefined && params[key] !== null) {
                url.searchParams.append(key, params[key]);
            }
        });

        try {
            const response = await fetch(url, {
                method: 'GET',
                headers: this.getAuthHeaders(),
            });

            return this.handleResponse(response);
        } catch (error) {
            console.error(`Erro na requisição GET para ${endpoint}:`, error);
            throw error;
        }
    }

    // POST request
    static async post(endpoint, data = {}) {
        try {
            const response = await fetch(`${API_BASE_URL}${endpoint}`, {
                method: 'POST',
                headers: this.getAuthHeaders(),
                body: JSON.stringify(data),
            });

            return this.handleResponse(response);
        } catch (error) {
            console.error(`Erro na requisição POST para ${endpoint}:`, error);
            throw error;
        }
    }

    // PUT request
    static async put(endpoint, data = {}) {
        try {
            const response = await fetch(`${API_BASE_URL}${endpoint}`, {
                method: 'PUT',
                headers: this.getAuthHeaders(),
                body: JSON.stringify(data),
            });

            return this.handleResponse(response);
        } catch (error) {
            console.error(`Erro na requisição PUT para ${endpoint}:`, error);
            throw error;
        }
    }

    // PATCH request
    static async patch(endpoint, data = {}) {
        try {
            const response = await fetch(`${API_BASE_URL}${endpoint}`, {
                method: 'PATCH',
                headers: this.getAuthHeaders(),
                body: JSON.stringify(data),
            });

            return this.handleResponse(response);
        } catch (error) {
            console.error(`Erro na requisição PATCH para ${endpoint}:`, error);
            throw error;
        }
    }

    // DELETE request
    static async delete(endpoint) {
        try {
            const response = await fetch(`${API_BASE_URL}${endpoint}`, {
                method: 'DELETE',
                headers: this.getAuthHeaders(),
            });

            return this.handleResponse(response);
        } catch (error) {
            console.error(`Erro na requisição DELETE para ${endpoint}:`, error);
            throw error;
        }
    }

    // Upload de arquivos
    static async uploadFile(endpoint, formData) {
        try {
            const token = AuthService.getAccessToken();
            const headers = {
                'Authorization': `Bearer ${token}`,
                // Não incluir Content-Type para que o navegador defina o boundary correto para multipart/form-data
            };

            const response = await fetch(`${API_BASE_URL}${endpoint}`, {
                method: 'POST',
                headers: headers,
                body: formData,
            });

            return this.handleResponse(response);
        } catch (error) {
            console.error(`Erro no upload para ${endpoint}:`, error);
            throw error;
        }
    }
}

// Serviços específicos para cada entidade
class ClienteService {
    static async listar(params = {}) {
        return ApiService.get('/clientes/', params);
    }

    static async obter(id) {
        return ApiService.get(`/clientes/${id}/`);
    }

    static async criar(cliente) {
        return ApiService.post('/clientes/', cliente);
    }

    static async atualizar(id, cliente) {
        return ApiService.put(`/clientes/${id}/`, cliente);
    }

    static async excluir(id) {
        return ApiService.delete(`/clientes/${id}/`);
    }
}

class ElevadorService {
    static async listar(params = {}) {
        return ApiService.get('/elevadores/', params);
    }

    static async obter(id) {
        return ApiService.get(`/elevadores/${id}/`);
    }

    static async criar(elevador) {
        return ApiService.post('/elevadores/', elevador);
    }

    static async atualizar(id, elevador) {
        return ApiService.put(`/elevadores/${id}/`, elevador);
    }

    static async excluir(id) {
        return ApiService.delete(`/elevadores/${id}/`);
    }

    static async listarPorCliente(clienteId) {
        return ApiService.get('/elevadores/', { cliente: clienteId });
    }
}

class VistoriaService {
    static async listar(params = {}) {
        return ApiService.get('/vistorias/', params);
    }

    static async obter(id) {
        return ApiService.get(`/vistorias/${id}/`);
    }

    static async criar(vistoria) {
        return ApiService.post('/vistorias/', vistoria);
    }

    static async atualizar(id, vistoria) {
        return ApiService.put(`/vistorias/${id}/`, vistoria);
    }

    static async excluir(id) {
        return ApiService.delete(`/vistorias/${id}/`);
    }

    static async uploadFotos(vistoriaId, fotos, descricao = '') {
        const formData = new FormData();
        
        // Adicionar múltiplas fotos
        for (let i = 0; i < fotos.length; i++) {
            formData.append('fotos', fotos[i]);
        }
        
        formData.append('descricao', descricao);
        
        return ApiService.uploadFile(`/upload-foto-vistoria/${vistoriaId}/`, formData);
    }

    static async listarFotos(vistoriaId) {
        return ApiService.get('/fotos-vistorias/', { vistoria: vistoriaId });
    }

    static async gerarRelatorio(params = {}) {
        return ApiService.get('/relatorio-vistorias/', params);
    }
}

class OrdemServicoService {
    static async listar(params = {}) {
        return ApiService.get('/ordens-servico/', params);
    }

    static async obter(id) {
        return ApiService.get(`/ordens-servico/${id}/`);
    }

    static async criar(ordemServico) {
        return ApiService.post('/ordens-servico/', ordemServico);
    }

    static async atualizar(id, ordemServico) {
        return ApiService.put(`/ordens-servico/${id}/`, ordemServico);
    }

    static async excluir(id) {
        return ApiService.delete(`/ordens-servico/${id}/`);
    }

    static async uploadFotos(ordemServicoId, fotos, descricao = '', antesServico = true) {
        const formData = new FormData();
        
        // Adicionar múltiplas fotos
        for (let i = 0; i < fotos.length; i++) {
            formData.append('fotos', fotos[i]);
        }
        
        formData.append('descricao', descricao);
        formData.append('antes_servico', antesServico);
        
        return ApiService.uploadFile(`/upload-foto-ordem-servico/${ordemServicoId}/`, formData);
    }

    static async listarFotos(ordemServicoId) {
        return ApiService.get('/fotos-ordens-servico/', { ordem_servico: ordemServicoId });
    }

    static async gerarRelatorio(params = {}) {
        return ApiService.get('/relatorio-ordens-servico/', params);
    }
}

class PecaService {
    static async listar(params = {}) {
        return ApiService.get('/pecas/', params);
    }

    static async obter(id) {
        return ApiService.get(`/pecas/${id}/`);
    }

    static async criar(peca) {
        return ApiService.post('/pecas/', peca);
    }

    static async atualizar(id, peca) {
        return ApiService.put(`/pecas/${id}/`, peca);
    }

    static async excluir(id) {
        return ApiService.delete(`/pecas/${id}/`);
    }

    static async adicionarPecaOrdemServico(ordemServicoId, pecaId, quantidade, precoUnitario, observacao = '') {
        const data = {
            ordem_servico: ordemServicoId,
            peca: pecaId,
            quantidade: quantidade,
            preco_unitario: precoUnitario,
            observacao: observacao
        };
        
        return ApiService.post('/pecas-utilizadas/', data);
    }

    static async listarPecasUtilizadas(ordemServicoId) {
        return ApiService.get('/pecas-utilizadas/', { ordem_servico: ordemServicoId });
    }
}

class ConfiguracaoService {
    static async obter() {
        return ApiService.get('/configuracoes/1/');
    }

    static async atualizar(configuracao) {
        return ApiService.put('/configuracoes/1/', configuracao);
    }
}

class DashboardService {
    static async obterDados() {
        return ApiService.get('/dashboard/');
    }
}

// Exportar todos os serviços
window.AuthService = AuthService;
window.ApiService = ApiService;
window.ClienteService = ClienteService;
window.ElevadorService = ElevadorService;
window.VistoriaService = VistoriaService;
window.OrdemServicoService = OrdemServicoService;
window.PecaService = PecaService;
window.ConfiguracaoService = ConfiguracaoService;
window.DashboardService = DashboardService;
