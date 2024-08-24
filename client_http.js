const readline = require('node:readline');
const { httpPort, clientRequests, serverResponses, serverPushes } = require("./bbq.js")

const bbqHost = `http://localhost:${httpPort}/bbq`

const rl = readline.createInterface({
	input: process.stdin,
	output: process.stdout,
}).pause();

async function request(req) {
	console.log(`\nClient said: ${req}`)
	let response = await (await fetch(`${bbqHost}`, {
		method: "POST",
		headers: {"Content-Type": "text/plain"},
		body: req
	})).text()
	console.log(`Server said: ${response}`)
	return response
}

async function poll() {
	let errorCount = 0
	let response = null
	while (response == serverResponses.wait || response == null) {
		if(errorCount >= 20){console.error("fetch() error count exceeded 20"); process.exit(1)}
		try {
			response = await request(clientRequests.hungry)
		} catch (e) {
			errorCount+=1
			console.error("fetch() timeout or error")
		}
	}
	return response;
}

async function app() {
	while (1) {
		let response = await poll()
		let input = null

		rl.resume()
		while (input != 1 && input != 2) {
			input = await new Promise(resolve => {
				rl.question(`\nPlease input number:\n1) ${clientRequests.take}\n2) ${clientRequests.decline}\n`, resolve)
			});
		}
		rl.pause()
		if (input == 1) {
			response = await request(clientRequests.take)
		} else if (input == 2) {
			response = await request(clientRequests.decline)
		}

		if (response === serverResponses.served || response === serverResponses.closed) {
			break;
		}
	}
}
app();
