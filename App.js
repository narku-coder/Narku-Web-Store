
import './App.css';
import Store from './store.js';
import Login from './login.js';

function App() {
	console.log("It got here. - app");
  return (
    <div className="App">
      <Login />
	  <Store />
    </div>
  );
}

export default App;
