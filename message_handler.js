const sleep = require('util').promisify(setTimeout)
const { socketPort, httpPort, clientRequests, serverResponses, serverPushes } = require("./bbq.js")

class MessageHandler{
	static waitTime = 5000
	static #appState = []

	static deleteStateById(id){
		delete this.#appState[id]
	}

	static async handleMessage(message, uniqueID) {
		let response = serverResponses.closed
		if (Object.values(clientRequests).includes(message) == false) {
			console.log(`Unknown client request ${message}`)
			return serverResponses.closed
		}
	
		if (this.#appState[uniqueID] == null && message === clientRequests.hungry) {
			this.#appState[uniqueID] = serverPushes.chicken
			return serverResponses.wait
		} else if (this.#appState[uniqueID] == null) {
			return serverResponses.closed
		}

		if (message === clientRequests.hungry) {
			switch (this.#appState[uniqueID]) {
				case serverPushes.chicken:
					await sleep(this.waitTime)
					return serverPushes.chicken
				case serverPushes.beef:
					await sleep(this.waitTime)
					return serverPushes.beef
				case serverPushes.mammoth:
					await sleep(this.waitTime)
					return serverPushes.mammoth
				default:
					console.log(`Bad state: ${this.#appState[uniqueID]}, for message ${message}`)
			}
		}

		if (message === clientRequests.decline) {
			switch (this.#appState[uniqueID]) {
				case serverPushes.chicken:
					this.#appState[uniqueID] = serverPushes.beef
					return serverResponses.wait
				case serverPushes.beef:
					this.#appState[uniqueID] = serverPushes.mammoth
					return serverResponses.wait
				case serverPushes.mammoth:
					this.#appState[uniqueID] = null
					return serverResponses.closed
				default:
					console.log(`Bad state: ${this.#appState[uniqueID]}, for message ${message}`)
			}
		}

		if (message === clientRequests.take) {
			switch (this.#appState[uniqueID]) {
				case serverPushes.chicken:
					// console.log("Client took chicken")
					break
				case serverPushes.beef:
					// console.log("Client took beef")
					break
				case serverPushes.mammoth:
					// console.log("Client took last month mammoth")
					break
				default:
					console.log(`Bad state: ${this.#appState[uniqueID]}, for message ${message}`)
			}
			return serverResponses.served
		}

		return response
	}
}

module.exports = MessageHandler
