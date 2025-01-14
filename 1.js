// Seorang investor menginvestasikan modalnya sebesar 1 miliar ke beberapa
// instrumen keuangan. 350 juta ditempatkan ke deposito bank dengan
// keuntungan 3,5% per tahun, sedangkan 650 juta ditempatkan di obligasi
// negara sebesar 30% dengan keuntungan 13% per tahun, 35% ditempatkan
// di saham A dengan keuntungan 14,5% per tahun, dan sisanya ditempatkan
// di saham B dengan keuntungan 12,5% per tahun. Buatlah sebuah fungsi
// yang menghitung dan mencetak total uang investor setelah dua tahun.

function hitungProfitInvestasi() {

	// Deposito bank (350 juta)
	const deposito = 350000000;
	const profitDeposito = 0.035; // 3.5%

	// Obligasi negara (30% dari 650 juta)
	const obligasi = 650000000 * 0.3;
	const profitObligasi = 0.13; // 13%

	// Saham A (35% dari 650 juta)
	const sahamA = 650000000 * 0.35;
	const profitSahamA = 0.145; // 14.5%

	// Saham B (sisa dari 650 juta = 35%)
	const sahamB = 650000000 * 0.35;
	const profitSahamB = 0.125; // 12.5%

	// Hitung profit untuk setiap instrumen selama 2 tahun
	// Menggunakan rumus bunga majemuk: A = P(1 + r)^t
	// dimana:
	// A = jumlah akhir,	
	// P = principal (modal awal),
	// r = rate (tingkat profit),
	// t = time (waktu dalam tahun)
	const totalDeposito = deposito * Math.pow(1 + profitDeposito, 2);
	const totalObligasi = obligasi * Math.pow(1 + profitObligasi, 2);
	const totalSahamA = sahamA * Math.pow(1 + profitSahamA, 2);
	const totalSahamB = sahamB * Math.pow(1 + profitSahamB, 2);

	// Hitung total keseluruhan
	const total = totalDeposito + totalObligasi + totalSahamA + totalSahamB;

	// Konfigurasi format mata uang
	const formatRupiah = new Intl.NumberFormat("id-ID", {
		style: "currency",
		currency: "IDR",
		minimumFractionDigits: 2,
	});

	// Cetak rincian dengan format mata uang Rupiah
	console.log("Rincian investasi setelah 2 tahun:\n");
	console.log(`Deposito : ${formatRupiah.format(totalDeposito)}`);
	console.log(`Obligasi : ${formatRupiah.format(totalObligasi)}`);
	console.log(`Saham A  : ${formatRupiah.format(totalSahamA)}`);
	console.log(`Saham B  : ${formatRupiah.format(totalSahamB)}\n`);
	console.log(`Total keseluruhan: ${formatRupiah.format(total)}`);

	return total;
}

// Jalankan fungsi
const profit = hitungProfitInvestasi();
