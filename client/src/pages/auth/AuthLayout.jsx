import React from 'react'
import Login from './Login'
import { Outlet } from 'react-router-dom'

export default function AuthLayout() {
  return (
    <>
    {/* <h1>Layout working</h1> */}
      <Login />
    </>
  )
}
