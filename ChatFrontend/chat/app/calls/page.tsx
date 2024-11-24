"use client";

import { useEffect, useRef, useState } from 'react';
import io from 'socket.io-client';
import Peer, { Instance as PeerInstance, SignalData } from 'simple-peer';

const VideoCall = () => {
  const [stream, setStream] = useState<MediaStream | undefined>(undefined);
  const [peer, setPeer] = useState<PeerInstance | null>(null);
  const [otherUserId, setOtherUserId] = useState<string>('!!!');
  const [myId, setMyId] = useState<string>('');
  const myVideoRef = useRef<HTMLVideoElement | null>(null);
  const userVideoRef = useRef<HTMLVideoElement | null>(null);
  const socketRef = useRef<ReturnType<typeof io> | null>(null);
  let testStream: MediaStream;

  // Инициализация сокета
  useEffect(() => {
    socketRef.current = io('https://audiocase.ru:3001', {
      secure: true,
      rejectUnauthorized: false // только если у вас самоподписанный сертификат
    });
    socketRef.current.on('answer', handleAnswer);
    socketRef.current.on('candidate', handleCandidate);
    // Получаем свой уникальный ID от сервера
    socketRef.current.on('your-id', (id: string) => {
      setMyId(id);
      console.log('My ID:', id);
    });



    return () => {
      socketRef.current?.disconnect();
    };
  }, []);

  // Отслеживание изменений otherUserId
  useEffect(() => {
    socketRef.current?.off('offer');
    //socketRef.current?.off('answer');
    //socketRef.current?.off('candidate');
    socketRef.current?.on('offer', handleOffer);
    //socketRef.current?.on('answer', handleAnswer);
    //socketRef.current?.on('candidate', handleCandidate);
    console.log("Updated otherUserId:", otherUserId);
  }, [otherUserId]);

  const startVideo = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });
      setStream(mediaStream);
      if (myVideoRef.current) {
        console.log(mediaStream);
        myVideoRef.current.srcObject = mediaStream;
      }
    } catch (err) {
      console.error('Error accessing media devices.', err);
    }
  };

  const createPeer = () => {
    if (!stream || !otherUserId) return; // Проверяем, что введен ID собеседника

    const newPeer = new Peer({
      initiator: true,
      trickle: false,
      stream,
    });

    newPeer.on('signal', (data) => {
      console.log('Sending offer to:', otherUserId);
      socketRef.current?.emit('offer', data, otherUserId);
    });

    newPeer.on('stream', (userStream) => {
      console.log('Received stream from peer');
      console.log(userStream);
      if (userVideoRef.current) {
        userVideoRef.current.srcObject = userStream;
      }
    });

    setPeer(newPeer);  // Устанавливаем peer
  };

  const handleOffer = (offer: SignalData) => {
    console.log('Received offer:', offer);
    console.log(otherUserId);
    if (!stream) {
      console.log('No stream available, waiting for media stream...');
      startVideo().then(() => {
        console.log('Stream available now, handling offer');
        createPeerForAnswer(offer);
      });
      return;
    }

    console.log('Stream available, creating peer for answer...');
    createPeerForAnswer(offer);
  };

  const createPeerForAnswer = (offer: SignalData) => {
    if (!otherUserId) {
      console.error("ERROR: 'otherUserId' is not set! Cannot proceed.");
      return;
    }
  
    const newPeer = new Peer({
      initiator: false,
      trickle: false,
      stream,
    });
  
    newPeer.on('signal', (answer: SignalData) => {
      console.log('ANSWER Sending answer back to initiator');
      console.log("otherUserId =", otherUserId);
      socketRef.current?.emit('answer', answer, otherUserId);  // Отправка ответа
    });
  
    newPeer.on('stream', (userStream) => {
      console.log('Received stream from peer = ' + userStream);
      console.log(userStream);
      if (userVideoRef.current) {
        testStream = userStream;
        userVideoRef.current.srcObject = userStream;
      }
    });
  
    newPeer.on('icecandidate', (event) => {
      if (event.candidate) {
        console.log('Sending ICE candidate:', event.candidate);
        socketRef.current?.emit('candidate', event.candidate, otherUserId);
      } else {
        console.log('No more ICE candidates');
      }
    });
  
    newPeer.signal(offer);
    setPeer(newPeer);  // Устанавливаем peer для дальнейших действий
  };
  

  const handleAnswer = (answer: SignalData) => {
    console.log('Received answer:', answer);
    if (peer) {
      console.log('Sending answer to peer...');
      peer.signal(answer);  // Отправляем ответ в peer
    }
  };

  const handleCandidate = (candidate: RTCIceCandidate) => {
    if (peer) {
      console.log('Received ICE candidate');
      peer.signal({ type: 'candidate', candidate });
    }
  };

  return (
    <div>
      <h2>Video Call</h2>
      <div>
        <label>Your ID: {myId}</label>
      </div>
      <div>
        <label>
          Enter Peer ID:
          <input
            type="text"
            onChange={(e) => setOtherUserId(e.target.value)} // Обновляем ID собеседника
            placeholder="Enter the other user's ID"
          />
        </label>
      </div>

      <video ref={myVideoRef} autoPlay muted />
      <video ref={userVideoRef} autoPlay />
      <button onClick={() => {console.log(testStream)}}>Дебаг</button>
      <button onClick={startVideo}>Start Video Call</button>
      <button onClick={createPeer}>Connect to Peer</button>
    </div>
  );
};

export default VideoCall;
