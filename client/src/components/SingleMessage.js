import React, { useContext } from 'react'
import "./SingleMessage.css";
import userContext from '../contexts/users/UserContext';

function SingleMessage(props) {

    const usrcntxt=useContext(userContext);
    const {curId,user,curuser}=usrcntxt;
    const ThisUser=(props.Sid===curId)?curuser:user;
  // if(curId==props.Sid){
    // console.log(ThisUser);
  // }
  // console.log(ThisUser)
  // console.log(props.Sid,curId);
  return (
    <div className={` singleMsg ${((props.Sid===curId)?'rightCli':'leftCli')}`}  >
      <div className='messageInside'>
      <img src={ThisUser?ThisUser.picture:""} alt='' style={{width:"50px",height:"50px"}}/>
      <p className='px-3'>
        {props.message}
        </p>
      </div>
      </div>
  )
}   

export default SingleMessage