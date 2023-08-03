import Head from 'next/head'
import Header from '@components/Header'
import Footer from '@components/Footer'

export default function Home() {
  return (
    <div className="container">
      <Head>
        <title>Next.js Starter!</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <Header title="Welcome to my app!" />
        <p className="description">
          Get started by editing <code>pages/index.js</code>
        </p>
      </main>

      <Footer />
    </div>
  )
}
import React, { useEffect, useState } from "react";

const PersonaClient = ({ shouldStartPersona, onReady, onLimitReached }) => {
  const [personaClient, setPersonaClient] = useState(null);
  const [didStartPersona, setDidStartPersona] = useState(false);

  useEffect(() => {
    const script = document.createElement("script");
    script.src =
      "https://app.sindarin.tech/PersonaClientPublic?apikey=430c62b9-d492-4ebc-8a2f-5a6aa40920fb";

    script.addEventListener("load", async () => {
      const apiKey = "430c62b9-d492-4ebc-8a2f-5a6aa40920fb";
      const personaClient = new window.PersonaClient(apiKey);
      setPersonaClient(personaClient);
    });
    document.head.appendChild(script);
  }, []);

  useEffect(() => {
    const getUserID = async () => {
        return "user-" + Math.random().toString(36).substr(2, 9);
    };

    if (personaClient && shouldStartPersona && !didStartPersona) {
      setDidStartPersona(true);

      const character = "Jane";
      getUserID().then((userId) => {
        personaClient
          .init(userId, character)
          .then(() => {
            personaClient.on("ready", () => {
              onReady();
            });
          })
          .catch((err) => {
            console.log("personaClient init error", err);
            if (/You have/gi.test(err)) {
              onLimitReached();
            }
          });
      });
    }
  }, [personaClient, shouldStartPersona, onReady, didStartPersona, onLimitReached]);

  return null;
};

const App = () => {
  const [shouldStartPersona, setShouldStartPersona] = useState(false);

  const handleButtonClick = () => {
    setShouldStartPersona(true);
  };

  return (
    <div>
      <button onClick={handleButtonClick}>Speak to Jane</button>
      <PersonaClient
        shouldStartPersona={shouldStartPersona}
        onReady={() => console.log("Persona ready!")}
        onLimitReached={() => console.log("Limit reached!")}
      />
    </div>
  );
};

export default App;
