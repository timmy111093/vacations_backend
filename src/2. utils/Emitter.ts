import EventEmitter from 'events';


class myEmitter extends EventEmitter {}

const eventEmitter = new myEmitter();

eventEmitter.on('start', () => {
      console.log('Started');
});

export default eventEmitter;