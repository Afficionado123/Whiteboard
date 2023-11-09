// src/App.js
import React from 'react';
import DrawingCanvas from './canvas/DrawingCanvas.tsx';
import LeftNavbar from './helper/navbar.js';
import Secured from './components/SecuredPage.js';
import { BrowserRouter, Route, Routes } from "react-router-dom";
import keycloak from './keycloak.ts';
import PrivateRoute from './helpers/PrivateRoute.js';

function App() {
  return(<div>
   
     <LeftNavbar />
     <BrowserRouter>
       <Routes>

         <Route exact path="/" element={<DrawingCanvas />} />
         <Route
             path="/secured"
             element={
               <PrivateRoute>
                 <Secured />
               </PrivateRoute>
             }
           />
       </Routes>
     </BrowserRouter>
   
  </div>);
  // return (
  //   <div className="App">
  //      <LeftNavbar />
  //     <DrawingCanvas />
  //   </div>
  // );
}

export default App;
