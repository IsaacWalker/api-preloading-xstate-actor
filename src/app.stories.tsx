import React, { useEffect } from "react";
import { App } from "./app";
import { Response, createServer } from "miragejs";


export default {
    title: "App",
    component: App,
    parameters: {
      xstate: true
    }
}

export const SideBySide = () => {
  useEffect(() => {
      createTestServer(2000);
  }, [])

  return (
  <div style={{ display: "flex", flexDirection: "row"}}>
    <App preload={true} />
    <App preload={false} />
  </div>);
}

function createTestServer(suggestionsLoadTime: number): void {
    createServer({
        routes() {
          this.namespace = "api";
          
          this.post("/order", () => {
            return new Response(201);
          }, { timing: 3000 })

          this.get("/suggestions", () => {
            return JSON.stringify([
              {
                  name: "Documenting Software Architectures",
                  author: "Clements, Bachmann, Bass",
                  price: 59.99,
                  id: "cd599de9-8643-4a48-aa97-dbc8662aad26"
              },
              {
                  name: "Concise Guide to Formal Methods",
                  author: "Gerard O'Regan",
                  price: 29.99,
                  id: "0bdde4f0-27af-48bd-9de4-8f40add40b7f"
              }
          ]);
          }, { timing: suggestionsLoadTime })
        },
      })
}