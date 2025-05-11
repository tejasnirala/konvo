import socket from 'socket.io-client'

let socketInstance = null;

export function initializeSocket(projectId) {
  
  socketInstance = socket(import.meta.env.VITE_API_URL, {
    auth: {
      token: localStorage.getItem('token')
    },
    query: {
      projectId
    }
  })

  return socketInstance;
}

export function receiveMessage(eventName, cb) {
  socketInstance.on(eventName, cb);
}

export function sendMessage(eventName, cb) {
  socketInstance.emit(eventName, cb);
}