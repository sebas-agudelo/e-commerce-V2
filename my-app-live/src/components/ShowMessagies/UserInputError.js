import React from 'react'
import { PiWarningCircleLight } from "react-icons/pi";

export default function UserInputError({userInputMessage}) {
  return (
    <div>
      <p><PiWarningCircleLight /> {userInputMessage}</p>
    </div>
  )
}
