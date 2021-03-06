/* eslint-disable */

import React, {useState, useEffect, useRef } from 'react';
import './assets/css/components.css';
import './assets/css/style.css';
import './assets/css/chatroom.css';
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardContent from "@mui/material/CardContent";
import Button from '@mui/material/Button';
// import SendIcon from '@mui/icons-material/Send';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TextField from '@mui/material/TextField';
import { green, grey, lightGreen, red } from '@mui/material/colors';
import Icon from '@mui/material/Icon';
import axios from 'axios';
import { useAuthState,useAuthDispatch } from 'src/Context';
import ButtonGroup from '@mui/material/ButtonGroup';
import Box from '@mui/material/Box';
import ImageIcon from '@mui/icons-material/Image';
import UploadFileRoundedIcon from '@mui/icons-material/UploadFileRounded';
import ArticleIcon from '@mui/icons-material/Article';
import AssignmentIndIcon from '@mui/icons-material/AssignmentInd';
import CalendarIcon from '@mui/icons-material/CalendarToday';
import $ from 'jquery';
import Calendar from './Calendar';

import Avatar from "@mui/material/Avatar";

import SendIcon from "@mui/icons-material/Send";
import LogoutIcon from "@mui/icons-material/Logout";

import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import { Block, RoomOutlined } from '@mui/icons-material';
import { Air } from '@mui/icons-material';

// Stomp
import SockJS from 'sockjs-client';
import { Stomp } from '@stomp/stompjs';
import { now } from 'lodash';
import moment from 'moment';

import Modal from '@mui/material/Modal';
import ChatNotice from 'src/components/ChatNotice';
import { useChatContext, useChatStateContext } from 'src/Context/context';

import IconButton from 'src/theme/overrides/IconButton';
import { CardFooter } from 'reactstrap';
import Scrollbar from 'src/components/Scrollbar';
import { useNavigate } from 'react-router-dom';
import { DataStateContext, DataContext, useDataStateContext, useDataContext } from 'src/Context/context';
import UserContact from 'src/components/UserContact';

import { saveAs } from 'file-saver';

///////////////////////////////////////////////////////////////////////

