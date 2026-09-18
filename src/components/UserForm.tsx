import { useState } from 'react';
import { Button } from './ui/Button';
import { Input } from './ui/Input';
import { Select } from './ui/Select';
import { createUser } from '../lib/api';

interface UserFormProps {
  onSaved: () => void;
  onCancel: () => void;
}

export function UserForm({ onSaved, onCancel }: UserFormProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('client');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSave() {
    if (!username || !password || !name) {
      alert('Mohon lengkapi semua field user!');
      return;
    }
    setLoading(true);
    try {
      await createUser([username, password, role, name]);
      alert('User baru berhasil ditambahkan!');
      onSaved();
    } catch {
      alert('Gagal menyimpan user!');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="animate-fade-in-up">
      <h3 className="text-base font-semibold" style={{ margin: '0 0 2px 0' }}>Buat Akun Baru</h3>
      <p className="text-sm text-muted mb-5">Tambahkan pengguna admin atau client baru.</p>

      <div className="grid gap-3.5 mb-5" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))' }}>
        <Input label="Username" type="text" value={username} onChange={(e) => setUsername(e.target.value)} />
        <Input label="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        <Select label="Role" value={role} onChange={(e) => setRole(e.target.value)}>
          <option value="client">Client</option>
          <option value="admin">Admin</option>
        </Select>
        <Input label="Nama Lengkap" type="text" value={name} onChange={(e) => setName(e.target.value)} />
      </div>

      <div className="flex gap-2 flex-wrap">
        <Button variant="success" size="auto" loading={loading} onClick={handleSave}>
          {loading ? 'Menyimpan...' : 'Simpan Akun'}
        </Button>
        <Button variant="secondary" size="auto" onClick={onCancel}>Batal</Button>
      </div>
    </div>
  );
}
