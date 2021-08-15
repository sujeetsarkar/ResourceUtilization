from flask import Flask
from flask_cors import CORS
from flask_socketio import *
import psutil
import GPUtil


app = Flask(__name__)
CORS(app)
socketio = SocketIO(app, cors_allowed_origins="*")
tick = 0
ramTick = 0
gpuTick = 0


# SocketIO Events
@socketio.on('connect')
def connected():
    print('Connected')

@socketio.on('disconnect')
def disconnected():
    print('Disconnected')

@socketio.on('cpu')
def cpuUsages():
    global tick
    tick = tick + 1
    emit('cpu', { 'name': tick, 'value': psutil.cpu_percent() }, broadcast=True)

@socketio.on('ram')
def ramUsages():
    global ramTick
    ramTick = ramTick + 1
    emit('ram', { 'name': ramTick, 'value': psutil.virtual_memory().percent }, broadcast=True)

@socketio.on('gpu')
def gpuUsages():
    global gpuTick
    gpuTick = gpuTick + 1
    GPUs = GPUtil.getGPUs()
    if len(GPUs) > 0:
        gpu = GPUs[0].load * 100
        emit('gpu', { 'name': gpuTick, 'value': gpu }, broadcast=True)

if __name__ == '__main__':
    socketio.run(app, debug=True)
