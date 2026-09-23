import React, { Children, useEffect, useState } from 'react'
import styles from './ProtectedRoutes.module.css';
import { Navigate } from 'react-router-dom';

export default function ProtectedRoutes({children}) {

  if (!localStorage.getItem('authToken')) {

      return <Navigate to={'/'} />


  }
  return children
}
