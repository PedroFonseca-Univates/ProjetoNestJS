import React, { useState, useEffect } from 'react';

// Custom Hook para gerenciar usuários
const useUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const API_BASE_URL = 'http://localhost:3000';

  const loadUsers = async (activeFilter = '') => {
    setLoading(true);
    setError('');
    try {
      let url = `${API_BASE_URL}/users`;
      if (activeFilter) {
        url += `?active=${activeFilter}`;
      }
      
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error('Erro ao carregar usuários');
      }
      
      const data = await response.json();
      setUsers(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const createUser = async (userData) => {
    const response = await fetch(`${API_BASE_URL}/users`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Erro ao criar usuário');
    }

    return response.json();
  };

  const updateUser = async (id, userData) => {
    const response = await fetch(`${API_BASE_URL}/users/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Erro ao atualizar usuário');
    }

    return response.json();
  };

  const deleteUser = async (id) => {
    const response = await fetch(`${API_BASE_URL}/users/${id}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      throw new Error('Erro ao excluir usuário');
    }
  };

  const getUserById = async (id) => {
    const response = await fetch(`${API_BASE_URL}/users/${id}`);
    if (!response.ok) {
      throw new Error('Erro ao carregar usuário');
    }
    return response.json();
  };

  return {
    users,
    loading,
    error,
    loadUsers,
    createUser,
    updateUser,
    deleteUser,
    getUserById,
  };
};

// Componente de Alerta
const Alert = ({ message, type, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 5000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const alertStyles = {
    padding: '15px',
    borderRadius: '8px',
    marginBottom: '20px',
    borderLeft: '4px solid',
    backgroundColor: type === 'success' ? '#d4edda' : '#f8d7da',
    color: type === 'success' ? '#155724' : '#721c24',
    borderColor: type === 'success' ? '#28a745' : '#dc3545',
  };

  return (
    <div style={alertStyles}>
      {message}
      <button 
        onClick={onClose}
        style={{
          float: 'right',
          background: 'none',
          border: 'none',
          fontSize: '18px',
          cursor: 'pointer',
          color: 'inherit',
        }}
      >
        ×
      </button>
    </div>
  );
};

// Componente do Formulário
const UserForm = ({ editingUser, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    age: '',
    isActive: true,
  });

  useEffect(() => {
    if (editingUser) {
      setFormData({
        name: editingUser.name || '',
        email: editingUser.email || '',
        age: editingUser.age || '',
        isActive: editingUser.isActive,
      });
    } else {
      setFormData({
        name: '',
        email: '',
        age: '',
        isActive: true,
      });
    }
  }, [editingUser]);

  const handleSubmit = () => {
    const userData = {
      ...formData,
      age: formData.age ? parseInt(formData.age) : null,
    };
    onSubmit(userData);
  };

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? e.target.checked : value,
    }));
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div style={{
      background: '#f8f9ff',
      borderRadius: '15px',
      padding: '25px',
      marginBottom: '30px',
      border: '2px solid #e1e8ff',
    }}>
      <h2 style={{ color: '#333', marginBottom: '20px', fontSize: '1.5rem' }}>
        {editingUser ? '✏️ Editar Usuário' : '➕ Adicionar Novo Usuário'}
      </h2>
      
      <div onKeyPress={handleKeyPress}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '20px',
          marginBottom: '20px',
        }}>
          <div>
            <label style={{ display: 'block', marginBottom: '8px', color: '#555', fontWeight: '500' }}>
              Nome completo:
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              style={{
                width: '100%',
                padding: '12px 15px',
                border: '2px solid #e1e8ff',
                borderRadius: '8px',
                fontSize: '1rem',
              }}
            />
          </div>
          
          <div>
            <label style={{ display: 'block', marginBottom: '8px', color: '#555', fontWeight: '500' }}>
              E-mail:
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              style={{
                width: '100%',
                padding: '12px 15px',
                border: '2px solid #e1e8ff',
                borderRadius: '8px',
                fontSize: '1rem',
              }}
            />
          </div>
          
          <div>
            <label style={{ display: 'block', marginBottom: '8px', color: '#555', fontWeight: '500' }}>
              Idade:
            </label>
            <input
              type="number"
              name="age"
              value={formData.age}
              onChange={handleChange}
              min="1"
              max="120"
              style={{
                width: '100%',
                padding: '12px 15px',
                border: '2px solid #e1e8ff',
                borderRadius: '8px',
                fontSize: '1rem',
              }}
            />
          </div>
        </div>
        
        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', marginBottom: '8px', color: '#555', fontWeight: '500' }}>
            Status:
          </label>
          <select
            name="isActive"
            value={formData.isActive}
            onChange={(e) => setFormData(prev => ({ ...prev, isActive: e.target.value === 'true' }))}
            style={{
              width: '200px',
              padding: '12px 15px',
              border: '2px solid #e1e8ff',
              borderRadius: '8px',
              fontSize: '1rem',
            }}
          >
            <option value="true">Ativo</option>
            <option value="false">Inativo</option>
          </select>
        </div>
        
        <div>
          <button
            onClick={handleSubmit}
            style={{
              padding: '12px 25px',
              border: 'none',
              borderRadius: '8px',
              fontSize: '1rem',
              fontWeight: '500',
              cursor: 'pointer',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
              marginRight: '10px',
            }}
          >
            {editingUser ? '💾 Atualizar Usuário' : '✅ Salvar Usuário'}
          </button>
          
          {editingUser && (
            <button
              onClick={onCancel}
              style={{
                padding: '12px 25px',
                border: 'none',
                borderRadius: '8px',
                fontSize: '1rem',
                fontWeight: '500',
                cursor: 'pointer',
                background: '#6c757d',
                color: 'white',
              }}
            >
              ❌ Cancelar
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

// Componente da Tabela de Usuários
const UsersTable = ({ users, onEdit, onDelete, loading }) => {
  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '40px', color: '#667eea', fontSize: '1.1rem' }}>
        Carregando usuários...
      </div>
    );
  }

  if (users.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '40px', color: '#666' }}>
        <h3>📝 Nenhum usuário encontrado</h3>
        <p>Adicione o primeiro usuário usando o formulário acima.</p>
      </div>
    );
  }

  const handleDelete = (id) => {
    if (window.confirm('Tem certeza que deseja excluir este usuário?')) {
      onDelete(id);
    }
  };

  return (
    <div style={{
      background: 'white',
      borderRadius: '15px',
      overflow: 'hidden',
      boxShadow: '0 5px 15px rgba(0,0,0,0.1)',
    }}>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead style={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
        }}>
          <tr>
            <th style={{ padding: '15px', textAlign: 'left', fontWeight: '600' }}>ID</th>
            <th style={{ padding: '15px', textAlign: 'left', fontWeight: '600' }}>Nome</th>
            <th style={{ padding: '15px', textAlign: 'left', fontWeight: '600' }}>E-mail</th>
            <th style={{ padding: '15px', textAlign: 'left', fontWeight: '600' }}>Idade</th>
            <th style={{ padding: '15px', textAlign: 'left', fontWeight: '600' }}>Status</th>
            <th style={{ padding: '15px', textAlign: 'left', fontWeight: '600' }}>Criado em</th>
            <th style={{ padding: '15px', textAlign: 'left', fontWeight: '600' }}>Ações</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id} style={{ borderBottom: '1px solid #eee' }}>
              <td style={{ padding: '15px' }}>{user.id}</td>
              <td style={{ padding: '15px' }}>{user.name}</td>
              <td style={{ padding: '15px' }}>{user.email}</td>
              <td style={{ padding: '15px' }}>{user.age || '-'}</td>
              <td style={{ padding: '15px' }}>
                <span style={{
                  padding: '5px 12px',
                  borderRadius: '20px',
                  fontSize: '0.8rem',
                  fontWeight: '500',
                  background: user.isActive ? '#d4edda' : '#f8d7da',
                  color: user.isActive ? '#155724' : '#721c24',
                }}>
                  {user.isActive ? 'Ativo' : 'Inativo'}
                </span>
              </td>
              <td style={{ padding: '15px' }}>
                {new Date(user.createdAt).toLocaleDateString('pt-BR')}
              </td>
              <td style={{ padding: '15px' }}>
                <button
                  onClick={() => onEdit(user)}
                  style={{
                    background: '#28a745',
                    color: 'white',
                    border: 'none',
                    padding: '8px 12px',
                    borderRadius: '4px',
                    fontSize: '0.9rem',
                    cursor: 'pointer',
                    marginRight: '5px',
                  }}
                >
                  ✏️ Editar
                </button>
                <button
                  onClick={() => handleDelete(user.id)}
                  style={{
                    background: '#dc3545',
                    color: 'white',
                    border: 'none',
                    padding: '8px 12px',
                    borderRadius: '4px',
                    fontSize: '0.9rem',
                    cursor: 'pointer',
                  }}
                >
                  🗑️ Excluir
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