const ChatRoom = () => {
    const [contents, setContents] = useState();
    const auth = useAuthState();
    const dispatch = useAuthDispatch();
    const navigate = useNavigate();
    const [messageList, setMessageList] = useState([]);
    const [roomCallState, setRoomCallState] = useState(false);
    const [image, setImage] = useState();
    const [loadImg, setLoadImg] = useState();
    const [typeState, setTypeState] = useState();
    const imgRef = useRef(null);
    const sendImgRef = useRef();
    const sendMsgRef = useRef();
    const[roomNo, setRoomNo] = useState(auth.chatNo);
    const scrollRef = useRef();

    const [file, setFile] = useState();
    const [loadFile, setloadFile] = useState(); // append??? ?????? formData
    const fileRef = useRef(null);
    const sendFileRef = useRef();
    const thisRoomNo = null;

    const socket = new SockJS('http://localhost:8080/TT/websocket');
    const stompClient = Stomp.over(socket);

    const datastate = useDataStateContext();
    const datas = useDataContext();
    
    // const chatinfo= {
    //   userNo: auth.token
    // }

  //?????? ????????? ?????? ??????,?????? context
  const chatstate = useChatStateContext();
  // const ttmessage = useChatContext();
  const [msg,setMsg] = useState({});

  // ?????? ?????? ????????? ????????? ?????????
  const [rcNotice, setRcNotice] = useState([]);

  useEffect(() => {
    console.log('1. OPEN SOCKET')
    console.log(auth.profile);
    opensocket();
    recentNotice(); // ?????? ?????? ????????? ??????
    return() => {
      stompClient.disconnect();
      socket.close();
      exitTimeUpdate(); //chatroom ????????? ?????? ?????? DB??? update
      chatinit(dispatch); //????????? chat?????? ?????????
    }
}, [auth.chatNo]);

  useEffect(() => {
    chatList();
    exitTimeUpdate();

    return() => {
      exitTimeUpdate();
    }
  },[auth.chatNo]);
 
    const messageHandle = (e) =>{
        setContents(e.target.value);
        setTypeState('TEXT');
    }  

    const uploadImage = (e) =>{
      setLoadImg(e.target.files[0]); // ????????? ?????? ??????????????? [0]?????? ???????????????
      setTypeState('IMAGE');
    }

    const messageReset = () =>{
      sendMsgRef.current.value='';
      setContents('');
    }

    const loadImgReset = ()=>{
      sendImgRef.current.value='';
      setLoadImg('');
    }

    // // Spring??? ?????? ?????? ??????
    const loadFileReset = () => { 
      sendFileRef.current.value='';
      setloadFile('');
    }

    // Button ?????? ??? uploadFile
    const uploadFile = (e) => {
      setloadFile(e.target.files[0]);
      setTypeState('FILE'); // switch(typeState){ => case 'FILE':
      // e.target.value =''; // Spring??? ?????? ?????? ??????
    }

    const [soc,setSoc] = useState();

    const opensocket = async() => {
      console.log('2. SOCKET CHAT NO >> ',auth.chatNo);
      if(auth.chatNo){
        stompClient.connect({},function(){
          console.log('link sub socket');
          stompClient.subscribe(`/topic/${auth.chatNo}`,  (message) => {
            const msg =  JSON.parse(message.body);
            
            console.log("3. DATA >>" , msg);
            console.log("subData type!!!!"+msg.type);
            if(msg.type === undefined){
              showCalendar(msg);
            }else{
              showMessage(msg);
            }

            datastate({type: 'STORE_MESSAGE', data: msg});
            sessionStorage.setItem('Data', msg);
            
            
          });
      })
      }
      
        
    }

        //????????? ?????????
    const outChat = async(e) =>{
      console.log("OUTCHAT >>>>>>>", auth.chatNo);
      
     
       const res = await axios.delete(`/TT/talk/topic/${auth.chatNo}`)
                        .then((res) => {
                          console.log("???????????? ?????????chatno topic ????????????");
                          stompClient.disconnect();
                          socket.close();

                        }).catch((err) => {
                          console.log(err);
                        })
                        
        navigate('/tikitaka/main', { replace: true});
    }

    //????????? ????????? time??? ???????????? ??????room list?????? ????????? ????????? ?????? ?????????
    const exitTimeUpdate = async() =>{
      console.log('TIME UPDATE >> ')
      //const time = moment(now()).format('Y-MM-DD HH:mm:ss');
      const data={
        userno:auth.token,
        chatno:auth.chatNo
      }
      const res = await axios.post(`/TT/talk/updateouttime/`, JSON.stringify(data),{headers:{"Content-Type":"application/json", "charset":"UTF-8"}}) 

    }
    const chatinit = (dispatch) => {
      dispatch({type: 'NULL_CHATNO', payload: ""}); //??? ???????????? chatno?????????
      sessionStorage.setItem('currentUser', ''); 
      console.log("chatno??? ?????????")
    }

    // ?????? ?????? ????????? ????????? ?????????
    const recentNotice = async() => {
      console.log('<<< recentNotice ????????? >>>', auth.chatNo);
      const res = await axios.post(`/TT/talk/topic/recentNotice/${auth.chatNo}`,
                                    {headers: {
                                      'Content-Type' : 'application/json',
                                      'Accept' : 'application/json'
                                    }}
      )
      .then((res) => {
        console.log("recentNotice >>>" + JSON.stringify(res.data.data));
        setRcNotice(res.data.data);
      })
    }

    const sendMessage = async (e) => {
      e.preventDefault();
      // const data= {
      //   userNo: auth.token,
      //   name: auth.token,
      //   type: typeState,
      //   chatNo: auth.chatNo,
      //   message: contents,
      //   readCount: 1,
      //   regTime: time        
      // }
      console.log('SEND MESSAGE TO ', auth.chatNo)

      const time = moment(now()).format('YY/MM/DD HH:mm');
    
      switch(typeState){
        case 'TEXT':
          const messageData= {
            userNo: auth.token,
            name: auth.name,
            chatNo: auth.chatNo,
            type: typeState,
            message: contents,
            readCount: 1,
            regTime: time,
          }
          return await axios.post(`/TT/talk/topic`, JSON.stringify(messageData), {headers:{"Content-Type":"application/json", "charset":"UTF-8"}})
                .then((response) => {
                  // showMessage(response);
                  messageReset();
                  return response;
                })
                .catch((err) => {
                  console.log(err);
                })

        case 'IMAGE':
          const formData = new FormData(); 
          formData.append('image', loadImg);
          const result = await axios.post(`/TT/talk/topic/sendimage`, formData, {headers:{"Content-Type":"multipart/form-data", "charset":"UTF-8"}})
                .then((response) => {
                    setImage(response.data); 
                    loadImgReset(); // ????????? ?????? ????????? ?????? ??????
                  return response.data; 
                })
                .catch((err) => {
                  console.log(err);
                });
          const ans = await result;
         
          const imageData = {
            chatNo : JSON.parse(auth.chatNo),
            userNo : auth.token,
            name: auth.name,
            type: typeState,
            message: result,
            readCount: 1,
            regTime: time
          } 
          
          return  axios.post(`/TT/talk/topic`, JSON.stringify(imageData), {headers:{"Content-Type":"application/json", "charset":"UTF-8"}})
                          .then((response) => {
                            console.log("img send: ", response);
                            //showMessage(response);
                            return response;
                          })
                          .catch((err) => {
                            console.log(err);
                          })
          
        case 'FILE':
          const fileData = new FormData(); // FormData?????? ?????? ??? ????????? ??????????????? ???
          // "file" -> key??? => Spring @RequestParam
          fileData.append('file', loadFile); // const [loadImg, setLoadImg] = useState(); 

          // Spring?????? File url??? ??????(fileResult???)?????? 
          const fileResult = await axios.post(`/TT/talk/topic/sendFile`, 
                                        fileData, 
                                        { headers : {"Content-Type":"application/json" , 
                                                     "charset":"UTF-8"}
                                        })
                      .then((response) => {
                        setFile(response.data);
                        loadFileReset(); // Spring??? ?????? ?????? ?????? (????????? ??????????????? ?????? ????????? ???????????????.) 

                        console.log("file response data >>> ", file)

                        return response.data; // Spring - service?????? uuid??? ????????? url ???
                      })
                      .catch((err) => {
                        console.log("fileUpload error >>> ", err)
                      });
          
          const fResult = await fileResult;

          const sendFileData = {
            userNo : auth.token,
            name : auth.name,
            chatNo : JSON.parse(auth.chatNo),
            type : typeState,
            message : fResult,
            readCount : 1,
            regTime : time
          }

          // ????????? ???????????????
          return axios.post(`/TT/talk/topic`, JSON.stringify(sendFileData), 
                            {headers:{"Content-Type":"application/json", "charset":"UTF-8"}})
                .then ((response) => {
                  console.log("file send >>> ", response);

                  return response;
                })
                .catch((err) => {
                  console.log(err);
                })
         
    }




      
    }



    const chatList =  async () =>{
      // auth??? chatNo??? chatNo??? ?????? UserNo??? ?????? ???????????? 
      const chatNo = JSON.parse(auth.chatNo);
      try {
        const res =  await axios.get(`/TT/talk/chatList/${chatNo}`)
                               .then((res)=>{
                                 setMessageList(res.data);
                                 console.log('res.data...' ,res.data);
                                 showList(res.data);
                               })
      } catch (error) {
        console.log(error);
      }
      
    }





    //???????????? ?????????
    const showList = (listData) => {
      listData.map((list) => {
        const time = moment(list.reg_time).format('YY/MM/DD   HH:mm');
        switch(list.type){
          case 'TEXT':
            if(list.user_no === auth.token){
              return $("#chat-room").append("<div id='mybubble'><div id='bubble-name'>"+ list.name+ `<img id='bubble-image' src=http://localhost:8080/TT${auth.profile} ref={imgRef}></img>`
              +"</div><div id='myMessage'>" + list.contents + "<div id='bubble-time'>" + time + "</div></div>"
              + "</div>"
               )
            }else {
              return $("#chat-room").append("<div id='yourbubble'>" +

              "<div id='yourbubble-name'>"
              + list.name 

              + "</div><div id='yourMessage'>" + list.contents + "<div id='bubble-time'>" + time + "</div></div>"
              + "</div>"
               )
            }
          case 'IMAGE':
            if(list.user_no === auth.token){
              return $("#chat-room").append("<div id='mybubble'>"+"<div id='bubble-name'>"  + list.name+ `<img id='bubble-image'  src=http://localhost:8080/TT${auth.profile} ref={imgRef}></img>`  
              + "</div><div id='imgMessage'>" +  `<img id='myimg' src=http://localhost:8080/TT${list.contents} width='250' height='250' ref={imgRef}/>` + "<div id='bubble-time'>" + time + "</div></div>"
              + "</div>"
               );
  

            }else {
              return $("#chat-room").append("<div id='yourbubble'>"+"<div id='yourbubble-name'>"  + list.name  
              + "</div><div id='imgMessage'>" +  `<img id='yourimg' src=http://localhost:8080/TT${list.contents} width='250' height='250' ref={imgRef}/>` + "<div id='bubble-time'>" + time + "</div></div>"
              + "</div>"
              ); 
            }
            
          case 'FILE':
          console.log("FILE UPLOAD ?????????!!")
          if(list.user_no === auth.token){ 
            
            return $("#chat-room").append("<div id='mybubble'>" +
            "<div id='bubble-name'>"
            + list.name+ "</div><div id='fileMessage'>" + "<div> ?????? ???????????? </div> <br> </br>" 
            + `<button id='fileDownButton' onclick='fileDown("` + list.contents + `")'> ???????????? </button>` 
            + "<div id='bubble-time'>" + time + "</div></div>"
            + "</div>"
              );
          } else {
            return $("#chat-room").append("<div id='mybubble'>" +
            "<div id='bubble-name'>"
            + list.name+ "</div><div id='fileMessage'>" + "<div> ?????? ???????????? </div> <br> </br>" 
            + `<button id='fileDownButton' onclick='fileDown("` + list.contents + `")'> ???????????? </button>` 
            + "<div id='bubble-time'>" + time + "</div></div>"
            + "</div>"
              );
          }
          
          
        }
       
      })
      //setRoomCallState(true);
    }
    
    //======================================================================================================
    // ??????????????? ?????????????????? ?????? ????????? 
    window.fileDown = async(contents) => {
      
      console.log('?????? ???????????? ????????? >>>>>', contents)

  
      // const res =  await axios.get(`/TT/talk/topic/getFileData${contents}`, 
      //                       JSON.stringify(sendFileData),
      //                        {headers:{"Content-Type":"application/json", 
      //                        "charset":"UTF-8"}})
      
      //                          .then((res)=>{
      //                            console.log('getFileData' ,res.data);
      //                          })

      const fd = {
        url : contents
      }

      const res =  await axios.post(`/TT/talk/topic/getFileData/`, 
                            JSON.stringify(fd),
                            {headers: {
                              'Content-Type' : 'application/json',
                              'Accept' : 'application/json'
                            }}
                            )
                            .then((res)=>{
                              console.log('getFileData >>>> ' ,res.data);
                            })
                               

      // const res = await axios.post(`/TT/talk/topic/recentNotice/${auth.chatNo}`,
      //                               {headers: {
      //                                 'Content-Type' : 'application/json',
      //                                 'Accept' : 'application/json'
      //                               }}

      // let binary = base64.decode(json.data);
      // let blob = new Blob([new String(binary)], {type: "text/plain;charset=utf-8"});
      // saveAs(blob, file.name);                         

      // const blob = new Blob([content], {type: 'text/plain'})
      // const url = window.URL.createObjectURL(blob)
      // const a = document.createElement("a")
      // a.href = url
      // a.download = `${this.$store.state.nickname}_${this.title}.md`
      // a.click()
      // a.remove()
      // window.URL.revokeObjectURL(url);

      

      axios({
        url: `http://localhost:9988/TT${contents}`,
        method: 'GET',
        responseType: 'blob', // important
      }).then((response) => {
        console.log('?????? ??????? >>>> ',response.data )
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'file.txt');
        document.body.appendChild(link);
        link.click();
      });


    }

    const showMessage = (msg) =>{
      // const result = JSON.parse(response.config.data);

      switch(msg.type){
        case 'TEXT':
           if(msg.userNo === auth.token){

             return $("#chat-room").append("<div id='mybubble'>" +
             "<div id='bubble-name'>"
             + msg.name+ `<img id='bubble-image'  src=http://localhost:8080/TT${auth.profile} ref={imgRef}></img>`  
             + "</div><div id='myMessage'>" + msg.contents + "<div id='bubble-time'>" + msg.regTime + "</div></div>"
             + "</div>"
              );
          
          }else if(auth.token !== msg.userNo){
            return $("#chat-room").append("<div id='yourbubble'>" +

            "<div id='yourbubble-name'>"
            + msg.name  

            + "</div><div id='yourMessage'>" + msg.contents + "<div id='bubble-time'>" + msg.regTime + "</div></div>"
            + "</div>"
             );

          }

        case 'IMAGE':
          if(msg.userNo === auth.token){
            return $("#chat-room").append("<div id='mybubble'>"+"<div id='bubble-name'>"  + msg.name+ `<img id='bubble-image'  src=http://localhost:8080/TT${auth.profile} ref={imgRef}></img>`  
            + "</div><div id='imgMessage'>" +  `<img id='myimg' src=http://localhost:8080/TT${msg.contents} width='250' height='250' ref={imgRef}/>` + "<div id='bubble-time'>" + msg.regTime + "</div></div>"
            + "</div>"
             );

          }else{

            return $("#chat-room").append("<div id='yourbubble'>"+"<div id='yourbubble-name'>"  + msg.name 

              + "</div><div id='imgMessage'>" +  `<img id='yourimg' src=http://localhost:8080/TT${msg.contents} width='250' height='250' ref={imgRef}/>` + "<div id='bubble-time'>" + msg.regTime+ "</div></div>"
              + "</div>"
               );
  
          }

        case 'FILE':
          console.log("FILE UPLOAD ?????????!!")
        
          if(msg.userNo === auth.token){ 
            return $("#chat-room").append("<div id='mybubble'>" +
            "<div id='bubble-name'>"
            + msg.name+ "</div><div id='fileMessage'>" + "<div> ?????? ???????????? </div>"  
            + `<button id='fileDownButton' onclick='fileDown("` + msg.contents + `")'> ???????????? </button>`
            + "<div id='bubble-time'>" + msg.regTime + "</div></div>"
            + "</div>"
             );
         } else if(auth.token !== msg.userNo){
            return $("#chat-room").append("<div id='yourbubble'>" +
            "<div id='bubble-name'>"
            + msg.name + "</div><div id='fileMessage'>" + "<div> ?????? ???????????? </div>" 
            + `<button id='fileDownButton' onclick='fileDown("` + msg.contents + `")'> ???????????? </button>`
            + "<div id='bubble-time'>" + msg.regTime + "</div></div>"
            + "</div>");
          }
        

          case 'CONTACT':
            if(msg.userNo === auth.token){

              return $("#chat-room").append("<div id='myContact'>"
                                            + "<div id='con-head'> <p> ????????? <p> </div> <br /> "
                                            + "<div id='con-body>"
                                            + "<div id='con-text'>"
                                            + "<p><strong> ?????? : </strong>" + msg.name + "</p>"
                                            + "<p><strong> ???????????? : </strong>" + msg.contents + "</p>"
                                            + "</div> </div> </div>"
              );
           
           }else if(auth.token !== msg.userNo){
            return $("#chat-room").append("<div id='yourContact'>"
                                          + "<div id='con-head'> <p> ????????? <p> </div> <br /> "
                                          + "<div id='con-body>"
                                          + "<div id='con-text'>"
                                          + "<p><strong> ?????? : </strong>" + msg.name + "</p>"
                                          + "<p><strong> ???????????? : </strong>" + msg.contents + "</p>"
                                          + "</div> </div> </div>"
            );
 
           }  

      }
      
      
    }
  
    // const authNo = no;
    // //const fuserNo = res.data.userNo; // response???????????? userNo ??????????????? ??? userNo??? ?????????????????? ????????? ????????? ????????????
  
  
  // const authNo = no;
  // //const fuserNo = res.data.userNo; // response???????????? userNo ??????????????? ??? userNo??? ?????????????????? ????????? ????????? ????????????
  //                                 // ????????? ???????????? ????????? ??????


  


  //--------------------------------------------------
  // modal open
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };


  //--------------------------------------------------
  // contact Modal
  const [ctState, setCtState] = React.useState(false);
  const openContact = () => {
    setCtState(true);
  }
  const closeContact = () => {
    setCtState(false);
  }
  //--------------------------------------------------
  const sendContact = async (contactData) => {

    const cData = {
      authNo : auth.token, // Long
      chatNo : auth.chatNo, // Long
      userName : contactData.userName.name, // String
      userPhone : contactData.userPhone.phone // String
    }

    
    return await axios.post(`/TT/talk/topic/sendContact`, 
                            JSON.stringify(cData), 
                            {headers:
                              {"Content-Type":"application/json", "charset":"UTF-8"}
                            })
                      .then((response) => {

                      messageReset();
                      return response;
                    })
                    .catch((err) => {
                      console.log(err);
                    })
    }

    
  



  
  
  //--------------------------------------------------
  const [calState, setCalstate] = React.useState(false);
  const calClose = () =>{
    setCalstate(false);
  }
  const openCalendar = ()=>{
    setCalstate(true);
  }

  // ========================

  const sendCalendar = async (data) =>{
    const calData = {
      chatNo: auth.chatNo,
      userNo: auth.token,
      title: data.title,
      contents: data.contentsCal,
      startDate: data.startDate,
      endDate: data.endDate
    }
    const response = await axios.post('/TT/talk/topic/addCalendar', calData);
  }
  
  const showCalendar = (cal) =>{
    if(auth.token === cal.userNo){
      return $("#chat-room").append("<div id='myCal'><p>????????????</p>" +
                                    "<div id='cal-body'>"+ "<div id='cal-text'>" +
                                    "<p><strong>??????:&nbsp;</strong>"+ `${cal.title}</p>` + 
                                    "<p><strong>??????:&nbsp;</strong>"+ `${cal.contents}</p>` +
                                    "<p><strong>?????????:&nbsp;</strong>"+ `${cal.startDate}</p>` +
                                    "<p><strong>?????????:&nbsp;</strong>"+ `${cal.endDate}</p>` +
                                +"</div></div></div>");
    } else {
      return $("#chat-room").append("<div id='yourCal'><p>????????????</p>" +
                                    "<div id='cal-yourbody'>"+ "<div id='cal-text'>" +
                                    "<p><strong>??????:&nbsp;</strong>"+ `${cal.title}</p>` + 
                                    "<p><strong>??????:&nbsp;</strong>"+ `${cal.contents}</p>` +
                                    "<p><strong>?????????:&nbsp;</strong>"+ `${cal.startDate}</p>` +
                                    "<p><strong>?????????:&nbsp;</strong>"+ `${cal.endDate}</p>` +
                                +"</div></div></div>");
    }
    
  }

  const callback = (data) =>{
    calClose();
    data.startDate = moment(data.startDate).format('YY/MM/DD HH:mm');
    data.endDate = moment(data.endDate).format('YY/MM/DD HH:mm');
    sendCalendar(data);
  }  


  const scrollToBottom = ()=>{
    const rollfick = document.getElementById("chat-room");

    rollfick.scrollIntoView(false);
    scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }

  useEffect(()=>{
    scrollToBottom();
  })

  const contactCallback = (data) => {
    closeContact(); // cantact Modal ????????????
    sendContact(data);   
  }
  


    return (
      <Card sx={{ minWidth: 275 }}>


      <CardHeader
        title={auth.title}
      >
        
      </CardHeader>


      <CardContent id='room-top'>
        {/* chatNo??? ???????????? ???????????? ?????? ?????? ???????????? ????????? ????????? ????????? 
            no (noticeNo), reg_date, contents, name, title*/}
        {rcNotice.map((rclist)=> {
          return(
            <div>
            <h4>?????? ?????? ?????? </h4>  
            <h5>?????? : {rclist.title} <br / > ?????? : {rclist.contents} </h5> 
            {/* <h5>????????? : {rclist.name} / ????????? : {rclist.reg_date} </h5> */}
            </div>
          ); 
         
        }
        )
      }
        
      </CardContent>
      <CardContent id='room' sx={{ width:'100%' , height:"70vh"}}>
      <Scrollbar sx={{ height: { xs: 500, sm: 600 } }}>
        <div id='chat-room' ref={scrollRef}>
        
        </div>  
      </Scrollbar>
      </CardContent>
      <CardContent id='room-bottom'>
      <form style={{alignItems: "center"}}>
      <Box
        sx={{
          display: 'flex',
          position:'abslolute',
          flexDirection: 'row',
          alignItems: 'center',
          '& > *': {
            m: 1,
          },
        }}
      >
        <ButtonGroup variant='string'>
          {/* ?????? >>> Button, Modal */}
          <div>
            <Button onClick={handleOpen}>
              <ArticleIcon sx={{ width: 40, height: 40}} />
            </Button>
                <Modal
              open={open}
              onClose={handleClose}
              aria-labelledby="parent-modal-title"
              aria-describedby="parent-modal-description"
            >
              <ChatNotice handleClose={handleClose} recentNotice={recentNotice}/>
            </Modal>
          </div>
          

          {/* ????????? >>> Button, Modal */}
          <div>
          <Button onClick={openContact}>
            <AssignmentIndIcon sx={{ width: 40, height: 40}} />
          </Button>
          <Modal
                open={ctState}
                onClose={closeContact}
              >
              {/* callback??? close ?????? */}
              <UserContact contactCallback={contactCallback} closeContact={closeContact}/>
          </Modal>
          </div>

          {/* ????????? ????????? */}
          <Button >
            <label for='input-file'><ImageIcon sx={{ width: 40, height: 40}}/></label>
            <input id='input-file' type='file' accept='images/*' onChange={uploadImage} ref={sendImgRef} style={{display:"none"}}/>
          </Button>

          {/* ?????? ????????? */}
          <Button>
            <label for='input-file2'><UploadFileRoundedIcon sx={{ width: 40, height: 40}} /></label>
            {/* input????????? accept : ????????? ???????????? ??? ?????? ????????? ????????? ?????? */}
            <input id='input-file2' type='file' accept='text/plain' onChange={uploadFile} ref={sendFileRef} style={{display:"none"}}/>
          </Button>

          {/* ????????? */}
          <div>
            <Button onClick={openCalendar}>
              <CalendarIcon sx={{ width: 40, height: 40}} />
            </Button>
            <Modal open={calState}
                   onClose={calClose}>
              <Calendar callback={callback} calClose={calClose}/>
            </Modal>
          </div>
          
        </ButtonGroup>
        <TextField
          inputMode
          hiddenLabel
          id="textWindow"
          placeholder='???????????? ???????????????.'
          variant="outlined"
          style={{align:"center" , width: '40%'}}
          type='text'
          name="message"
          value={contents}
          onChange={messageHandle}
          ref = {sendMsgRef}
        />
       
       
      <Button variant="contained" style={{position: 'absolute', right:110 ,bottom: 40}} size="large" endIcon={<SendIcon />} onClick={(e) => {
        sendMessage(e);
        exitTimeUpdate();
        }}>
        Send
      </Button>
      <Button variant="outlined" style={{position: 'absolute', right:0, bottom: 40}}  size="medium" startIcon={<LogoutIcon />} onClick={() => {
        chatinit(dispatch);
        outChat(); 
        }}>
        ?????????
      </Button>

      
       
        </Box>
        </form>
      </CardContent>
    </Card>
  );
};

export default ChatRoom;