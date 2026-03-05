const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

export const apiRequest = async (path, options = {}) => {
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {})
  };

  let response;
  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      ...options,
      headers,
    });
  } catch (_error) {
    throw new Error('Cannot connect to server. Please start backend on port 5000 and try again.');
  }

  const contentType = response.headers.get('content-type') || '';
  const data = contentType.includes('application/json')
    ? await response.json()
    : await response.text();

  if (!response.ok) {
    const message =
      typeof data === 'object' && data?.message
        ? data.message
        : 'Request failed';
    throw new Error(message);
  }

  return data;
};

export const healthApi = {
  getStatus: () => apiRequest('/health')
};

export const usersApi = {
  getAll: (token) =>
    apiRequest('/users', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }),
  create: (payload, token) =>
    apiRequest('/users', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(payload)
    }),
  update: (id, payload, token) =>
    apiRequest(`/users/${id}`, {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(payload)
    }),
  remove: (id, token) =>
    apiRequest(`/users/${id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
};

export const authApi = {
  register: (payload) =>
    apiRequest('/auth/register', {
      method: 'POST',
      body: JSON.stringify(payload)
    }),
  login: (payload) =>
    apiRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify(payload)
    }),
  me: (token) =>
    apiRequest('/auth/me', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
};

export const inventoryApi = {
  getItems: (token) =>
    apiRequest('/inventory/items', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }),
  createItem: (payload, token) =>
    apiRequest('/inventory/items', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(payload)
    }),
  updateItem: (id, payload, token) =>
    apiRequest(`/inventory/items/${id}`, {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(payload)
    }),
  removeItem: (id, token) =>
    apiRequest(`/inventory/items/${id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`
      }
    }),
  getStockTransactions: (token, limit = 8) =>
    apiRequest(`/inventory/stock-transactions?limit=${limit}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
};

export const resourceApi = {
  getAll: (resourceKey, token) =>
    apiRequest(`/resources/${resourceKey}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }),
  create: (resourceKey, payload, token) =>
    apiRequest(`/resources/${resourceKey}`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(payload)
    }),
  update: (resourceKey, id, payload, token) =>
    apiRequest(`/resources/${resourceKey}/${id}`, {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(payload)
    }),
  remove: (resourceKey, id, token) =>
    apiRequest(`/resources/${resourceKey}/${id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
};

export const salesApi = {
  checkout: (payload, token) =>
    apiRequest('/sales/checkout', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(payload)
    })
};

export const purchasesApi = {
  record: (payload, token) =>
    apiRequest('/purchases/record', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(payload)
    })
};

export const customersApi = {
  getAll: (token) =>
    apiRequest('/customers', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }),
  create: (payload, token) =>
    apiRequest('/customers', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(payload)
    }),
  update: (id, payload, token) =>
    apiRequest(`/customers/${id}`, {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(payload)
    }),
  remove: (id, token) =>
    apiRequest(`/customers/${id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
};

export const inventoryAdjustmentsApi = {
  getAll: (token) =>
    apiRequest('/inventory-adjustments', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }),
  create: (payload, token) =>
    apiRequest('/inventory-adjustments', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(payload)
    }),
  update: (id, payload, token) =>
    apiRequest(`/inventory-adjustments/${id}`, {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(payload)
    }),
  remove: (id, token) =>
    apiRequest(`/inventory-adjustments/${id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
};

export const packagesApi = {
  getAll: (token) =>
    apiRequest('/packages', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }),
  create: (payload, token) =>
    apiRequest('/packages', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(payload)
    }),
  update: (id, payload, token) =>
    apiRequest(`/packages/${id}`, {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(payload)
    }),
  remove: (id, token) =>
    apiRequest(`/packages/${id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
};

export const shipmentsApi = {
  getAll: (token) =>
    apiRequest('/shipments', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }),
  create: (payload, token) =>
    apiRequest('/shipments', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(payload)
    }),
  update: (id, payload, token) =>
    apiRequest(`/shipments/${id}`, {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(payload)
    }),
  remove: (id, token) =>
    apiRequest(`/shipments/${id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
};

export const reportsApi = {
  getSummary: (token) =>
    apiRequest('/reports/summary', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
};
