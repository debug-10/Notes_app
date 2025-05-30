import { createRoot } from 'react-dom/client';
import './index.css';
import './theme.css';
import App from './App.jsx';
import 'virtual:uno.css';
import '@ant-design/v5-patch-for-react-19';

createRoot(document.getElementById('root')).render(<App />);
