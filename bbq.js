const socketPort = 3000
const httpPort = 8080

const clientRequests = {
	hungry: "I AM HUNGRY, GIVE ME BBQ",
	decline: "NO THANKS",
	take: "I TAKE THAT!!!"
}
const serverResponses = {
	wait: "OK, WAIT",
	closed: "CLOSED BYE",
	served: "SERVED BYE"
}
const serverPushes = {
	chicken: "CHICKEN READY",
	beef: "BEEF READY",
	mammoth: "LAST MONTH MAMMOTH READY"
}

module.exports = {socketPort, httpPort, clientRequests, serverResponses, serverPushes}
