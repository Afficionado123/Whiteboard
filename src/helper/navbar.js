import React from 'react';
import { useKeycloak } from "@react-keycloak/web";
import 'bootstrap/dist/css/bootstrap.min.css';

const LeftNavbar = ({ handleUndo, handleRedo, handleBrushClick, handleLineWidthChange }) => {
  const { keycloak } = useKeycloak();
  return (
    <div className="left-navbar card">
      <div className="menu-item" onClick={handleUndo}>
        <i className="material-icons">undo</i>
        <span>Undo</span>
      </div>
      <div className="menu-item" onClick={handleRedo}>
        <i className="material-icons">redo</i>
        <span>Redo</span>
      </div>
      <div className="menu-item" onClick={handleBrushClick}>
        <i className="material-icons">brush</i>
        <span>Brush</span>
      </div>
      <div className="line-width">
        <label htmlFor="drawing-line-width">Line Width:</label>
        <input
          type="range"
          id="drawing-line-width"
          min="1"
          max="10"
          onChange={handleLineWidthChange}
        />
      </div>
      <div className="hidden xl:flex items-center space-x-5">
               <div className="hover:text-gray-200">
                 {!keycloak.authenticated && (
                   <button
                     type="button"
                     className="text-blue-800"
                     onClick={() => keycloak.login()}
                   >
                     Login
                   </button>
                 )}

                 {!!keycloak.authenticated && (
                   <button
                     type="button"
                     className="text-blue-800"
                     onClick={() => keycloak.logout()}
                   >
                     Logout ({keycloak.tokenParsed.preferred_username})
                   </button>
                 )}
               </div>
             </div>
    </div>
  );
};

export default LeftNavbar;

