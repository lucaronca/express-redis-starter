// Unique key generator module
// Pass a parameter to the construnctor or the create method to specify the length of the key

class keyGenerator {

	constructor(length = 10) {

		this.length = length;

	}

	create(length = this.length) {

		var ret = "";
		while (ret.length < length) {
			ret += Math.random().toString(16).substring(2);
		}
		return ret.toString(0, length);

	}

}

module.exports = keyGenerator;