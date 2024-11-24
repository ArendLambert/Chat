// import { useEffect } from 'react';
// import Script from 'next/script';

// interface JitsiMeetingProps {
//   roomName: string;
// }

// const JitsiMeeting: React.FC<JitsiMeetingProps> = ({ roomName }) => {
//   useEffect(() => {
//     const domain = 'meet.jit.si'; // или ваш собственный сервер Jitsi
//     const options = {
//       roomName: roomName,
//       width: '100%',
//       height: '100%',
//       parentNode: document.getElementById('jitsi-meet'),
//       configOverwrite: {},
//       interfaceConfigOverwrite: {}
//     };

//     // Проверка на существование JitsiMeetExternalAPI
//     if (typeof window !== 'undefined' && window.JitsiMeetExternalAPI) {
//       const api = new window.JitsiMeetExternalAPI(domain, options);

//       return () => {
//         api.dispose();
//       };
//     }
//   }, [roomName]);

//   return (
//     <>
//       <Script
//         src="https://meet.jit.si/external_api.js"
//         strategy="lazyOnload"
//         onLoad={() => {
//           console.log('Jitsi API script loaded successfully');
//         }}
//       />
//       <div id="jitsi-meet" style={{ height: '500px', width: '100%' }} />
//     </>
//   );
// };

// export default JitsiMeeting;
