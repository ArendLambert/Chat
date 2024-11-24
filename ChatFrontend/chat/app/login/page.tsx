"use client";

import React from 'react';
import { LoginForm } from '../Components/loginForm';
import styles from "../page.module.css"


export default function Home() {

  return (
    <div className= {styles.background_image}>
      <div>
        <LoginForm/>
      </div>
    </div>
  );
}
