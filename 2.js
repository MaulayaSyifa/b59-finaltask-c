function sortArray(array) {
	// Kalimat target yang ingin kita bentuk
	const target = "Dumbways is awesome";

	// Mengubah target string menjadi array karakter untuk memudahkan perbandingan
	const targetArray = target.split("");

	// Implementasi Selection Sort
	for (let i = 0; i < array.length; i++) {
		// Mencari indeks karakter yang sesuai dengan posisi target
		let minIndex = i;

		// Mencari karakter yang sesuai dengan target di posisi i
		for (let j = i + 1; j < array.length; j++) {
			if (array[j] === targetArray[i]) {
				minIndex = j;
				break;
			}
		}

		// Menukar posisi karakter jika ditemukan yang sesuai
		if (minIndex !== i) {
			let temp = array[i];
			array[i] = array[minIndex];
			array[minIndex] = temp;
		}

		// Log setiap langkah pengurutan untuk memahami prosesnya
		console.log(">>", array.join(""));
	}

	// Menggabungkan array menjadi string
	return array.join("");
}

// Test case
const input = [
	"u",
	"D",
	"m",
	"w",
	"b",
	"a",
	"y",
	"s",
	"i",
	"s",
	"w",
	"a",
	"e",
	"s",
	"e",
	"o",
	"m",
	" ",
	" ",
];

console.log("\nSorted result:", sortArray(input));
