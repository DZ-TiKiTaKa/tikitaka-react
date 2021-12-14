/* eslint-disable */ 

import React, {useState, useEffect } from 'react';
import './components.css';
import './style.css';
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Button from '@mui/material/Button';
// import SendIcon from '@mui/icons-material/Send';
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TextField from '@mui/material/TextField';
import { green } from '@mui/material/colors';
import Icon from '@mui/material/Icon';
import axios from 'axios';
import { useAuthState } from 'src/Context';
import ButtonGroup from '@mui/material/ButtonGroup';
import Box from '@mui/material/Box';
import ImageIcon from '@mui/icons-material/Image';
import UploadFileRoundedIcon from '@mui/icons-material/UploadFileRounded';
import ArticleIcon from '@mui/icons-material/Article';
import AssignmentIndIcon from '@mui/icons-material/AssignmentInd';
import RoomIcon from '@mui/icons-material/Room';
import EmojiEmotionsIcon from '@mui/icons-material/EmojiEmotions';

import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import { Block } from '@mui/icons-material';
import { Air } from '@mui/icons-material';

const ChatRoom = () => {
    const [contents, setContents] = useState();
    const auth = useAuthState();


    const chatinfo= {
      userNo: auth.token
    }

    // useEffect(()=>{
    //   getmessage();
    // },[])



    // const getmessage = async() => {
    //   try{
    //     console.log('데이터 보내버렷',chatinfo.chatNo);
    //     const res = await axios.post('/TT/talk/getmsg', JSON.stringify(chatinfo),{headers:{"Content-Type":"application/json"}})
    //     .then((res) => {
    //       console.log('data test', res)
    //       if(res.statusText !== "OK"){
    //         throw `${res.status} ${res.statusText}`
    //       }
    //     })
    //   }catch{

    //   }
    // }


    const [state,setState] = useState(false)
  

    const messageHandle = (e) =>{
        setContents(e.target.value);
    }  
     
    

    const sendMessage = async (e) => {
      e.preventDefault();
      const data= {
        userNo: auth.token,
        name: auth.token,

        chatNo: auth.chatNo,

        message: contents,
        readCount: 1
      }

      //  **순서: 채널추가 -> 해당채널번호로 메시지 전송 -> 채널삭제 / 채널리스트 출력(한개씩 주석풀면서 테스트해보면)

      

      //메시지 보내기
      const res = await axios.post(`/TT/talk/topic`, JSON.stringify(data), {headers:{"Content-Type":"application/json", "charset":"UTF-8"}})
      .then((response) => {
        console.log("msg send: ", response);
        return response;
      })
      .catch((err) => {
        console.log(err);
      })
      
      // //사용자의 연결되어있는 채팅리스트를 출력
      // const res = await axios.get(`/TT/talk/topic`)
      //                   .then((res) => {
      //                     const channellist = res.data;
      //                     console.log("추후 채팅목록에 사용:"+ channellist);
      //                   }).catch((err)=>{
      //                     console.log(err);
      //                   })
      
      // //채팅방 나가기
      // const res = await axios.delete(`/TT/talk/topic/${data.chatNo}`)
      //                   .then((res) => {
      //                     console.log("사용자가 선택한chatno 채팅방 나가기"+res);
      //                   }).catch((err) => {
      //                     console.log(err);
      //                   })
              
    }

    const chatList =  (no) =>{
      // auth의 chatNo로 chatNo가 가진 UserNo을 모두 가져오기 
      // try {
      //   const res = await axios.get(`/TT/talk/chatList/${chatNo}`)
      //                          .then((res)=>{
      //                            console.log(res);
      //                          })
      // } catch (error) {
      //   console.log(error);
      // }
      const authNo = no;
      //const userNo = res.data.userNo; // response데이터의 userNo 변수로저장 후 userNo와 현재로그인한 유저의 번호를 비교하여
                                      // 화면에 채팅창을 나눠서 표시
      return(
            <div>
            {
              authNo === 6 
              ? 
              <ListItem style={{width: 400, border: '1px solid black', borderRadius: '10px', backgroundColor: 'greenyellow'}}>
                <ListItemText>내가보낸 메세지내가보낸 메세지</ListItemText> 
              </ListItem> 
              :
              <ListItem style={{width: 400, border: '1px solid black', borderRadius: '10px', backgroundColor: 'skyblue'}}>
                <ListItemText>니가보낸 메세지내가보낸 메세지</ListItemText>
              </ListItem> 
            }
            </div>
          
      )
    }
  
    
    useEffect(()=>{
      chatList(auth.token);
    },[])

    return (
      <Card sx={{ minWidth: 275 }}>
      <CardContent style={{borderBottom: "2px solid gray"}}>
        <h1>채팅방 이름, 검색창</h1>
      </CardContent>
      <CardContent sx={{ width: 600 , height:450}}>
        <List>
          {chatList()}
        </List>
      
        
      </CardContent>
      <CardContent style={{ borderTop: "2px solid gray", margin: 10, padding: 10}}>
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
          <Button>
            <ArticleIcon sx={{ width: 40, height: 40}} />
          </Button>
          <Button>
            <AssignmentIndIcon sx={{ width: 40, height: 40}} />
          </Button>
          <Button>
            <ImageIcon sx={{ width: 40, height: 40}} />
          </Button>
          <Button>
            <UploadFileRoundedIcon sx={{ width: 40, height: 40}} />
          </Button>
          <Button>
            <RoomIcon sx={{ width: 40, height: 40}} />
          </Button>
        </ButtonGroup>
        <TextField
          inputMode
          hiddenLabel
          id="textWindow"
          placeholder='메시지를 입력하시오.'
          variant="outlined"
          style={{align:"center" , width: '50%'}}
          type='text'
          name="message"
          onChange={messageHandle}
          
        />
        <Button>
            <EmojiEmotionsIcon sx={{ position: 'absolute', width: 40, height: 40}} />
          </Button>
        <Button type='submit' variant="contained" style={{position: 'absolute', right:200}} size="large" onClick={sendMessage}>
          보내기
        </Button>
        </Box>
        </form>
      </CardContent>
    </Card>
  );
};

export default ChatRoom;