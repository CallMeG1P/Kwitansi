function terbilangAngkaDasar(angka: number): string {
  const bil = ['', 'Satu', 'Dua', 'Tiga', 'Empat', 'Lima', 'Enam', 'Tujuh', 'Delapan', 'Sembilan', 'Sepuluh', 'Sebelas'];
  angka = Math.floor(angka);

  if (angka === 0) return '';
  if (angka < 12) return ' ' + bil[angka];
  if (angka < 20) return terbilangAngkaDasar(angka - 10) + ' Belas';
  if (angka < 100) return terbilangAngkaDasar(Math.floor(angka / 10)) + ' Puluh' + terbilangAngkaDasar(angka % 10);
  if (angka < 200) return ' Seratus' + terbilangAngkaDasar(angka - 100);
  if (angka < 1000) return terbilangAngkaDasar(Math.floor(angka / 100)) + ' Ratus' + terbilangAngkaDasar(angka % 100);
  if (angka < 2000) return ' Seribu' + terbilangAngkaDasar(angka - 1000);
  if (angka < 1000000) return terbilangAngkaDasar(Math.floor(angka / 1000)) + ' Ribu' + terbilangAngkaDasar(angka % 1000);
  if (angka < 1000000000) return terbilangAngkaDasar(Math.floor(angka / 1000000)) + ' Juta' + terbilangAngkaDasar(angka % 1000000);
  if (angka < 1000000000000) return terbilangAngkaDasar(Math.floor(angka / 1000000000)) + ' Milyar' + terbilangAngkaDasar(angka % 1000000000);
  if (angka < 1000000000000000) return terbilangAngkaDasar(Math.floor(angka / 1000000000000)) + ' Triliun' + terbilangAngkaDasar(angka % 1000000000000);

  return '';
}

export function konversiTerbilangLengkap(nilai: number): string {
  if (!nilai || nilai === 0) return 'Nol Rupiah.';

  const bagianUtama = Math.floor(Math.abs(nilai));
  const bagianDesimal = Math.round((Math.abs(nilai) - bagianUtama) * 100);

  let hasil = terbilangAngkaDasar(bagianUtama).trim() + ' Rupiah';

  if (bagianDesimal > 0) {
    hasil += ' ' + terbilangAngkaDasar(bagianDesimal).trim() + ' Perak';
  } else {
    hasil += '.';
  }

  return hasil.replace(/\s+/g, ' ').trim();
}

export function formatRupiah(val: number): string {
  return 'Rp' + new Intl.NumberFormat('id-ID', { minimumFractionDigits: 0, maximumFractionDigits: 2 }).format(val || 0);
}

export function formatTanggal(iso: string): string {
  if (!iso) return '-';
  try {
    const d = new Date(iso);
    return d.toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' });
  } catch {
    return iso;
  }
}
