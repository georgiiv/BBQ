const readline = require('node:readline');
const { Socket } = require('net')
const { socketPort, clientRequests, serverResponses, serverPushes } = require("./bbq.js")

const client = new Socket()
const bbqHost = "localhost"

const rl = readline.createInterface({
	input: process.stdin,
	output: process.stdout,
}).pause();

client.connect(socketPort, bbqHost, () => {
	console.log(`Connected to ${bbqHost}:${socketPort}`)
	client.write(clientRequests.hungry)

	client.on('data', async (message) => {
		console.log(`\nServer said: ${message}`)
		if (message.toString('utf8') === serverResponses.served || message.toString('utf8') === serverResponses.closed) {
			client.end()
			return;
		}

		if (message.toString('utf8') === serverResponses.wait) {
			client.write(clientRequests.hungry)
		} else {
			let input = null
			rl.resume()
			while (input != 1 && input != 2) {
				input = await new Promise(resolve => {
					rl.question(`\nPlease input number:\n1) ${clientRequests.take}\n2) ${clientRequests.decline}\n`, resolve)
				});
			}
			rl.pause()

			if (input == 1) {
				client.write(clientRequests.take)
			} else if (input == 2) {
				client.write(clientRequests.decline)
			}
		}
	})
})
