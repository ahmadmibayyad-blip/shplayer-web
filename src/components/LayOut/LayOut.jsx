import React, { useEffect, useState } from 'react'
import styles from './LayOut.module.css';
import Navbar from '../Navbar/Navbar'
import Footer from '../Footer/Footer'
import { Outlet } from 'react-router-dom';

export default function LayOut() {

    let [count,setCount] = useState(0)
    useEffect(() => {},[])
  return (
    <>
      <Navbar/>

        <Outlet/>
    

      <Footer/>
    </>
  )
}
