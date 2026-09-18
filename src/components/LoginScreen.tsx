import { useState } from 'react';
import { Button } from './ui/Button';
import { Input } from './ui/Input';
import { getUsers } from '../lib/api';
import type { User } from '../lib/types';

interface LoginScreenProps {
  onLogin: (user: User) => void;
}

export function LoginScreen({ onLogin }: LoginScreenProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    if (!username || !password) {
      setError('Masukkan username dan password!');
      return;
    }
    setError('');
    setLoading(true);
    try {
      const users = await getUsers();
      const user = users.find(
        (x) => String(x.username).trim() === username.trim() && String(x.password).trim() === password.trim()
      );
      if (user) {
        onLogin(user);
      } else {
        setError('Username atau Password salah!');
      }
    } catch {
      setError('Gagal terhubung ke server. Pastikan URL Web App sudah dikonfigurasi dengan benar.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-[400px] animate-scale-in">
        <div className="surface-elevated p-8 sm:p-10">
          <div className="flex items-center gap-3 mb-8">
            <div
              className="flex items-center justify-center font-bold text-lg flex-shrink-0"
              style={{
                width: 42,
                height: 42,
                borderRadius: 12,
                background: 'var(--accent)',
                color: 'var(--accent-contrast)',
              }}
            >
              K
            </div>
            <div>
              <h2 className="text-xl font-bold tracking-tight" style={{ margin: 0 }}>Sistem Kwitansi</h2>
              <p className="text-sm text-muted" style={{ margin: 0 }}>Masuk untuk melanjutkan</p>
            </div>
          </div>

          <form onSubmit={handleLogin} className="flex flex-col gap-4">
            <Input
              label="Username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Masukkan username"
              autoComplete="username"
            />
            <Input
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Masukkan password"
              autoComplete="current-password"
            />

            {error && (
              <div
                className="text-sm px-3 py-2 rounded-lg animate-fade-in"
                style={{ color: 'var(--danger)', background: 'color-mix(in srgb, var(--danger) 8%, transparent)' }}
              >
                {error}
              </div>
            )}

            <Button type="submit" loading={loading} size="full">
              {loading ? 'Memproses...' : 'Login'}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
