const BASE_URL = "https://dummyjson.com";

async function fetchJson<T>(url: string): Promise<T> {
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Request failed: ${response.status}`);
  }

  return response.json() as Promise<T>;
}

export type DummyUser = {
  id: number;
  firstName: string;
  lastName: string;
  maidenName?: string;
  email: string;
  phone: string;
  company?: {
    name: string;
    department: string;
    title: string;
  };
  address?: {
    city: string;
    state: string;
    country: string;
  };
};

export type DummyUsersResponse = {
  users: DummyUser[];
  total: number;
  skip: number;
  limit: number;
};

export type DummyPost = {
  id: number;
  title: string;
  body: string;
  tags: string[];
  views: number;
  reactions?: {
    likes: number;
    dislikes: number;
  };
};

export type DummyPostsResponse = {
  posts: DummyPost[];
  total: number;
  skip: number;
  limit: number;
};

export type DummyTodo = {
  id: number;
  todo: string;
  completed: boolean;
  userId: number;
};

export type DummyTodosResponse = {
  todos: DummyTodo[];
  total: number;
  skip: number;
  limit: number;
};

export type DummyProduct = {
  id: number;
  title: string;
  price: number;
  brand?: string;
  category: string;
  stock: number;
  rating: number;
};

export type DummyProductsResponse = {
  products: DummyProduct[];
  total: number;
  skip: number;
  limit: number;
};

export function getUsers(limit = 12) {
  return fetchJson<DummyUsersResponse>(`${BASE_URL}/users?limit=${limit}`);
}

export function getPosts(limit = 8) {
  return fetchJson<DummyPostsResponse>(`${BASE_URL}/posts?limit=${limit}`);
}

export function getTodos(limit = 10) {
  return fetchJson<DummyTodosResponse>(`${BASE_URL}/todos?limit=${limit}`);
}

export function getProducts(limit = 8) {
  return fetchJson<DummyProductsResponse>(`${BASE_URL}/products?limit=${limit}`);
}