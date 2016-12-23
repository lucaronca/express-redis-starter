// Unique key generator module
// Pass a parameter to the constructor or the create method to specify the length of the key

class keyGenerator {

	constructor(length = 10) {

		this.length = length;

	}

	create(length = this.length) {

		let res = '';
		while (res.length < length) {
			res += Math.random().toString(16).substring(2);
		}
		return res.toString(0, length);

	}

}

module.exports = keyGenerator;