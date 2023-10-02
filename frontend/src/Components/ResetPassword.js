import React from 'react'
import { useFormik } from "formik";
import * as yup from "yup";
import "../Styles/Reset.css"
import {RiLockPasswordFill} from "react-icons/ri";
import axios from 'axios';
import { url } from '../App';
import {toast} from "react-toastify";
import { useParams, Link } from 'react-router-dom';
import {useNavigate} from "react-router-dom"


const userSchema = yup.object({
  password: yup.string().required("Please enter your new password..."),
  confirmPassword: yup.string().required("Please enter your confirm password...")
});
const ResetPassword = () => {
  const navigate = useNavigate()
  const onSubmit = async(values, action)=>{
    resetUser(values)
    await new Promise(resolve => setTimeout(resolve, 2000))
    action.resetForm()
  }
  const {values, handleChange, handleSubmit, touched, errors} = useFormik({
    initialValues: {
      password: "",
      confirmPassword: ""
    },
    validationSchema: userSchema,
    onSubmit 
  });
  const {token} = useParams();
  const resetUser = async (reset) => {
      try {
          const result = await axios.post(`${url}/reset/password/${token}`, reset);
          console.log(result);
          if(result.data.message){
             toast.success("Password updated successfully...", {
                 autoClose: 2000,
                 position: toast.POSITION.TOP_CENTER,
            })
        }
        navigate("/")
      } catch (error) {
        if(error.response.data.message ){
            toast.warn("Please check your reset password link...", { 
            autoClose: 3000,
            position: toast.POSITION.TOP_CENTER,
          })
       }
      }
  };
  return (
    <div className='reset'>
    <form onSubmit={handleSubmit} className="reset-card" autoComplete='off'>
         <h2>Reset Password...</h2>
         {touched.password && errors.password ? <div className='error'><p className='error-input'>{errors.password}</p></div> : ""}
         <div className="input-icon">
         <span><RiLockPasswordFill /></span>
         <input 
           type="text" 
           placeholder='Password...' 
           name='password'
           value={values.password}
           onChange={handleChange}
         />
         </div>
         {touched.confirmPassword && errors.confirmPassword ?<div className='error'><p className='error-input'>{errors.confirmPassword}</p></div> : ""}
         <div className="input-icon">
         <span><RiLockPasswordFill /></span>
         <input 
           type="password" 
           placeholder='Confirm Password...' 
           name='confirmPassword'
           value={values.confirmPassword}
           onChange={handleChange}
         />
         </div>
         <button className="reset-btn" type='submit'>UPDATE</button>
         <Link className='reset-link' to="/login">Login Here...</Link>
    </form>
  </div>
  )
}

export default ResetPassword