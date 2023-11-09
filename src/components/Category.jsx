import React from 'react'
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { useState } from 'react';
import Form from 'react-bootstrap/Form';
import { addCategory, deleteCategory, getAVideo, getAllCategory, updateCategory } from '../services/allAPI';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useEffect } from 'react';
import { Row,Col} from 'react-bootstrap';
import VideoCard from './VideoCard';


function Category() {
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const [categoryName , setCategoryName] = useState({});

  const [allCategory , setAllCategory] = useState([])


  //function to add category
  const handleAddCategory = async()=>{
    console.log(categoryName);
    if(categoryName){
      let body = {
        categoryName,
        allVideos : []
      }
      //make api call
      const response = await addCategory(body)
      console.log(response);
      if(response.status>=200 && response.status<300){
        toast.success('Category added successfylly')
        //to make the modal null after succesfull addition
        setCategoryName('')
        //to close modal
        handleClose()
      }
      else{
        console.log(response);
        toast.error('Something went wrong. Please try again later.')
      }
    }else{
      toast.warning('Please fill the category name')
    }
  }

  //fuction to get all category
  const getallCategory = async()=>{
    const {data} = await getAllCategory()
    console.log(data);
    setAllCategory(data)
  }
  console.log(allCategory);

  //to load function while loading the page useEffect is used 
 useEffect(()=>{
    getallCategory()
 },[])

 //dragover eventlistener
 const dragover = (e)=>{
  //this will prevent reload so that data sent from videocard.js wont be lost
  e.preventDefault()
  console.log('inside draopver')
 }


 const videoDrop = async(e, categoryId)=>{
  console.log(`droped inside categoryId ${categoryId}`);
  //to get the video id that is sent from videocard component
  const videoid = e.dataTransfer.getData("videoID")
  console.log(videoid);

  //api to get the particular video that is dragged
  const {data} = await getAVideo(videoid)
  console.log(data);
 //to find a particular category with the specified id
  let selectedCategory = allCategory?.find((item)=>item.id===categoryId)
  console.log(selectedCategory);
  //data is added to allvideos array in the particular category with specified id
  selectedCategory.allVideos.push(data)
  console.log(selectedCategory);

  await updateCategory(categoryId,selectedCategory)
  getAllCategory()

}

 //function to delete category
 const handleDelete = async(id)=>{
  await deleteCategory(id)
  getallCategory()

}

  return (
    <>
    <div className='d-grid ms-3'>
        <button onClick={handleShow} className='btn btn-warning'>Add New Category</button>

    </div>

    {
     allCategory?.length>0?
    allCategory?.map((item)=>( <div className='mt-5 border border-secondary rounded p-3'>
    <div className="d-flex justify-content-between align-items-center" droppable onDragOver={(e)=>dragover(e)} onDrop={(e)=>videoDrop(e, item?.id)}>
      <h6>{item.categoryName}</h6>
      <button onClick={()=>handleDelete(item?.id)}  className='btn btn-danger'><i class="fa-solid fa-trash-can"></i></button>
    </div>
    <Row>
      <Col sm={12}>
        {
          item.allVideos?.length>0?
          item.allVideos.map((card)=>(<VideoCard displayVideo={card}/>))
          : <p>Nothing to display</p>
        }
      </Col>
    </Row>
  </div>))
    :
    <p>Nothing to display</p>
    }

    <Modal
        show={show}
        onHide={handleClose}
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header closeButton>
          <Modal.Title><i class="fa-solid fa-pencil me-1 text-warning"></i> Add new category</Modal.Title>
        </Modal.Header>
        <Modal.Body>
         <form action="" className='border border-secondary rounded p-3'>

           <Form.Group className="mb-3" controlId="formBasicEmail">
            <Form.Label>Category Name</Form.Label>
             <Form.Control type="text" placeholder="Enter Category Name" onChange={(e)=>setCategoryName(e.target.value)} />
           </Form.Group>

         </form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Cancel
          </Button>
          <Button variant="warning" onClick={handleAddCategory}>Add</Button>
        </Modal.Footer>
      </Modal>

      <ToastContainer position='top-center' theme='colored' autoClose={2000} />
    </>
  )
}

export default Category