"use client";

import { useEffect, useRef, useState } from 'react';
import { HubConnectionBuilder, HubConnection, HttpTransportType } from '@microsoft/signalr';

const VideoCall = () => {
  const [stream, setStream] = useState<MediaStream | undefined>(undefined);
  const [connection, setConnection] = useState<HubConnection | null>(null);
  const [otherUserId, setOtherUserId] = useState<string>('!!!');
  const [myId, setMyId] = useState<string>('');
  const myVideoRef = useRef<HTMLVideoElement | null>(null);
  const userVideoRef = useRef<HTMLVideoElement | null>(null);
  const peerConnection = useRef<RTCPeerConnection | null>(null);

  // Инициализация SignalR соединения
  useEffect(() => {
    const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
    const newConnection = new HubConnectionBuilder()
      .withUrl(`${apiBaseUrl}/videohub`, {
        withCredentials: true,
        skipNegotiation: true,
        transport: HttpTransportType.WebSockets
      })
      .withAutomaticReconnect()
      .build();

    setConnection(newConnection);

    newConnection.start()
      .then(() => {
        console.log('SignalR Connected!');
        // Получаем свой ID от сервера
        newConnection.invoke("GetConnectionId").then((id) => {
          setMyId(id);
          console.log('My ID:', id);
        });
      })
      .catch(err => console.error('SignalR Connection Error: ', err));

    // Обработчики SignalR событий
    newConnection.on("ReceiveOffer", handleOffer);
    newConnection.on("ReceiveAnswer", handleAnswer);
    newConnection.on("ReceiveCandidate", handleCandidate);

    return () => {
      if (newConnection) {
        newConnection.stop();
      }
      if (peerConnection.current) {
        peerConnection.current.close();
      }
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

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

  const createPeerConnection = () => {
    if (!stream || !otherUserId) return;

    const pc = new RTCPeerConnection({
      iceServers: [
        { urls: 'stun:stun.l.google.com:19302' }
      ]
    });

    // Добавляем локальные треки
    stream.getTracks().forEach(track => {
      pc.addTrack(track, stream);
    });

    // Обработка ICE кандидатов
    pc.onicecandidate = (event) => {
      if (event.candidate) {
        console.log('Sending ICE candidate');
        connection?.invoke("SendCandidate", otherUserId, event.candidate);
      }
    };

    // Обработка входящего стрима
    pc.ontrack = (event) => {
      console.log('Received remote track');
      if (userVideoRef.current) {
        userVideoRef.current.srcObject = event.streams[0];
      }
    };

    peerConnection.current = pc;
    return pc;
  };

  const startCall = async () => {
    const pc = createPeerConnection();
    if (!pc) return;

    try {
      const offer = await pc.createOffer();
      await pc.setLocalDescription(offer);
      console.log('Sending offer to:', otherUserId);
      connection?.invoke("SendOffer", otherUserId, offer);
    } catch (err) {
      console.error('Error creating offer:', err);
    }
  };

  const handleOffer = async (fromUserId: string, offer: RTCSessionDescriptionInit) => {
    console.log('Received offer from:', fromUserId);
    setOtherUserId(fromUserId);

    if (!stream) {
      await startVideo();
    }

    const pc = createPeerConnection();
    if (!pc) return;

    try {
      await pc.setRemoteDescription(new RTCSessionDescription(offer));
      const answer = await pc.createAnswer();
      await pc.setLocalDescription(answer);
      connection?.invoke("SendAnswer", fromUserId, answer);
    } catch (err) {
      console.error('Error handling offer:', err);
    }
  };

  const handleAnswer = async (answer: RTCSessionDescriptionInit) => {
    console.log('Received answer');
    try {
      await peerConnection.current?.setRemoteDescription(
        new RTCSessionDescription(answer)
      );
    } catch (err) {
      console.error('Error handling answer:', err);
    }
  };

  const handleCandidate = async (candidate: RTCIceCandidateInit) => {
    try {
      await peerConnection.current?.addIceCandidate(new RTCIceCandidate(candidate));
    } catch (err) {
      console.error('Error handling candidate:', err);
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl mb-4">Video Call</h2>
      <div className="mb-4">
        <label className="block">Your ID: {myId}</label>
      </div>
      <div className="mb-4">
        <label className="block">
          Enter Peer ID:
          <input
            type="text"
            value={otherUserId}
            onChange={(e) => setOtherUserId(e.target.value)}
            className="border p-2 ml-2"
          />
        </label>
      </div>
      <div className="mb-4 space-x-2">
        <button
          onClick={startVideo}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Start Video
        </button>
        <button
          onClick={startCall}
          className="bg-green-500 text-white px-4 py-2 rounded"
        >
          Call
        </button>
      </div>
      <div className="flex space-x-4">
        <div>
          <h3 className="mb-2">Your Video</h3>
          <video
            ref={myVideoRef}
            autoPlay
            playsInline
            muted
            className="border"
            style={{ width: '400px' }}
          />
        </div>
        <div>
          <h3 className="mb-2">Peer Video</h3>
          <video
            ref={userVideoRef}
            autoPlay
            playsInline
            className="border"
            style={{ width: '400px' }}
          />
        </div>
      </div>
    </div>
  );
};

export default VideoCall;
