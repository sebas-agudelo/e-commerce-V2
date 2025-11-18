import React from 'react'
import { IoIosCheckmarkCircleOutline } from "react-icons/io";

export default function Success() {
  return (
    <main className='success-container'>
      <div className='check-icon-wrapper'>
        <IoIosCheckmarkCircleOutline />
      </div>

      <div className='thanks-wrapper'>
        <h1>Tack för din beställning</h1>
        <p>Hoppas vi ses snart igen!</p>

        <a href='/'>Till startsidan</a>
        </div>
    </main>
  )
}
