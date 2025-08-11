import { Box } from '@chakra-ui/react';
import MainPage from './main/index';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Login from './login';

function App() {
  return (
    <Box className='light'>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<MainPage />} />
          <Route path='/login' element={<Login />} />
        </Routes>
      </BrowserRouter>
    </Box>
  );
}

export default App
