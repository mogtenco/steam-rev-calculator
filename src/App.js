import './App.scss';
import Toolbar from './components/Toolbar';
import Header from './components/Header';
import RevenueCalcPage from './components/RevenueCalcPage';
function App() {
  return (
    <div className="App">
      <Toolbar></Toolbar>
      <div className="MainPage">
        <Header></Header>
        <div className="MainBody">
          <RevenueCalcPage></RevenueCalcPage>
        </div>
      </div>
    </div>
  );
}

export default App;
