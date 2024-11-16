import Blog from 'pages/Blog'
import { ToastContainer } from 'react-toastify'
import { Fragment } from 'react/jsx-runtime'
import 'react-toastify/dist/ReactToastify.css';

function App() {
  return (
    <Fragment>
      <ToastContainer />
      <Blog />
    </Fragment>
  )
}

export default App
