import React, { useEffect, useState } from 'react'
import styles from './Loader.module.css';

export default function Loader() {

  let [count, setCount] = useState(0)
  useEffect(() => { }, [])
  return (
    <>
      <div className='fixed top-0 bottom-0 z-50 left-0 right-0 bg-black flex justify-center items-center'>
        <span className={`${styles.loader}`}></span>
      </div>
    </>
  )
}
