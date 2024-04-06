import React, { useContext } from 'react'
import "./Chatpage.css"
import MessageBox from "./MessageBox"
import Description from './Description'
import { useNavigate } from 'react-router-dom'
import MessagePage from './MessagePage'
import userContext from '../contexts/users/UserContext'

// import { Button } from 'primereact/button';


function ChatPage() {

  const width=window.innerWidth;


  const navigate=useNavigate();
  const usrcntxt=useContext(userContext);
  const {setSocket,setallUsers,setCurId,setuser,selected,curuser,setSelected,setmessages,setOnlineUsers,setcuruser}=usrcntxt;

  const logout=()=>{
    localStorage.removeItem('token');
    localStorage.removeItem('id');
    setCurId(null);
    setSelected(null);
    setmessages(null);
    setcuruser(null);
    // setOnlineUsers([]);
    setuser(null);
    // setallUsers([]);
    // setSocket(null);
     navigate("/login");
  }

  return (
    <div className='Container'>
      {/* <div className='navbar'> */}
      <header className=" mainheader mb-4">
        <div className="p-3 text-center">
          <div className="container">
            <div className="row">
              <div className="col-md-4 d-flex justify-content-center justify-content-md-start mb-3 mb-md-0">
                <a href="/!" className="ms-md-2">
                  <img src="/logo.png" alt='' height="35" style={{ backgroundPosition: "", scale: "2" }} />
                </a>
                <h3 className='mx-4'>ChatApp</h3>
              </div>

              <div className="col-md-4">
                <form className="d-flex input-group w-auto my-auto mb-3 mb-md-0">
                  <input autocomplete="off" type="search" className="form-control rounded" placeholder="Search" />
                  <span className="input-group-text border-0 d-none d-lg-flex"><i className="fas fa-search"></i></span>
                </form>
              </div>

              <div className="col-md-4 d-flex justify-content-center justify-content-md-end align-items-center">
                <div className="d-flex">
                  <a className="text-reset me-3" href="/chatpage">
                    <span><i className="fa-solid fa-envelope"></i></span>
                    <span className="badge rounded-pill badge-notification bg-danger">1</span>
                  </a>

                  <div className="dropdown">
                    <a className="text-reset me-3 dropdown-toggle hidden-arrow" href="/" id="navbarDropdownMenuLink"
                      role="button" data-mdb-toggle="dropdown" aria-expanded="false">
                      <i className="fas fa-bell"></i>
                    </a>
                  </div>

                  <div className="dropdown">
                    <a className="text-reset dropdown-toggle me-3 hidden-arrow" href="/" id="navbarDropdown" role="button"
                      data-mdb-toggle="dropdown" aria-expanded="false">
                      <i onClick={(e)=>{
                        e.preventDefault();
                        logout();
                      }} className="fas fa-sign-out-alt"></i>
                    </a>
                  </div>

                  <div className="dropdown">
                    <a className="text-reset dropdown-toggle d-flex align-items-center hidden-arrow" href="/"
                      id="navbarDropdownMenuLink" role="button" data-mdb-toggle="dropdown" aria-expanded="false">
                      <img src={curuser?.picture} className="rounded-circle" height="22" alt=""
                        loading="lazy" />
                    </a>
                    <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="navbarDropdownMenuLink">
                      <li><a className="dropdown-item" href="/">My profile</a></li>
                      <li><a className="dropdown-item" href="/">Settings</a></li>
                      <li><a className="dropdown-item" href="/">Logout</a></li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>
      {/* </div> */}
      {width>800 && <div className='mainChat'>
        <div className="chatlist1" >
          <MessageBox />
        </div>
        <MessagePage dis={0}/>
        {/* <div  > */}
            <Description/>
        {/* </div> */}
      </div>}
      { width <=800 &&
        <div className='mainChat2'>
        <div className="chatlist3" >
          {selected?<MessagePage dis={1}/>:<MessageBox />}
        </div>
      </div>
      }
    </div>
  )
}

export default ChatPage  