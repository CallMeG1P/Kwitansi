import type { KwitansiType } from './types';

export interface CalcResult {
  totalPenjualan: number;
  totalKeuntungan: number;
  jumlah30: number;
  terbilang: string;
}

export interface LeburInput {
  modal: number;
  hargaBeli1Gr: number;
  totalSetelahLebur: number;
  totalPenjualan: number;
}

export interface TakLeburInput {
  modal: number;
  hargaBeliGram: number;
  hargaJualGram: number;
}

export function hitungLebur(inp: LeburInput): CalcResult {
  let totalPenjualan = inp.totalPenjualan;
  let totalKeuntungan = 0;

  if (totalPenjualan > 0 && inp.hargaBeli1Gr > 0) {
    const hargaBeliEst = inp.totalSetelahLebur * inp.hargaBeli1Gr;
    totalKeuntungan = totalPenjualan - hargaBeliEst;
  }

  const jumlah30 = totalKeuntungan * 0.30;
  return {
    totalPenjualan,
    totalKeuntungan,
    jumlah30,
    terbilang: '',
  };
}

export function hitungTakLebur(inp: TakLeburInput): CalcResult {
  let totalPenjualan = 0;
  let totalKeuntungan = 0;

  if (inp.modal > 0 && inp.hargaBeliGram > 0 && inp.hargaJualGram > 0) {
    const totalPembelianGr = inp.modal / inp.hargaBeliGram;
    totalPenjualan = totalPembelianGr * inp.hargaJualGram;
    totalKeuntungan = totalPenjualan - inp.modal;
  }

  const jumlah30 = totalKeuntungan * 0.30;
  return {
    totalPenjualan,
    totalKeuntungan,
    jumlah30,
    terbilang: '',
  };
}

export function calcJumlah30(totalKeuntungan: number): number {
  return totalKeuntungan * 0.30;
}
