export interface LoginRequest {
  email: string;
  password: string;
}

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
}

export interface LoginResponse {
  user: User;
}

import { env } from "@/app/config/env";


export async function login(request: LoginRequest): Promise<LoginResponse> {
  const response = await fetch(`${env.apiBaseUrl}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(request),
  });

  const payload = await response.json();

  if (!response.ok || !payload.success) {
    throw new Error(payload.message ?? "Login failed");
  }

  return {
    user: payload.data.user,
  };
}

export async function getSessionUser(): Promise<User | null> {
  const response = await fetch(`${env.apiBaseUrl}/auth/me`, {
    method: "GET",
    credentials: "include",
  });

  if (response.status === 401) {
    return null;
  }

  const payload = await response.json();

  if (!response.ok || !payload.success) {
    throw new Error(payload.message ?? "Unable to validate session");
  }

  return payload.data.user;
}

export async function logoutSession(): Promise<void> {
  const response = await fetch(`${env.apiBaseUrl}/auth/logout`, {
    method: "POST",
    credentials: "include",
  });

  if (!response.ok && response.status !== 401) {
    throw new Error("Unable to logout");
  }
}
