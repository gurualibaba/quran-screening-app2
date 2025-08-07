import { useState } from "react";

export default function App() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleLogin = () => {
    if (email && password) setIsLoggedIn(true);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      {!isLoggedIn ? (
        <div className="bg-white p-6 rounded shadow-md w-full max-w-md space-y-4">
          <h1 className="text-2xl font-bold text-center text-green-700">
            Login Aplikasi Quran
          </h1>
          <input
            type="email"
            placeholder="Email"
            className="w-full p-2 border border-gray-300 rounded"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full p-2 border border-gray-300 rounded"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button
            className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700"
            onClick={handleLogin}
          >
            Masuk
          </button>
        </div>
      ) : (
        <div className="w-full max-w-2xl space-y-4">
          <h2 className="text-xl font-semibold text-green-800">Dashboard Siswa</h2>
          <div className="bg-white p-4 rounded shadow">
            <p className="text-lg font-semibold">📘 Pilih Surat</p>
            <select className="w-full border mt-2 p-2 rounded">
              <option>An-Nas</option>
              <option>Al-Falaq</option>
              <option>Al-Ikhlas</option>
            </select>
            <button className="mt-4 w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">
              🎙️ Rekam Bacaan
            </button>
          </div>
          <div className="bg-white p-4 rounded shadow">
            <p className="text-lg font-semibold">📜 Riwayat Penilaian</p>
            <div className="mt-2 space-y-2">
              <div className="border p-2 rounded bg-white shadow">
                <p className="font-bold">Surat An-Nas</p>
                <p className="text-sm text-gray-600">7 Agustus 2025 - Skor: 92 (Mumtaz)</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
