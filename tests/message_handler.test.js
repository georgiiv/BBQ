"use strict"
const { clientRequests, serverResponses, serverPushes } = require("../bbq.js")
const MessageHandler = require("../message_handler.js")
MessageHandler.waitTime = 10

function getRandomInt() {
	return Math.floor(Math.random() * 30000)
}

test('Return wait on hungry request', async () => {
	let uniqueID = getRandomInt()
	let response = await MessageHandler.handleMessage(clientRequests.hungry, uniqueID)
	expect(response).toBe(serverResponses.wait)
})

test('Decline all bbq', async () => {
	let uniqueID = getRandomInt()
	let response = await MessageHandler.handleMessage(clientRequests.hungry, uniqueID)
	expect(response).toBe(serverResponses.wait)
	response = await MessageHandler.handleMessage(clientRequests.hungry, uniqueID)
	expect(response).toBe(serverPushes.chicken)
	response = await MessageHandler.handleMessage(clientRequests.decline, uniqueID)
	expect(response).toBe(serverResponses.wait)
	response = await MessageHandler.handleMessage(clientRequests.hungry, uniqueID)
	expect(response).toBe(serverPushes.beef)
	response = await MessageHandler.handleMessage(clientRequests.decline, uniqueID)
	expect(response).toBe(serverResponses.wait)
	response = await MessageHandler.handleMessage(clientRequests.hungry, uniqueID)
	expect(response).toBe(serverPushes.mammoth)
	response = await MessageHandler.handleMessage(clientRequests.decline, uniqueID)
	expect(response).toBe(serverResponses.closed)
})

test('Accept chicken', async () => {
	let uniqueID = getRandomInt()
	let response = await MessageHandler.handleMessage(clientRequests.hungry, uniqueID)
	expect(response).toBe(serverResponses.wait)
	response = await MessageHandler.handleMessage(clientRequests.hungry, uniqueID)
	expect(response).toBe(serverPushes.chicken)
	response = await MessageHandler.handleMessage(clientRequests.take, uniqueID)
	expect(response).toBe(serverResponses.served)
})

test('Accept beef', async () => {
	let uniqueID = getRandomInt()
	let response = await MessageHandler.handleMessage(clientRequests.hungry, uniqueID)
	expect(response).toBe(serverResponses.wait)
	response = await MessageHandler.handleMessage(clientRequests.hungry, uniqueID)
	expect(response).toBe(serverPushes.chicken)
	response = await MessageHandler.handleMessage(clientRequests.decline, uniqueID)
	expect(response).toBe(serverResponses.wait)
	response = await MessageHandler.handleMessage(clientRequests.hungry, uniqueID)
	expect(response).toBe(serverPushes.beef)
	response = await MessageHandler.handleMessage(clientRequests.take, uniqueID)
	expect(response).toBe(serverResponses.served)
})

test('Accept mammoth', async () => {
	let uniqueID = getRandomInt()
	let response = await MessageHandler.handleMessage(clientRequests.hungry, uniqueID)
	expect(response).toBe(serverResponses.wait)
	response = await MessageHandler.handleMessage(clientRequests.hungry, uniqueID)
	expect(response).toBe(serverPushes.chicken)
	response = await MessageHandler.handleMessage(clientRequests.decline, uniqueID)
	expect(response).toBe(serverResponses.wait)
	response = await MessageHandler.handleMessage(clientRequests.hungry, uniqueID)
	expect(response).toBe(serverPushes.beef)
	response = await MessageHandler.handleMessage(clientRequests.decline, uniqueID)
	expect(response).toBe(serverResponses.wait)
	response = await MessageHandler.handleMessage(clientRequests.hungry, uniqueID)
	expect(response).toBe(serverPushes.mammoth)
	response = await MessageHandler.handleMessage(clientRequests.take, uniqueID)
	expect(response).toBe(serverResponses.served)
})

test('Start with wrong request', async () => {
	let uniqueID = getRandomInt()
	let response = await MessageHandler.handleMessage(clientRequests.take, uniqueID)
	expect(response).toBe(serverResponses.closed)
	response = await MessageHandler.handleMessage(clientRequests.decline, uniqueID)
	expect(response).toBe(serverResponses.closed)
})

test('Concurrent users', async () => {
	let uniqueID1 = getRandomInt()
	let uniqueID2 = getRandomInt()
	let response = await MessageHandler.handleMessage(clientRequests.hungry, uniqueID2)
	response = await MessageHandler.handleMessage(clientRequests.hungry, uniqueID2)
	response = await MessageHandler.handleMessage(clientRequests.decline, uniqueID2)
	response = await MessageHandler.handleMessage(clientRequests.hungry, uniqueID1)
	response = await MessageHandler.handleMessage(clientRequests.hungry, uniqueID1)
	expect(response).toBe(serverPushes.chicken)
	response = await MessageHandler.handleMessage(clientRequests.take, uniqueID1)
	expect(response).toBe(serverResponses.served)
	response = await MessageHandler.handleMessage(clientRequests.hungry, uniqueID2)
	expect(response).toBe(serverPushes.beef)
	response = await MessageHandler.handleMessage(clientRequests.take, uniqueID2)
	expect(response).toBe(serverResponses.served)
})

test('Unknown request', async () => {
	let uniqueID = getRandomInt()
	let response = await MessageHandler.handleMessage("different", uniqueID)
	expect(response).toBe(serverResponses.closed)
})

test('Delete by uniqueID', async () => {
	let uniqueID = getRandomInt()
	let response = await MessageHandler.handleMessage(clientRequests.hungry, uniqueID)
	response = await MessageHandler.handleMessage(clientRequests.hungry, uniqueID)
	response = await MessageHandler.handleMessage(clientRequests.decline, uniqueID)
	response = await MessageHandler.handleMessage(clientRequests.hungry, uniqueID)
	expect(response).toBe(serverPushes.beef)
	MessageHandler.deleteStateById(uniqueID)
	response = await MessageHandler.handleMessage(clientRequests.hungry, uniqueID)
	response = await MessageHandler.handleMessage(clientRequests.hungry, uniqueID)
	expect(response).toBe(serverPushes.chicken)
})
