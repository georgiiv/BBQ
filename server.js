const { Server } = require('net')
const express = require('express')
const { socketPort, httpPort, clientRequests, serverResponses, serverPushes } = require("./bbq.js")
const MessageHandler = require("./message_handler.js")

const socketApp = new Server(socket => {
	socket.on('data', async (message) => {
		uniqueID = `socket:[${socket.remoteAddress}]:${socket.remotePort}`

		console.log(`\nSocket: ${uniqueID} to server: ${message.toString('utf8')}`)
		response = await MessageHandler.handleMessage(message.toString('utf8'), uniqueID)
		console.log(`Socket: server to ${uniqueID}: ${response}`)

		if (response === serverResponses.closed || response === serverResponses.served) {
			socket.end(response);
		} else {
			socket.write(response)
		}
	})
	socket.on('end', () => {
		console.log('Client disconnected')
		MessageHandler.deleteStateById(uniqueID)
	})
	socket.on('error', () => {
		console.error('Unexpected error')
		socket.end()
	})
})
socketApp.listen(socketPort, () => console.log(`Socket server listening on ${socketPort}`))

const expressApp = express()
expressApp.use(express.text())
expressApp.get('/', (req, res) => { res.redirect('/bbq') })
expressApp.get('/bbq', (req, res) => {
	res.set('Content-Type', 'text/plain');
	res.send(`Client request options are:\n${clientRequests.hungry}\n${clientRequests.decline}\n${clientRequests.take}`)
})
expressApp.post('/bbq', async (req, res) => {
	uniqueID = `http:[${req.ip}]`

	console.log(`\nHTTP: ${uniqueID} to server: ${req.body}`)
	response = await MessageHandler.handleMessage(req.body, uniqueID)
	console.log(`HTTP: server to ${uniqueID}: ${response}`)

	if (response === serverResponses.closed || response === serverResponses.served) {
		MessageHandler.deleteStateById(uniqueID)
	}
	res.set('Content-Type', 'text/plain');
	res.send(response);
})
expressApp.listen(httpPort, () => { console.log(`HTTP server listening on port ${httpPort}`) })
