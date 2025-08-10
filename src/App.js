import { useState, useEffect } from "react";

// This component implements a simple login flow followed by a
// Quran screening dashboard. After logging in, instructors can
// enter a student's name and class, record scores for Makharijul
// Huruf, Tajwid and Kelancaran, then automatically compute a
// classification based on the entered scores. All assessments are
// saved locally in a history table so instructors can review
// previous evaluations.

export default function App() {
  // Login state
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Student information
  const [studentName, setStudentName] = useState("");
  const [className, setClassName] = useState("");

  // Scores for each screening category
  const [scores, setScores] = useState({
    makhraj: "",
    tajwid: "",
    kelancaran: "",
  });

  // Computed classification result
  const [classification, setClassification] = useState("");

  // Local history of previous assessments
  const [history, setHistory] = useState([]);

  // Currently selected test for displaying reading material. Can be
  // "makhraj", "tajwid" or "kelancaran" or null when no test is selected.
  const [selectedTest, setSelectedTest] = useState(null);

  // Reading materials for each test. These short surah excerpts can be
  // replaced with any verses you prefer to use during assessment. They
  // provide text for students to read so teachers can evaluate their
  // pronunciation, tajwid and fluency.
  const readingMaterials = {
    makhraj: `Bacaan untuk tes Makharijul Huruf:\n\n` +
      `بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ\n` +
      `الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ\n` +
      `الرَّحْمَٰنِ الرَّحِيمِ\n` +
      `مَالِكِ يَوْمِ الدِّينِ\n` +
      `إِيَّاكَ نَعْبُدُ وَإِيَّاكَ نَسْتَعِينُ\n` +
      `اهْدِنَا الصِّرَاطَ الْمُسْتَقِيمَ\n` +
      `صِرَاطَ الَّذِينَ أَنْعَمْتَ عَلَيْهِمْ غَيْرِ الْمَغْضُوبِ عَلَيْهِمْ وَلَا الضَّالِّينَ`,
    tajwid: `Bacaan untuk tes Tajwid:\n\n` +
      `قُلْ هُوَ اللَّهُ أَحَدٌ\n` +
      `اللَّهُ الصَّمَدُ\n` +
      `لَمْ يَلِدْ وَلَمْ يُولَدْ\n` +
      `وَلَمْ يَكُنْ لَهُ كُفُوًا أَحَدٌ`,
    kelancaran: `Bacaan untuk tes Kelancaran:\n\n` +
      `قُلْ أَعُوذُ بِرَبِّ النَّاسِ\n` +
      `مَلِكِ النَّاسِ\n` +
      `إِلَٰهِ النَّاسِ\n` +
      `مِنْ شَرِّ الْوَسْوَاسِ الْخَنَّاسِ\n` +
      `الَّذِي يُوَسْوِسُ فِي صُدُورِ النَّاسِ\n` +
      `مِنَ الْجِنَّةِ وَالنَّاسِ`,
  };

  // Shared reading text fetched from the Quran API. All tests use the same
  // source (a surah) so that students read the same passage regardless of
  // which assessment is selected. The text is loaded once when the
  // component mounts. If the API call fails, a fallback message will be
  // displayed instead.
  const [readingText, setReadingText] = useState("");

  useEffect(() => {
    async function fetchSurah() {
      try {
        // Fetch Surah Al-Fatihah (surah number 1) from AlQuran Cloud API
        const response = await fetch("https://api.alquran.cloud/v1/surah/1");
        const json = await response.json();
        if (json.data && json.data.ayahs) {
          // Join ayahs with newlines for readability
          const text = json.data.ayahs.map((a) => a.text).join("\n");
          setReadingText(text);
        } else {
          setReadingText(
            "Bacaan tidak tersedia. Periksa kembali koneksi atau API."
          );
        }
      } catch (err) {
        setReadingText(
          "Gagal memuat bacaan dari API. Pastikan Anda terhubung internet."
        );
      }
    }
    fetchSurah();
  }, []);

  // Simple login handler; for a production app this would
  // authenticate against a backend. Here we just check that
  // both fields are filled in.
  const handleLogin = () => {
    if (email && password) {
      setIsLoggedIn(true);
    }
  };

  // Update individual score fields without overwriting the entire object
  const handleScoreChange = (field, value) => {
    setScores((prev) => ({ ...prev, [field]: value }));
  };

  // Compute the classification based on average score and save to history
  const calculateClassification = () => {
    const m = parseFloat(scores.makhraj) || 0;
    const t = parseFloat(scores.tajwid) || 0;
    const k = parseFloat(scores.kelancaran) || 0;
    const average = (m + t + k) / 3;
    let result = "";
    // Classify according to typical Islamic education terminology
    if (average >= 90) {
      result = "Mumtaz (Istimewa)";
    } else if (average >= 75) {
      result = "Jayyid Jiddan (Sangat Baik)";
    } else if (average >= 60) {
      result = "Jayyid (Baik)";
    } else {
      result = "Maqul (Perlu Bimbingan)";
    }
    setClassification(result);
    // Save the record to history with current date
    const today = new Date();
    const dateString = today.toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" });
    setHistory((prev) => [
      ...prev,
      {
        date: dateString,
        name: studentName,
        className,
        scores: { ...scores },
        classification: result,
      },
    ]);
    // Reset form fields
    setStudentName("");
    setClassName("");
    setScores({ makhraj: "", tajwid: "", kelancaran: "" });
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      {!isLoggedIn ? (
        // Login form
        <div className="bg-white p-6 rounded shadow-md w-full max-w-md space-y-4">
          <h1 className="text-2xl font-bold text-center text-green-700">
            Login Aplikasi Tes Al&nbsp;Qur'an
          </h1>
          <input
            type="email"
            placeholder="Masukkan email"
            className="w-full p-2 border border-gray-300 rounded"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Masukkan password"
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
        // Dashboard after login
        <div className="w-full max-w-4xl space-y-6">
          <h2 className="text-2xl font-semibold text-green-800 text-center">
            Dashboard Tes Al‑Qur'an
          </h2>
          {/* Form input data siswa dan nilai tes */}
          <div className="bg-white p-4 rounded shadow space-y-4">
            <h3 className="text-lg font-semibold">Data Siswa</h3>
            <input
              type="text"
              placeholder="Nama Siswa"
              className="w-full p-2 border border-gray-300 rounded"
              value={studentName}
              onChange={(e) => setStudentName(e.target.value)}
            />
            <input
              type="text"
              placeholder="Kelas"
              className="w-full p-2 border border-gray-300 rounded"
              value={className}
              onChange={(e) => setClassName(e.target.value)}
            />
            {/* Test selection allows instructors to present reading material for each assessment type. */}
            <h3 className="text-lg font-semibold">Pilih Tes</h3>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                className={`px-4 py-2 rounded ${
                  selectedTest === "makhraj"
                    ? "bg-green-600 text-white"
                    : "bg-gray-200 text-gray-800"
                }`}
                onClick={() => setSelectedTest("makhraj")}
              >
                Makharijul Huruf
              </button>
              <button
                type="button"
                className={`px-4 py-2 rounded ${
                  selectedTest === "tajwid"
                    ? "bg-green-600 text-white"
                    : "bg-gray-200 text-gray-800"
                }`}
                onClick={() => setSelectedTest("tajwid")}
              >
                Tajwid
              </button>
              <button
                type="button"
                className={`px-4 py-2 rounded ${
                  selectedTest === "kelancaran"
                    ? "bg-green-600 text-white"
                    : "bg-gray-200 text-gray-800"
                }`}
                onClick={() => setSelectedTest("kelancaran")}
              >
                Kelancaran
              </button>
            </div>
            {selectedTest && (
              <div className="mt-3 p-3 border border-gray-300 rounded bg-gray-50 whitespace-pre-line">
                {readingText || "Memuat bacaan..."}
              </div>
            )}

            <h3 className="text-lg font-semibold mt-4">Nilai Tes</h3>
            {/* Grid for three test inputs */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block font-medium">Makharijul Huruf</label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  className="w-full p-2 border border-gray-300 rounded"
                  value={scores.makhraj}
                  onChange={(e) => handleScoreChange("makhraj", e.target.value)}
                />
              </div>
              <div>
                <label className="block font-medium">Tajwid</label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  className="w-full p-2 border border-gray-300 rounded"
                  value={scores.tajwid}
                  onChange={(e) => handleScoreChange("tajwid", e.target.value)}
                />
              </div>
              <div>
                <label className="block font-medium">Kelancaran</label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  className="w-full p-2 border border-gray-300 rounded"
                  value={scores.kelancaran}
                  onChange={(e) => handleScoreChange("kelancaran", e.target.value)}
                />
              </div>
            </div>
            <button
              className="mt-4 w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
              onClick={calculateClassification}
            >
              Simpan &amp; Hitung Klasifikasi
            </button>
            {classification && (
              <div className="mt-4">
                <p className="font-semibold">Klasifikasi: {classification}</p>
              </div>
            )}
          </div>
          {/* History table */}
          <div className="bg-white p-4 rounded shadow overflow-x-auto">
            <h3 className="text-lg font-semibold">Riwayat Penilaian</h3>
            {history.length === 0 ? (
              <p className="text-gray-500">Belum ada penilaian.</p>
            ) : (
              <table className="w-full mt-2 border">
                <thead>
                  <tr className="bg-gray-200 text-sm">
                    <th className="px-2 py-1 border">Tanggal</th>
                    <th className="px-2 py-1 border">Nama</th>
                    <th className="px-2 py-1 border">Kelas</th>
                    <th className="px-2 py-1 border">Makharijul Huruf</th>
                    <th className="px-2 py-1 border">Tajwid</th>
                    <th className="px-2 py-1 border">Kelancaran</th>
                    <th className="px-2 py-1 border">Klasifikasi</th>
                  </tr>
                </thead>
                <tbody>
                  {history.map((item, index) => (
                    <tr key={index} className="text-center text-sm">
                      <td className="border px-2 py-1">{item.date}</td>
                      <td className="border px-2 py-1">{item.name}</td>
                      <td className="border px-2 py-1">{item.className}</td>
                      <td className="border px-2 py-1">{item.scores.makhraj}</td>
                      <td className="border px-2 py-1">{item.scores.tajwid}</td>
                      <td className="border px-2 py-1">{item.scores.kelancaran}</td>
                      <td className="border px-2 py-1">{item.classification}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
