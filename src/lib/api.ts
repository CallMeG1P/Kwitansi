import type { User, KwitansiData, KwitansiType } from './types';

// MASUKKAN URL WEB APP GOOGLE APPS SCRIPT ANDA DI SINI
const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbz9GG3gBZ4VMl-e2Hu1_Qv3UtREHo_DA6vSNfeqBpv2RDfMTVq-NjoJUmWT4LGvK2Az.exec';

async function apiGet<T>(action: string): Promise<T> {
  const res = await fetch(`${SCRIPT_URL}?action=${action}`);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}

async function apiPost(body: unknown): Promise<void> {
  await fetch(SCRIPT_URL, {
    method: 'POST',
    body: JSON.stringify(body),
  });
}

export async function getUsers(): Promise<User[]> {
  return apiGet<User[]>('getUsers');
}

export async function getKwitansi(type: KwitansiType): Promise<KwitansiData[]> {
  const action = type === 'lebur' ? 'getKwitansiLebur' : 'getKwitansiTakLebur';
  return apiGet<KwitansiData[]>(action);
}

export async function createKwitansi(type: KwitansiType, row: (string | number)[]): Promise<void> {
  const sheet = type === 'lebur' ? 'KwitansiLebur' : 'KwitansiTakLebur';
  await apiPost({ action: 'create', sheet, row });
}

export async function deleteKwitansi(id: string, type: KwitansiType): Promise<void> {
  const sheet = type === 'lebur' ? 'KwitansiLebur' : 'KwitansiTakLebur';
  await apiPost({ action: 'delete', sheet, id });
}

export async function createUser(row: (string)[]): Promise<void> {
  await apiPost({ action: 'create', sheet: 'Users', row });
}
