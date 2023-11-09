import React from 'react'
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { useState } from 'react';
import Form from 'react-bootstrap/Form';
import { uploadAllVideo } from '../services/allAPI';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


function Add({setUploadVideoStatus}) {
    const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const [video, setVideo] = useState({
    id : "" ,
    caption : "" , 
    url : "",
    embedLink : ""
  })

//console.log(video)

const embedVideoLink=(e)=>{
  const {value} = e.target
  console.log(value.slice(-11));
  const link = `https://www.youtube.com/embed/${value.slice(-11)}`
  setVideo({...video,embedLink:link})
}
console.log(video);

const handleUpload = async ()=>{
  const {id,caption,url,embedLink} = video
  if(!id || !caption || !url || !embedLink){
    toast.warning('Please fill the form completely')
  }else{
    const response = await uploadAllVideo(video)
    console.log(response);
    if(response.status>=200 && response.status<300){
      toast.success(`${response.data.caption} is succeefully uploaded`)

      //to change value of uploadVideoStatus
      setUploadVideoStatus(response.data)

      //making the state value none
      setVideo({
        id : "" ,
        caption : "" , 
        url : "",
        embedLink : ""
      })

      //to close the modal
      handleClose()
    }
    else{
      console.log(response);
      toast.error('something went wrong. Try again later.')

    }
  }
}

  return (
    <>
        <div className='d-flex align-items-center'> 
            <h5>Upload new video</h5>
            <button onClick={handleShow} className='btn'><i class="fa-solid fa-cloud-arrow-up fa-2x"></i></button>
        </div>

        <Modal
        show={show}
        onHide={handleClose}
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header closeButton>
          <Modal.Title><i class="fa-solid fa-film text-warning me-2"></i>Upload videos</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Please fill the form completely</p>
          <form action="" className='border border-secondary rounded p-2 '>

           <Form.Group className="mb-3" controlId="formBasicEmail">
             <Form.Control type="email" placeholder="Enter Video ID" onChange={(e)=>setVideo({...video,id:e.target.value})} />
           </Form.Group>

           <Form.Group className="mb-3" controlId="formBasicEmail">
            <Form.Control type="email" placeholder="Enter Video Caption" onChange={(e)=>setVideo({...video,caption:e.target.value})} />
           </Form.Group>

           <Form.Group className="mb-3" controlId="formBasicEmail">
            <Form.Control type="email" placeholder="Enter Video Image URL" onChange={(e)=>setVideo({...video,url:e.target.value})}/>
           </Form.Group>

          <Form.Group className="mb-3" controlId="formBasicEmail">
            <Form.Control type="email" placeholder="Enter Youtube Video Link" onChange={embedVideoLink} />
           </Form.Group>

          </form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Cancel
          </Button>
          <Button variant="warning" onClick={handleUpload}>Upload <i class="fa-solid fa-cloud-arrow-up"></i></Button>
        </Modal.Footer>
      </Modal>
      <ToastContainer position='top-center' theme='colored' autoClose={2000} />
    </>
  )
}

export default Add

{/* <iframe width="956" height="538" src="https://www.youtube.com/embed/WWr9086eWtY" title="LEO - Ordinary Person Lyric | Thalapathy Vijay, Anirudh Ravichander, Lokesh Kanagaraj, NikhitaGandhi" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe> */}