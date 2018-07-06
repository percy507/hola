module.exports = {
  'request-video-chat': requestVideoChat,
  'video-chat-ready': videoChatReady,
  'rtc-candidate': handleCandidate,
  'rtc-offer': handleOffer,
  'rtc-answer': handleAnswer
};

async function requestVideoChat({
  from,
  to
}) {
  const userHash = global.$userHash;
  const fromSocketId = userHash[from];
  const toSocketId = userHash[to];
  const socket = global.$sockets[fromSocketId];

  socket.to(toSocketId)
    .emit('request-video-chat', {
      from
    });
}

async function videoChatReady({
  from,
  to
}) {
  const userHash = global.$userHash;
  const fromSocketId = userHash[from];
  const toSocketId = userHash[to];
  const socket = global.$sockets[fromSocketId];

  socket.to(toSocketId)
    .emit('video-chat-ready', {
      from
    });
}

async function handleCandidate({
  from,
  to,
  candidateSdp
}) {
  const userHash = global.$userHash;
  const fromSocketId = userHash[from];
  const toSocketId = userHash[to];
  const socket = global.$sockets[fromSocketId];

  console.log(`candidateSdp: ${candidateSdp}`);

  socket.to(toSocketId)
    .emit('rtc-candidate', {
      from,
      candidateSdp
    });
}

async function handleOffer({
  from,
  to,
  offerSdp
}) {
  const userHash = global.$userHash;
  const fromSocketId = userHash[from];
  const toSocketId = userHash[to];
  const socket = global.$sockets[fromSocketId];

  console.log(`offerSdp: ${offerSdp}`);

  socket.to(toSocketId)
    .emit('rtc-offer', {
      from,
      offerSdp
    });
}

async function handleAnswer({
  from,
  to,
  answerSdp
}) {
  const userHash = global.$userHash;
  const fromSocketId = userHash[from];
  const toSocketId = userHash[to];
  const socket = global.$sockets[fromSocketId];

  console.log(`answerSdp: ${answerSdp}`);

  socket.to(toSocketId)
    .emit('rtc-answer', {
      from,
      answerSdp
    });
}
