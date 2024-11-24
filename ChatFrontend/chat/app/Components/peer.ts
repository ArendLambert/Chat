import Peer from 'simple-peer';

export function createPeer(isInitiator: boolean, stream: MediaStream, onSignal: (signal: object) => void, onStream: (stream: MediaStream) => void): Peer.Instance {
  const peer = new Peer({ initiator: isInitiator, stream });

  peer.on('error', err => console.error('error', err));
  peer.on('signal', data => {
    onSignal(data);
  });

  peer.on('stream', stream => {
    onStream(stream);
  });

  return peer;
}
