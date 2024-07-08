import React from 'react'
import { MdErrorOutline } from 'react-icons/md';

const Error = ({text}) => {
  return (
    text && <div style={{color:'#e91e63', marginTop:'5px', fontSize:'15px', display:'flex', alignItems:'center'}}><MdErrorOutline/> <span style={{marginLeft:'10px'}}>{text}</span></div>
    )
}

export default Error;