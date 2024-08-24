BBQ assignment
==============

**Prerequisites:**
- Install Node.js `v18.16.1` or higher.
- Run `npm install` to install required packages .

**How to run:**
- Run server with `node server.js`
- Run HTTP client with `node client_http.js`
- Run socket client with `node client_socket.js`
- Run unit tests with `npm test`

**Notes:**
- Simultaneous clients are supported:
  - Over a `Socket` connection, the `Client IP` and `Client Port` are used together as the `Unique ID`.
  - Over a `HTTP` connection, the `Client Port` changes on every request, so the only thing that can be used for identification is the `Client IP`. Handling more than one client originating from the same `IP` can be achieved by utilizing `Cookies`.


**Example application flow:**

![Example application flow](./flow.svg)

**Legend:**
- Arrows are client requests
- Rectangles are server responses
- Ovals are server pushes
