INIT
client: init connection with server as leader
server: create session, store client id, send session key and client id to client, set client as master
client: store session key, broadcast to server every action
server: store actions by the server, broadcast actions to collaborators.

client: init connection with server as collaborator, send session key (hash value)
server: create and store client id, send id to client and begin broadcasting server actions to client.

RECONNECT
client: init connection with server with session key and client id
server: re-associates the client with session

