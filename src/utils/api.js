const API_BASE = '/api';

async function apiCall(endpoint, options = {}) {
  const url = `${API_BASE}${endpoint}`;
  
  const defaultOptions = {
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  };

  const config = {
    ...defaultOptions,
    ...options,
    headers: {
      ...defaultOptions.headers,
      ...options.headers,
    },
  };

  try {
    const response = await fetch(url, config);
    
    const contentType = response.headers.get('content-type');
    console.log("🔷 [API] Response content-type:", contentType);
    console.log("🔷 [API] Response status:", response.status);
    console.log("🔷 [API] Response ok:", response.ok);
    
    if (!contentType || !contentType.includes('application/json')) {
      console.log("🔷 [API] Non-JSON response, reading as text");
      const text = await response.text();
      console.log("🔷 [API] Response text:", text);
      return { ok: response.ok, status: response.status, data: text, error: text };
    }

    const data = await response.json();
    console.log("🔷 [API] Parsed JSON data:", data);
    
    if (!response.ok) {
      return {
        ok: false,
        status: response.status,
        error: data.message || data || 'An error occurred',
        data: data,
      };
    }

    return {
      ok: true,
      status: response.status,
      data,
      error: null,
    };
  } catch (error) {
    console.error('API Network error:', error);
    return {
      ok: false,
      status: 0,
      error: error.message || 'Network error',
      data: null,
    };
  }
}

export const authAPI = {
  signup: async (userData) => {
    return apiCall('/signup', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  },
  signin: async (credentials) => {
    return apiCall('/signin', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  },
};

export const userAPI = {
  getUserDetails: async () => {
    return apiCall('/getUserDetails');
  },
  changeUserGroups: async (params) => {
    return apiCall('/changeUserGroups', {
      method: 'GET',
    });
  },
  userGroupList: async () => {
    return apiCall('/userGroupList');
  },
};

export const groupAPI = {
  getGroupList: async () => {
    return apiCall('/getGroupList');
  },
  getMembers: async (params) => {
    const queryParams = new URLSearchParams(params).toString();
    return apiCall(`/getMembers?${queryParams}`);
  },
  addGroupData: async (params) => {
    console.log("🔷 [API] addGroupData called with params:", params);
    const queryParams = new URLSearchParams(params).toString();
    console.log("🔷 [API] Query string:", queryParams);
    console.log("🔷 [API] Full URL will be: /api/addGroupData?" + queryParams);
    const result = await apiCall(`/addGroupData?${queryParams}`);
    console.log("🔷 [API] addGroupData response:", result);
    return result;
  },
};

export const aiAPI = {
  chatWithInterviewer: async (text) => {
    const queryParams = new URLSearchParams({ text }).toString();
    return apiCall(`/chatWithInterviewer?${queryParams}`);
  },
  finishInterview: async () => {
    return apiCall('/finishInterview');
  },
  addInterviewAnswer: async (question) => {
    const queryParams = new URLSearchParams({ question }).toString();
    return apiCall(`/addInterviewAnswer?${queryParams}`);
  },
};

export const inviteAPI = {
  getInvites: async () => {
    return apiCall('/getInvites');
  },
  makeInvite: async (params) => {
    return apiCall('/makeInvite', {
      method: 'GET',
    });
  },
  acceptInvite: async (params) => {
    return apiCall('/acceptInvite', {
      method: 'GET',
    });
  },
};

export default apiCall;

