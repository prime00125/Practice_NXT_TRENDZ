import {BrowserRouter, Route, Routes} from 'react-router-dom'
import Context from './components/Context'
import LoginForm from './components/LoginForm'
import Home from './components/Home'
import Products from './components/Products'
import Cart from './components/Cart'
import NotFound from './components/NotFound'
import ProtectedRoute from './components/ProtectedRoute'
import {useState} from 'react'
import './App.css'
import ProductItemDetails from './components/ProductItemDetails'

const App = () => {
  const [item, setItem] = useState([
    {
      title: 'Product 1',
      brand: 'Brand Name',
      id: 1001,
      imageUrl:
        'https://assets.ccbp.in/frontend/react-js/sample-product-img.jpg',
      price: 760,
      quantity: 5,
    },
    {
      title: 'Product 2',
      brand: 'Brand Name',
      id: 1002,
      imageUrl:
        'https://assets.ccbp.in/frontend/react-js/sample-product-img.jpg',
      price: 760,
      quantity: 2,
    },
  ])

  const removeit = id => {
    const afterRemove = item.filter((each) => each.id !== id)
    setItem(afterRemove)
  }

  const addItem = need => {
    setItem([
      ...item,
      {
        title: need.title,
        brand: need.brand,
        id: need.id,
        imageUrl: need.imageUrl,

        price: need.price,
        quantity: need.qu,
      },
    ])
  }

  return (
    <Context.Provider value={{item, addItem, removeit}}>
      <BrowserRouter>
        <Routes>
          <Route path='/login' element={<LoginForm />} />
          <Route
            path='/'
            element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            }
          />
          <Route
            path='/products'
            element={
              <ProtectedRoute>
                <Products />
              </ProtectedRoute>
            }
          />
          <Route
            path='/products/:id'
            element={
              <ProtectedRoute>
                <ProductItemDetails />
              </ProtectedRoute>
            }
          />
          <Route
            path='/cart'
            element={
              <ProtectedRoute>
                <Cart />
              </ProtectedRoute>
            }
          />
          <Route path='*' element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </Context.Provider>
  )
}

export default App
