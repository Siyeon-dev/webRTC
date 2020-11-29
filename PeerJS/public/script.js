const socket = io('/');
const peer = new Peer();
let myStream; 
let peerList = [];

// PeerServer 에 대한 연결이 설정될 때 호출된다.
peer.on('open', id => {
  console.log('This is ID : ', id);
  // PeerServer 로부터 전달받은 ID값 저장
  document.getElementById('showPeer').innerHTML = id;
});

// 다른 peer가 자신을 호출할 때 call event 가 호출된다.
peer.on('call', call => {
  navigator.mediaDevices.getUserMedia({video:true}).then(stream => {
    myStream = stream;
    call.answer(myStream);

    call.on('stream', remoteStream => {
      if(!peerList.includes(call.peer)) {
        addRemoteVideo(remoteStream);
        peerList.push(call.peer)
      }
    });

    // addOurVideo(myStream);
  }).catch(err => {
    console.log(err + "unable to get media");
  });
});

// click event Listener
document.getElementById('callPeer').addEventListener('click', e => {
  // 상대방의 ID 값을 가지고 온다.
  let remotePeerId = document.getElementById('peerID').value;
  document.getElementById('showPeer').innerHTML = 'Connecting : ' + remotePeerId;
  callPeer(remotePeerId);
});

// 상대 peer 호출 func
function callPeer(peerId) {
  navigator.mediaDevices.getUserMedia({video:true}).then(stream => {
    myStream = stream;
    // 상대 peer 를 호출하여 call 변수에 저장. (매개변수로는 목적지 id 값)
    // peer.call 및 호출 이벤트의 콜백은 MediaConnection 객체를 제공하고,
    // 이 객체는 다른 Peer 의 비디오/ 오디오 stream을 포함하는 stream event 를 발생시킨다.
    let call = peer.call(peerId, myStream); 

    // remote Peer 에서 stream 을 Add 했을 때 호출
    call.on('stream', remoteStream => {
      // peerList 배열에 call.peer 객체가 존재하는지 확인
      if(!peerList.includes(call.peer)) {
        addRemoteVideo(remoteStream);
        peerList.push(call.peer);
      }
    });

    addOurVideo(myStream);

  }).catch(err => {
    console.log(err + "unable to get media");
  });
}

function addRemoteVideo(stream) {
  // video 태그 생성
  let newVideo = document.createElement('video');
  // stream 연결 후 재생

  newVideo.classList.add();
  newVideo.srcObject = stream;
  newVideo.play();
  document.getElementById('remoteVideo').append(newVideo);
}

function addOurVideo(stream) {
  // video 태그 생성
  let newVideo = document.createElement('video');
  // stream 연결 후 재생

  newVideo.classList.add();
  newVideo.srcObject = stream;
  newVideo.play();
  document.getElementById('ourVideo').append(newVideo);
}