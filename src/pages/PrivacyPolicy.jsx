import { useState } from 'react';

export default function PrivacyPolicy() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    reason: ''
  });

  const phoneNumber = '081108110811';

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Create WhatsApp message
    const message = `
*Permintaan Hapus Akun - Garansi Plus*

Nama: ${formData.name}
Email: ${formData.email}
No. HP: ${formData.phone}
Alasan: ${formData.reason}
    `.trim();

    // Redirect to WhatsApp
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
    
    // Reset form
    setFormData({
      name: '',
      email: '',
      phone: '',
      reason: ''
    });
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="min-h-screen bg-black">
      {/* Header */}
      <header className="bg-black border-b border-gray-800 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-white flex items-center gap-2">
            <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2L3 7V11C3 16.55 6.84 21.74 12 23C17.16 21.74 21 16.55 21 11V7L12 2Z" stroke="#C9F35B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
            </svg>
            GARANSI<span className="text-[#C9F35B]">+</span>
          </h1>
          <nav className="mt-3 flex gap-6">
            <a href="#privacy" className="text-gray-400 hover:text-[#C9F35B] transition">
              Kebijakan Privasi
            </a>
            <a href="#delete" className="text-gray-400 hover:text-[#C9F35B] transition">
              Hapus Akun
            </a>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-12">
        {/* Privacy Policy Section */}
        <section id="privacy" className="bg-white rounded-2xl shadow-2xl p-8 mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Kebijakan Privasi</h2>
          <p className="text-gray-600 mb-6">
            Kebijakan Privasi ini menjelaskan bagaimana Garansi Plus mengumpulkan, menggunakan, 
            menyimpan, dan melindungi data pribadi pengguna.
          </p>

          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">1. Informasi yang Kami Kumpulkan</h3>
              <ul className="list-disc list-inside text-gray-600 space-y-2 ml-4">
                <li><strong>Data Akun:</strong> Nama, email, dan informasi saat mendaftar.</li>
                <li><strong>Data Penggunaan:</strong> Aktivitas dalam aplikasi.</li>
                <li><strong>Data Perangkat:</strong> Jenis perangkat, sistem operasi, ID unik.</li>
              </ul>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">2. Cara Kami Menggunakan Data</h3>
              <ul className="list-disc list-inside text-gray-600 space-y-2 ml-4">
                <li>Menyediakan dan meningkatkan layanan aplikasi.</li>
                <li>Personalisasi pengalaman pengguna.</li>
                <li>Menghubungi pengguna untuk dukungan atau info penting.</li>
                <li>Menjaga keamanan aplikasi.</li>
              </ul>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">3. Penyimpanan & Keamanan Data</h3>
              <p className="text-gray-600">
                Kami menyimpan data di server yang aman dengan enkripsi, namun tidak ada metode 
                internet yang 100% aman.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">4. Berbagi Informasi</h3>
              <ul className="list-disc list-inside text-gray-600 space-y-2 ml-4">
                <li>Kami tidak menjual data pribadi Anda.</li>
                <li>Data dapat dibagikan ke mitra tepercaya untuk layanan.</li>
                <li>Data dapat diungkap sesuai kewajiban hukum.</li>
              </ul>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">5. Hak Pengguna</h3>
              <ul className="list-disc list-inside text-gray-600 space-y-2 ml-4">
                <li>Akses data pribadi Anda.</li>
                <li>Memperbarui data yang salah.</li>
                <li>Meminta penghapusan akun.</li>
              </ul>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">6. Hapus Akun</h3>
              <p className="text-gray-600">
                Anda dapat menghapus akun melalui menu{' '}
                <a href="#delete" className="text-[#C9F35B] hover:underline font-medium">
                  Hapus Akun
                </a>
                . Data akan dihapus permanen dan tidak bisa dipulihkan.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">7. Perubahan Kebijakan</h3>
              <p className="text-gray-600">
                Kami dapat memperbarui kebijakan ini sewaktu-waktu. Perubahan diumumkan di aplikasi 
                atau halaman ini.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">8. Kontak Kami</h3>
              <p className="text-gray-600">
                Jika ada pertanyaan, hubungi kami via WhatsApp di{' '}
                <a 
                  href={`https://wa.me/${phoneNumber}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#C9F35B] hover:underline font-medium"
                >
                  {phoneNumber}
                </a>
                .
              </p>
            </div>
          </div>
        </section>

        {/* Delete Account Section */}
        <section id="delete" className="bg-white rounded-2xl shadow-2xl p-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Hapus Akun</h2>
          <p className="text-gray-600 mb-6">
            Isi formulir berikut untuk meminta penghapusan akun Anda. Setelah akun dihapus, 
            data tidak dapat dipulihkan.
          </p>

          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
            <h3 className="text-lg font-semibold text-yellow-800 mb-3">Ketentuan Hapus Akun</h3>
            <ul className="list-disc list-inside text-yellow-700 space-y-2 ml-2">
              <li>Permintaan hapus akun akan diproses dalam waktu maksimal 7 hari kerja.</li>
              <li>Data yang dihapus tidak dapat dikembalikan setelah proses selesai.</li>
              <li>
                Beberapa data mungkin tetap disimpan sesuai kewajiban hukum (misalnya untuk audit 
                atau kepatuhan).
              </li>
              <li>
                Pastikan Anda sudah menyimpan informasi penting sebelum mengajukan permintaan hapus akun.
              </li>
              <li>
                Jika Anda mengalami kendala, silakan hubungi kami melalui kontak di bagian 
                Kebijakan Privasi.
              </li>
            </ul>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                Nama Lengkap *
              </label>
              <input
                type="text"
                id="name"
                name="name"
                required
                value={formData.name}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#C9F35B] focus:border-transparent transition"
                placeholder="Masukkan nama lengkap Anda"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email *
              </label>
              <input
                type="email"
                id="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#C9F35B] focus:border-transparent transition"
                placeholder="email@example.com"
              />
            </div>

            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                Nomor HP *
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                required
                value={formData.phone}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#C9F35B] focus:border-transparent transition"
                placeholder="08xxxxxxxxxx"
              />
            </div>

            <div>
              <label htmlFor="reason" className="block text-sm font-medium text-gray-700 mb-2">
                Alasan Hapus Akun *
              </label>
              <textarea
                id="reason"
                name="reason"
                required
                value={formData.reason}
                onChange={handleChange}
                rows="4"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#C9F35B] focus:border-transparent transition"
                placeholder="Jelaskan alasan Anda ingin menghapus akun..."
              />
            </div>

            <button
              type="submit"
              className="w-full bg-[#C9F35B] hover:bg-[#B8E047] text-gray-900 py-3 px-6 rounded-lg font-medium focus:outline-none focus:ring-2 focus:ring-[#C9F35B] focus:ring-offset-2 transition-all transform hover:scale-[1.01] active:scale-[0.99] shadow-lg"
            >
              Kirim Permintaan via WhatsApp
            </button>
          </form>

          <p className="mt-6 text-sm text-gray-500 text-center">
            Dengan mengirim formulir ini, Anda akan diarahkan ke WhatsApp untuk konfirmasi lebih lanjut.
          </p>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-black border-t border-gray-800 py-8 mt-16">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <h3 className="text-xl font-semibold mb-2 text-white flex items-center justify-center gap-2">
            GARANSI<span className="text-[#C9F35B]">+</span>
          </h3>
          <p className="text-gray-400 mb-4">
            Sistem Manajemen Garansi Terpercaya
          </p>
          <p className="text-sm text-gray-600">
            © {new Date().getFullYear()} Garansi Plus. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
