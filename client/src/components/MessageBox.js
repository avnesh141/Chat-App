import * as React from 'react';
import Paper from '@mui/material/Paper';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemText from '@mui/material/ListItemText';
import Avatar from '@mui/material/Avatar';
import "./MessageBox.css"
import { useContext } from 'react';
import userContext from '../contexts/users/UserContext';
  

export default function BottomAppBar() {
  const usercntxt=useContext(userContext);

  const { onlineUsers,selected,setSelected,users,curId}=usercntxt
 
  return (
    <div className="msgBx">
        <Paper square sx={{ pb: '50px' }}>
            <h3 className='pb-2 p-2 mx-4 gutterBottom'>Inbox</h3>
          <List sx={{ mb: 2 }}>
            {users && users.map(({ _id, name, email, picture }) => (
              <div key={_id} className='entity-row' style={{backgroundImage:`${selected===_id?'rgb(238,174,202)':'linear-gradient(to right, #92fe9d 0%, #00c9ff 100%)'}`}} onClick={()=>{
                setSelected(_id);
              }} >
                <React.Fragment key={_id}>
                  <ListItemButton>
                    <ListItemAvatar>
                     { onlineUsers.includes(_id) && <span className="badge rounded-pill badge-notification bg-danger">o</span>}
                      <Avatar alt="Profile Picture" src={picture} />
                    </ListItemAvatar>
                    <ListItemText className='nameAndEmail' primary={`${_id==curId?name+"(You)":name}`} secondary={email} />
                  </ListItemButton>
                </React.Fragment>
              </div>
            ))}
          </List>
        </Paper>
    </div>
  );
}
