import React, { useContext } from 'react'
import "./Description.css"
import "./Description.css"
import userContext from '../contexts/users/UserContext'
function Description() {
const usrcntxt=useContext(userContext);
const {user}=usrcntxt;
// console.log(user)
  return (
    <div className="DetailsBox mx-4">
      <h3 className='desHead'>Description</h3>
     {user &&
      <>
      <img src={user?user.picture:"google.com"} alt='' className='desImg'/>
      <h4 className='detailsItem'>Name: {user.name}</h4>
      <h5 className='detailsItem'>Contact: {user.number}</h5>
      <h5 className='detailsItem'>Email: {user.email}</h5>
      </>}
     {!user &&
      <>
      Details of the Selected User will Display here.
      </>}
    </div>
  )
}

export default Description