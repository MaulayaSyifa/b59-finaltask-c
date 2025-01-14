function cetakPola(tinggi) {
	// Array untuk menyimpan setiap baris pola
	let hasilPola = [];

	// Menghitung lebar maksimum untuk padding yang tepat
	// Setiap karakter dan spasi dihitung sebagai 1 unit
	const lebarMaksimum = tinggi * 2 - 1;

	// Loop untuk setiap baris
	for (let baris = 1; baris <= tinggi; baris++) {
		let barisSekarang = "";
		let jumlahKarakter = tinggi - baris + 1;

		// Menghitung jumlah spasi di awal baris untuk membuat segitiga sama sisi
		// Formula: (lebarMaksimum - (jumlahKarakter * 2 - 1)) / 2
		let spasiAwal = " ".repeat((lebarMaksimum - (jumlahKarakter * 2 - 1)) / 2);

		// Menambahkan spasi awal
		barisSekarang += spasiAwal;

		// Mengisi karakter berdasarkan nomor baris
		if (baris === 1) {
			// Baris pertama: selang-seling # dan +
			for (let i = 0; i < jumlahKarakter; i++) {
				barisSekarang += i % 2 === 0 ? "#" : "+";
				if (i < jumlahKarakter - 1) barisSekarang += " ";
			}
		} else if (baris === tinggi) {
			// Baris terakhir: hanya #
			barisSekarang += "#";
		} else if (baris === 3) {
			// Baris ketiga: selang-seling + dan #
			for (let i = 0; i < jumlahKarakter; i++) {
				barisSekarang += i % 2 === 0 ? "+" : "#";
				if (i < jumlahKarakter - 1) barisSekarang += " ";
			}
		} else {
			// Baris lainnya: semua +
			for (let i = 0; i < jumlahKarakter; i++) {
				barisSekarang += "+";
				if (i < jumlahKarakter - 1) barisSekarang += " ";
			}
		}

		// Menambahkan baris yang sudah dibuat ke array hasil
		hasilPola.push(barisSekarang);
	}

	// Menampilkan hasil
	console.log(hasilPola.join("\n"));
}

// Menjalankan fungsi dengan input 5
console.log("");
cetakPola(5);
