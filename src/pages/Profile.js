/* eslint-disable */ 

import Avatar from "@mui/material/Avatar";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import { styled } from "@mui/material/styles";
import Badge from "@mui/material/Badge";
import { Container, Typography } from "@mui/material";
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';    

const StyledBadge = styled(Badge)(({ theme }) => ({
  "& .MuiBadge-badge": {
    backgroundColor: "#44b700",
    color: "#44b700",
    boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
    "&::after": {
      position: "absolute",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      borderRadius: "50%",
      animation: "ripple 1.2s infinite ease-in-out",
      border: "1px solid currentColor",
      content: '""'
    }
  },
  "@keyframes ripple": {
    "0%": {
      transform: "scale(.8)",
      opacity: 1
    },
    "100%": {
      transform: "scale(2.4)",
      opacity: 0
    }
  }
}));

const changeProfile = function(e){
    e.preventDefault();

    window.location.href="/changeProfile"
}

const ContentStyle = styled('div')(({ theme }) => ({
    maxWidth: 480,
    margin: 'auto',
    display: 'flex',
    minHeight: '100vh',
    flexDirection: 'column',
    justifyContent: 'center',
    paddingBottom: '300px',
  }));



const profile = 
    {
        no: "11-11-11-11",
        company: "부산지사",
        dept: "개발1팀",
        position: "사원",
        phone:"010-1234-5678"
    }

export default function main() {
  return (
    <Container>
        <ContentStyle>
        
        <Card sx={{ maxWidth: 500 }} align="center" >
            <CardContent>
                <StyledBadge
                    overlap="circular"
                    anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                    variant="dot"
                >
                    <Avatar alt="hi" src="" sx={{ width: 100, height: 100 }} />
                </StyledBadge>

                <Typography
                    variant="h5"
                    component="div"
                    borderBottom="solid 1px gray"
                >
                    <Box
                        component="form"
                        sx={{
                        '& > :not(style)': { m: 1, width: '25ch' },
                        }}
                        noValidate
                        autoComplete="off"
                        >
                        <TextField id="outlined-basic" label="사원번호:" variant="outlined" value={profile.no} Read Only/>
                    </Box>
                </Typography>
                <Typography
                    variant="h5"
                    component="div"
                    borderBottom="solid 1px gray"
                >
                    <Box
                        component="form"
                        sx={{
                        '& > :not(style)': { m: 1, width: '25ch' },
                        }}
                        noValidate
                        autoComplete="off"
                        >
                        <TextField id="outlined-basic" label="근무지사:" variant="outlined" value={profile.company} Read Only/>
                    </Box>
                </Typography>
                <Typography
                    variant="h5"
                    component="div"
                    borderBottom="solid 1px gray"
                >
                <Box
                        component="form"
                        sx={{
                        '& > :not(style)': { m: 1, width: '25ch' },
                        }}
                        noValidate
                        autoComplete="off"
                        >
                        <TextField id="outlined-basic" label="부서:" variant="outlined" value={profile.dept} Read Only/>
                    </Box>
                </Typography>
                <Typography
                    variant="h5"
                    component="div"
                    borderBottom="solid 1px gray"
                >
                    <Box
                        component="form"
                        sx={{
                        '& > :not(style)': { m: 1, width: '25ch' },
                        }}
                        noValidate
                        autoComplete="off"
                        >
                        <TextField id="outlined-basic" label="직책:" variant="outlined" value={profile.position} Read Only/>
                    </Box>
                </Typography>
                <Typography
                    variant="h5"
                    component="div"
                    borderBottom="solid 1px gray"
                >
                    <Box
                        component="form"
                        sx={{
                        '& > :not(style)': { m: 1, width: '25ch' },
                        }}
                        noValidate
                        autoComplete="off"
                        >
                        <TextField id="outlined-basic" label="전화번호:" variant="outlined" value={profile.phone} Read Only/>
                    </Box>
                </Typography>
                </CardContent>
                <CardActions>
                <Button variant="contained" onClick={changeProfile}>프로필 변경</Button>
                </CardActions>
            </Card>
           
        </ContentStyle>
    </Container>    
  
  );
}
