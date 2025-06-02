import io from 'socket.io-client';
const port = process.env.PORT || 8080
// const socket = io(`https://fantasy-2kpi-2d84171087be.herokuapp.com`);
const socket = io(`http://localhost:${port}`);

export default socket;