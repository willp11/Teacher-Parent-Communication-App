import './App.css';
import Navigation from './components/Navigation/Navigation';

function App() {

  return (
    <div className="App">
      <Navigation />
      <h1>Django Auth Template</h1>
      <p>Front-end to interact with a Django app that implements user authentication using the dj-rest-auth and allauth packages, including email verification.</p>
    </div>
  );
}

export default App;
