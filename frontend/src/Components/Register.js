import React from 'react';
import { Link, useNavigate } from "react-router-dom";
import "../Styles/Register.css";
import { useFormik } from "formik";
import * as yup from "yup";
import { FaHouseUser, FaSignInAlt } from "react-icons/fa";
import { MdEmail } from "react-icons/md";
import { RiLockPasswordFill } from "react-icons/ri";
import { url } from '../App';
import axios from "axios";
import {toast} from "react-toastify"


const userSchema = yup.object({
  name: yup.string().required("Please enter your name..."),
  email: yup.string().required("Please enter your proper email..."),
  password: yup.string().required("Please enter your password...")
});
const Register = () => {
  const onSubmit = async(values, action)=>{
      registerUser(values)
      await new Promise(resolve => setTimeout(resolve, 2000))
      action.resetForm()
  }
  const navigate = useNavigate();
  const { values, handleChange, handleSubmit, touched, errors, handleBlur, handleReset } = useFormik({
    initialValues: {
      name: "",
      email: "",
      password: ""
    },
    validationSchema: userSchema,
    onSubmit
  });
  const registerUser = async(register) => {
      try {
          const result = await axios.post(`${url}/register`, register);
          if(result.data.success === true && navigate("/login")){
             toast.success("Signin successfully...", {
                  autoClose: 2000,
                  position: toast.POSITION.TOP_CENTER,
             })
          }
      } catch (error) {
          if(error.response.data.message){
              toast.error("Already used this Email...", { 
              autoClose: 2000,
              position: toast.POSITION.TOP_CENTER,
            })
          }
      }
  };
  return (
    <div className='register'>
      <form onSubmit={handleSubmit} className="register-card" autoComplete='off'>
        <h2>Create a Account...</h2>
          {touched.name && errors.name ? <div className='error'><p className='error-input'>{errors.name}</p></div> : ""}
        <div className="input-icon">
          <span><FaHouseUser /></span>
          <input
            type="text"
            placeholder='Name...'
            name='name'
            value={values.name}
            onChange={handleChange}
            onBlur={handleBlur}
            onReset={handleReset}
          />
        </div>
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
        <button className="register-btn" type='submit'> <span><FaSignInAlt /></span> SIGN UP</button>
        <Link className='login-link' to='/login'>Already have an account? login </Link>
      </form>
    </div>
  )
}

export default Register