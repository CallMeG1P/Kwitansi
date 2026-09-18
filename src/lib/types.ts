export type ThemeName = 'onyx' | 'graphite' | 'stone' | 'slate';

export type UserRole = 'admin' | 'client';

export interface User {
  id?: string;
  username: string;
  password: string;
  role: UserRole;
  name: string;
}

export type KwitansiType = 'lebur' | 'tak_lebur';

export interface KwitansiData {
  id: string;
  no: string;
  tanggal: string;
  tanggal_putaran: string;
  terima_dari: string;
  jumlah: number;
  terbilang: string;
  modal: number;
  // Lebur fields
  harga_beli_gr?: number;
  total_sebelum_lebur?: number;
  total_setelah_lebur?: number;
  kadar?: string;
  harga_beli?: number;
  // Tak Lebur fields
  harga_beli_gram?: number;
  total_pembelian_gr?: number;
  total_pembelian?: number;
  harga_jual_gram?: number;
  // Shared
  total_penjualan: number;
  total_keuntungan: number;
  total_keuntungan_30: number;
}
