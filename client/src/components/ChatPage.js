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
  const {setCurId}=usrcntxt;

  const logout=()=>{
    localStorage.removeItem('token');
    localStorage.removeItem('id');
    setCurId(null);
     navigate("/");
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
                  <a className="text-reset me-3" href="/">
                    <span><i className="fa-solid fa-envelope"></i></span>
                    <span className="badge rounded-pill badge-notification bg-danger">1</span>
                  </a>

                  <div className="dropdown">
                    <a className="text-reset me-3 dropdown-toggle hidden-arrow" href="/" id="navbarDropdownMenuLink"
                      role="button" data-mdb-toggle="dropdown" aria-expanded="false">
                      <i className="fas fa-bell"></i>
                    </a>
                    <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="navbarDropdownMenuLink">
                      <li><a className="dropdown-item" href="/">Some news</a></li>
                      <li><a className="dropdown-item" href="/">Another news</a></li>
                      <li>
                        <a className="dropdown-item" href="/">Something else here</a>
                      </li>
                    </ul>
                  </div>

                  <div className="dropdown">
                    <a className="text-reset dropdown-toggle me-3 hidden-arrow" href="/" id="navbarDropdown" role="button"
                      data-mdb-toggle="dropdown" aria-expanded="false">
                      <i onClick={logout} className="fas fa-sign-out-alt"></i>
                    </a>
                    <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="navbarDropdown">
                      <li>
                        <a className="dropdown-item" href="/"><i className="united kingdom flag"></i>English
                          <i className="fa fa-check text-success ms-2"></i></a>
                      </li>
                      <li>
                        <hr className="dropdown-divider" />
                      </li>
                      <li>
                        <a className="dropdown-item" href="/"><i className="poland flag"></i>Polski</a>
                      </li>
                      <li>
                        <a className="dropdown-item" href="/"><i className="china flag"></i>中文</a>
                      </li>
                      <li>
                        <a className="dropdown-item" href="/"><i className="japan flag"></i>日本語</a>
                      </li>
                      <li>
                        <a className="dropdown-item" href="/"><i className="germany flag"></i>Deutsch</a>
                      </li>
                      <li>
                        <a className="dropdown-item" href="/"><i className="france flag"></i>Français</a>
                      </li>
                      <li>
                        <a className="dropdown-item" href="/"><i className="spain flag"></i>Español</a>
                      </li>
                      <li>
                        <a className="dropdown-item" href="/"><i className="russia flag"></i>Русский</a>
                      </li>
                      <li>
                        <a className="dropdown-item" href="/"><i className="portugal flag"></i>Português</a>
                      </li>
                    </ul>
                  </div>

                  <div className="dropdown">
                    <a className="text-reset dropdown-toggle d-flex align-items-center hidden-arrow" href="/"
                      id="navbarDropdownMenuLink" role="button" data-mdb-toggle="dropdown" aria-expanded="false">
                      <img src="https://mdbootstrap.com/img/new/avatars/5.jpg" className="rounded-circle" height="22" alt=""
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
        <MessagePage/>
        <div className="DetailsBox mx-4" >
            <Description/>
        </div>
      </div>}
      { width <=800 &&
        <div className='mainChat2'>
        <div className="chatlist3" >
          <MessageBox />
        </div>
      </div>
      }
    </div>
  )
}

export default ChatPage  