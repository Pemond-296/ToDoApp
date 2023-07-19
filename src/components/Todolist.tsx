import React from 'react';
import styled from "styled-components";
import {ToDo} from "./ToDo"

export const TodoList: React.FC = () => {
  return (
   <Container>
      <div className='container'>
        <ToDo/>
      </div>
   </Container>
  );
}

const Container = styled.div`
  background-color: white;
  display: grid-column;
  padding: 30px 10px;
  width: 50%;
  min-width: 500px;
  height: fit-content;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin: auto;
  margin-top: 6rem;
  border-radius: 16px;
  box-shadow: rgba(155, 124, 127, 0.4) 1px 2px 1px 2px;
  .container{
    margin-top: -50px;
    width: 100%;
    text-align: center;
  }
  /* @media(max-width: 1200px){
    width: 70%;
  } */
`