// Componente Principal
const App = () => {
  const [editingUser, setEditingUser] = useState(null);
  const [statusFilter, setStatusFilter] = useState('');
  const [alerts, setAlerts] = useState([]);
  
  const {
    users,
    loading,
    error,
    loadUsers,
    createUser,
    updateUser,
    deleteUser,
  } = useUsers();

  useEffect(() => {
    loadUsers(statusFilter);
  }, [statusFilter]);

  const showAlert = (message, type = 'success') => {
    const id = Date.now();
    setAlerts(prev => [...prev, { id, message, type }]);
  };

  const removeAlert = (id) => {
    setAlerts(prev => prev.filter(alert => alert.id !== id));
  };

  const handleSubmit = async (userData) => {
    try {
      if (editingUser) {
        await updateUser(editingUser.id, userData);
        showAlert('Usuário atualizado com sucesso!');
      } else {
        await createUser(userData);
        showAlert('Usuário criado com sucesso!');
      }
      setEditingUser(null);
      loadUsers(statusFilter);
    } catch (err) {
      showAlert(err.message, 'error');
    }
  };

  const handleEdit = (user) => {
    setEditingUser(user);
    // Scroll para o formulário
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    try {
      await deleteUser(id);
      showAlert('Usuário excluído com sucesso!');
      loadUsers(statusFilter);
    } catch (err) {
      showAlert(err.message, 'error');
    }
  };

  const handleCancel = () => {
    setEditingUser(null);
  };

  return (
    <div style={{
      fontFamily: 'Segoe UI, Tahoma, Geneva, Verdana, sans-serif',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      minHeight: '100vh',
      padding: '20px',
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        background: 'white',
        borderRadius: '20px',
        boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
        overflow: 'hidden',
      }}>
        {/* Header */}
        <div style={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          padding: '30px',
          textAlign: 'center',
        }}>
          <h1 style={{ fontSize: '2.5rem', marginBottom: '10px', margin: 0 }}>
            🚀 CRUD Usuários React
          </h1>
          <p style={{ fontSize: '1.1rem', opacity: 0.9, margin: 0 }}>
            Gerenciamento completo de usuários com React + NestJS
          </p>
        </div>

        {/* Content */}
        <div style={{ padding: '30px' }}>
          {/* Alertas */}
          {alerts.map(alert => (
            <Alert
              key={alert.id}
              message={alert.message}
              type={alert.type}
              onClose={() => removeAlert(alert.id)}
            />
          ))}

          {error && (
            <Alert
              message={`Erro: ${error}. Verifique se a API está rodando.`}
              type="error"
              onClose={() => {}}
            />
          )}

          {/* Formulário */}
          <UserForm
            editingUser={editingUser}
            onSubmit={handleSubmit}
            onCancel={handleCancel}
          />

          {/* Filtros e Título da Tabela */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '20px',
            flexWrap: 'wrap',
            gap: '10px',
          }}>
            <h2 style={{ color: '#333', fontSize: '1.5rem', margin: 0 }}>
              👥 Lista de Usuários
            </h2>
            <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                style={{
                  padding: '8px 12px',
                  border: '2px solid #e1e8ff',
                  borderRadius: '6px',
                  fontSize: '1rem',
                }}
              >
                <option value="">Todos os usuários</option>
                <option value="true">Apenas ativos</option>
                <option value="false">Apenas inativos</option>
              </select>
              <button
                onClick={() => loadUsers(statusFilter)}
                style={{
                  padding: '8px 15px',
                  border: 'none',
                  borderRadius: '6px',
                  background: '#6c757d',
                  color: 'white',
                  cursor: 'pointer',
                  fontSize: '1rem',
                }}
              >
                🔄 Atualizar
              </button>
            </div>
          </div>

          {/* Tabela */}
          <UsersTable
            users={users}
            onEdit={handleEdit}
            onDelete={handleDelete}
            loading={loading}
          />
        </div>
      </div>
    </div>
  );
};

export default App;
