import './App.css';
import Calculator from './components/table';
import { DataProvider } from './context/DataContext';

function App() {
  return (
    <DataProvider>
      <Calculator />
    </DataProvider>
  );
}

export default App;
