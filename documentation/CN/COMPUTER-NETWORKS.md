# 22ITT52 — Computer Networks

## Topology
The project uses a client–server star-style logical topology. The student/admin browser is the client. It communicates with the Express application server through the LAN/router/switch infrastructure. Express accesses MongoDB on the backend host/network. In local development, all services may run on one computer using loopback interfaces.

## Addressing plan (illustrative lab configuration)
| Node | Example address | Purpose |
|---|---|---|
| Student browser host | 192.168.1.10/24 | Client workstation |
| Express server host | 192.168.1.100/24 | API host |
| Default gateway | 192.168.1.1 | Routes outside local subnet |
| MongoDB service | 192.168.1.100:27017 | Database listener (keep private) |

These are documentation examples, not addresses discovered from a live campus network. On a developer laptop, use `127.0.0.1` for local services. On a real network, obtain assigned addresses from the network administrator.

## Protocols
- HTTP: application-layer request/response protocol used by browser and REST API in local development.
- HTTPS: HTTP protected by TLS; required for production login and quiz traffic.
- TCP: transport protocol providing ordered, reliable byte-stream delivery. HTTPS normally runs over TCP (HTTP/1.1 or HTTP/2); HTTP/3 uses QUIC over UDP.
- DNS: resolves a domain name to an IP address when deployed with a hostname.
- ARP: resolves a local IPv4 address to a link-layer MAC address on an IPv4 LAN.
- MongoDB wire protocol: backend-to-database communication; do not expose database port publicly.

## Port numbers
| Port | Service | Reason |
|---|---|---|
| 5173/TCP | Vite development frontend | Local React development server |
| 5000/TCP | Express API | Configured `PORT` in backend `.env` |
| 27017/TCP | MongoDB | Default MongoDB listener; restrict to backend host |
| 443/TCP | HTTPS (production) | Encrypted web access |
| 80/TCP | HTTP (optional redirect) | Redirect users to HTTPS |

## Packet/request flow
1. Browser resolves the API hostname through DNS (not needed for localhost).
2. Client establishes a TCP connection to the server.
3. Browser sends an HTTP request, e.g. `GET /api/quizzes/CN/1`, with JWT Authorization header.
4. Express middleware checks CORS, rate limit and JWT.
5. Route reads quiz records from the JSON question bank; for submission it calculates score and writes an Attempt document to MongoDB.
6. Express returns an HTTP status and JSON response through the established TCP connection.
7. Browser updates the dashboard/result view.

## Security
Use HTTPS/TLS outside localhost. Restrict MongoDB to trusted backend hosts, use firewall rules, rotate secrets, and never store credentials in source control. The example IP addresses are a teaching topology only.
