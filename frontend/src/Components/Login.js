import React from 'react';
import "../Styles/Login.css";
import {Link, useNavigate} from "react-router-dom";
import { useFormik } from "formik";
import * as yup from "yup";
import { MdEmail } from "react-icons/md";
import { RiLockPasswordFill } from "react-icons/ri";
import { HiOutlineLogin } from "react-icons/hi";
import axios from "axios";
import { url } from '../App';
import {toast} from "react-toastify";


const userSchema = yup.object({
  email: yup.string().required("Please enter your proper email..."),
  password: yup.string().required("Please enter your password...")
});
const Login = () => {
  const onSubmit = async(values, action)=>{
    loginUser(values)
    await new Promise(resolve => setTimeout(resolve, 2000))
    action.resetForm()
  }
  const {values, handleChange, handleSubmit, touched, errors, handleBlur, handleReset} = useFormik({
    initialValues: {
        email: "",
        password: ""
    },
    validationSchema: userSchema,
    onSubmit 
  });
  const navigate = useNavigate();
  const loginUser = async (login) => {
      try {
          const result = await axios.post(`${url}/login`, login);
          if(result.data.message && navigate("/forgot/password")){
             toast.success("Login successfully...", {
                 autoClose: 2000,
                 position: toast.POSITION.TOP_CENTER,
            })
        }
      } catch (error) {
          if(error.response.data.message){
             toast.warn("Please enter your proper Email and Password...", { 
              autoClose: 2000,
              position: toast.POSITION.TOP_CENTER,
            })
         }
      }
  };
  return (
    <div className='login'>
    <form onSubmit={handleSubmit} className="login-card" autoComplete='off'>
         <h2>Login Here...!</h2>
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
          {touched.password && errors.password ? <div className='error'><p className='error-input'>{errors.password}</p></div> : ""}
        <div className="input-icon">
          <span><RiLockPasswordFill /></span>
          <input
            type="password"
            placeholder='Password...'
            name='password'
            value={values.password}
            onChange={handleChange}
            onBlur={handleBlur}
            onReset={handleReset}
          />
        </div>
         <button className="login-btn" type='submit'> <span><HiOutlineLogin /></span> LOGIN</button>
          <div className="links">
          <Link className='forgot-link' to='/forgot/password'>Forgot password?</Link>
          <Link className='create-link' to='/'>Need an account?</Link>
          </div>
    </form>
  </div>
  )
}

export default Login