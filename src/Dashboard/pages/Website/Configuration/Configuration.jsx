import React, { useEffect, useState } from "react";
import "./Configuration.css";

export default function Configuration() {
  return (
    <div className="web-comfigaration">
      <h1>Configuración</h1>
      <p>Aquí puedes configurar la aplicación.</p>
      <form action="/api/configuracion" method="POST">
        
        <button type="submit">Guardar configuración</button>
      </form>
    </div>
  );
}
