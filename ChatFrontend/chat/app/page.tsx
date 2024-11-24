"use client";

import React from 'react';
import { RegisterForm } from "./Components/registerForm";
import styles from "./page.module.css"

export default function Home() {
  return (
    <div className= {styles.background_image}> 
      <div>
        <RegisterForm/>
      </div>
    </div>
  );
}
