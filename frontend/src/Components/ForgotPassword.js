import React from 'react'
import { useFormik } from "formik";
import * as yup from "yup";
import {Link} from "react-router-dom";
import "../Styles/Forgot.css";
import { MdEmail } from "react-icons/md";
import { RiSendBackward } from "react-icons/ri";
import {toast} from "react-toastify";
import axios from "axios"
import { url } from '../App';


const userSchema = yup.object({
  email: yup.string().required("Please enter your proper email..."),
});
const ForgotPassword = () => {
  const onSubmit = async(values, action)=>{
    forgotPassword(values)
    await new Promise(resolve => setTimeout(resolve, 2000))
    action.resetForm()
  }
  const {values, handleChange, handleSubmit, touched, errors, handleBlur, handleReset} = useFormik({
    initialValues: {
        email: "",
    },
    validationSchema: userSchema,
    onSubmit
  });
  const forgotPassword = async (forgot) => {
    try {
        const result = await axios.post(`${url}/forgot/password`, forgot);
        if(result.data.message){
          return toast.success("Email send successfully...", {
               autoClose: 2000,
               position: toast.POSITION.TOP_CENTER,
          })
      }
    } catch (error) {
        if(error.response.data.message){
          return toast.warn("Please entet your Email...", { 
            autoClose: 2000,
            position: toast.POSITION.TOP_CENTER,
          })
       }
    }
  };
  return (
    <div className='forgot'>
    <form onSubmit={handleSubmit} className="forgot-card" autoComplete='off'>
         <h2>Forgot your Password...</h2>
         {touched.email && errors.email ? <div className='error'><p className='error-input'>{errors.email}</p></div> : ""}
        <div className="input-icon">
          <span><MdEmail /></span>
          <input
            type="email"
            placeholder='Email...'
            name='email'
            value={values.email}
            onChange={handleChange}
            onBlur={handleBlur}
            onReset={handleReset}
          />
        </div>
         <button className="forgot-btn" type='submit'><span><RiSendBackward /></span>SEND</button>
          <Link className='log-link' to='/login'>Back</Link>
    </form>
   </div>
  )
}

export default ForgotPassword