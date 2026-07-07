import { useState, useEffect, useContext } from 'react'
import { Routes , Route } from "react-router-dom";
import { UserProvider } from './components/UserContext';
import Header from './components/Header';
import Question from './components/Question';
import UserForm from './components/UserForm';
import Results from './components/Results';


const questions = [
  {
    question: "What's your favorite color?",
    options: ["Red 🔴", "Blue 🔵", "Green 🟢", "Yellow 🟡"],
  }
]

const keywords = {
  Fire: "fire",
  Water: "water",
  Earth: "earth",
  Air: "air",
};

const elements = {
  "Red 🔴": "Fire",
  "Blue 🔵": "Water",
  "Green 🟢": "Earth",
  "Yellow 🟡": "Air",
};

export default function App() {
  const [ currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [ answers, setAnswers ] = useState([]);
  const [ userName, setUserName ] = useState("");
  const [ element, setElement ] = useState("");
  const [ artwork, setArtwork ] = useState(null);
  

  function handleAnswer(answer) {
  setAnswers([...answers, answer]);
  setCurrentQuestionIndex(currentQuestionIndex + 1);
  };

  function handleUserFormSubmit(name) {
    setUserName(name);
  };

  function determineElement(answers) {
    const counts = {};
    answers.forEach(function(answer) {
      const element = elements[answer];
      counts[element] = (counts[element] || 0) + 1;
    });
    return Object.keys(counts).reduce(function(a, b) {
      return counts[a] > counts[b] ? a : b
    });
  };

  async function fetchArtwork(keyword) {
  try {
    const searchResponse = await fetch(
      `https://collectionapi.metmuseum.org/public/collection/v1/search?hasImages=true&q=${keyword}`
    );

    const searchData = await searchResponse.json();

    if (!searchData.objectIDs || searchData.objectIDs.length === 0) {
      setArtwork(null);
      return;
    }

    const objectId = searchData.objectIDs[0];

    const artworkResponse = await fetch(
      `https://collectionapi.metmuseum.org/public/collection/v1/objects/${objectId}`
    );

    const artworkData = await artworkResponse.json();

    setArtwork(artworkData);

  } catch (error) {
    console.error(error);
  }
  }

  useEffect(
  function () {
    if (currentQuestionIndex === questions.length) {
      const selectedElement = determineElement(answers);
      setElement(selectedElement);
      fetchArtwork(keywords[selectedElement]);
    }
    },
    [currentQuestionIndex]
  );

  return (
    <div>
      <UserProvider value={{ name: userName, setName: setUserName }}>
      <Header />
      <Routes>
        <Route path="/" element={<UserForm onSubmit={handleUserFormSubmit} />} />
        <Route
          path="/quiz"
          element={
            currentQuestionIndex < questions.length ? (
              <Question question={questions[currentQuestionIndex].question} options={questions[currentQuestionIndex].options} onAnswer={handleAnswer} />
            ) : (
              <Results element={element} artwork={artwork} />
            )
          }
        />
      </Routes>
    </UserProvider>
    </div>
  )
}
