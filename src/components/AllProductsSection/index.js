import {useState, useEffect} from 'react'
import Loader from 'react-loader-spinner'
import Cookies from 'js-cookie'

import ProductCard from '../ProductCard'
import ProductsHeader from '../ProductsHeader'

import './index.css'

const categoryOptions = [
  {
    name: 'Clothing',
    categoryId: '1',
  },
  {
    name: 'Electronics',
    categoryId: '2',
  },
  {
    name: 'Appliances',
    categoryId: '3',
  },
  {
    name: 'Grocery',
    categoryId: '4',
  },
  {
    name: 'Toys',
    categoryId: '5',
  },
]

const sortbyOptions = [
  {
    optionId: 'PRICE_HIGH',
    displayText: 'Price (High-Low)',
  },
  {
    optionId: 'PRICE_LOW',
    displayText: 'Price (Low-High)',
  },
]

const ratingsList = [
  {
    ratingId: '4',
    imageUrl:
      'https://assets.ccbp.in/frontend/react-js/rating-four-stars-img.png',
  },
  {
    ratingId: '3',
    imageUrl:
      'https://assets.ccbp.in/frontend/react-js/rating-three-stars-img.png',
  },
  {
    ratingId: '2',
    imageUrl:
      'https://assets.ccbp.in/frontend/react-js/rating-two-stars-img.png',
  },
  {
    ratingId: '1',
    imageUrl:
      'https://assets.ccbp.in/frontend/react-js/rating-one-star-img.png',
  },
]

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

const AllProductsSection = () => {
  const [apiDetails, setApiDetails] = useState({
    apiStatus: apiStatusConstants.initial,
    responseData: null,
    errorMsg: null,
  })
  const [cat, setCat] = useState(0)
  const [rat, setrat] = useState(0)
  const [input, setInput] = useState('')
  const [activeOptionId, setActiveOptionId] = useState(
    sortbyOptions[0].optionId,
  )
  useEffect(() => {
    const getProducts = async () => {
      setApiDetails({
        apiStatus: apiStatusConstants.inProgress,
        responseData: null,
        errorMsg: null,
      })
      const apiUrl = `https://apis.ccbp.in/products?sort_by=${activeOptionId}&category=${cat}&title_search=${input}&rating=${rat}`
      const jwtToken = Cookies.get('jwt_token')
      const options = {
        headers: {
          Authorization: `Bearer ${jwtToken}`,
        },
        method: 'GET',
      }
      const response = await fetch(apiUrl, options)
      const fetchedData = await response.json()
      if (response.ok) {
        const formattedData = fetchedData.products.map(product => ({
          title: product.title,
          brand: product.brand,
          price: product.price,
          id: product.id,
          imageUrl: product.image_url,
          rating: product.rating,
        }))
        setApiDetails(prevApiDetails => ({
          ...prevApiDetails,
          apiStatus: apiStatusConstants.success,
          responseData: formattedData,
        }))
      } else {
        setApiDetails(prevApiDetails => ({
          ...prevApiDetails,
          apiStatus: apiStatusConstants.failure,
          errorMsg: fetchedData.error_msg,
        }))
      }
    }

    getProducts()
  }, [activeOptionId, cat, input, rat])

  const changingInput = event => {
    setInput(event.target.value)
  }

  const renderLoadingView = () => (
    <div className='products-loader-container'>
      <Loader type='ThreeDots' color='#0b69ff' height='50' width='50' />
    </div>
  )

  const renderFailureView = () => (
    <div className='products-error-view-container'>
      <img
        src='https://assets.ccbp.in/frontend/react-js/nxt-trendz/nxt-trendz-products-error-view.png'
        alt='all-products-error'
        className='products-failure-img'
      />
      <h1 className='product-failure-heading-text'>
        Oops! Something Went Wrong
      </h1>
      <p className='products-failure-description'>
        We are having some trouble processing your request. Please try again.
      </p>
    </div>
  )
  const changeSortby = optionId => {
    setActiveOptionId(optionId)
  }
  const renderProductsListView = () => {
    const {responseData} = apiDetails

    // TODO: Add No Products View
    return (
      <div className='all-products-container'>
        <ProductsHeader
          activeOptionId={activeOptionId}
          sortbyOptions={sortbyOptions}
          changeSortby={changeSortby}
        />
        <ul className='products-list'>
          {responseData.map(product => (
            <ProductCard productData={product} key={product.id} />
          ))}
        </ul>
      </div>
    )
  }

  const renderAllProducts = () => {
    const {apiStatus} = apiDetails
    switch (apiStatus) {
      case apiStatusConstants.success:
        return renderProductsListView()
      case apiStatusConstants.failure:
        return renderFailureView()
      case apiStatusConstants.inProgress:
        return renderLoadingView()
      default:
        return null
    }
  }

  const catFilter = id => {
    setCat(id)
  }

  const catRat = id => {
    setrat(id)
  }

  // TODO: Add failure view

  return (
    <div className='all-products-section'>
      {/* TODO: Update the below element */}

      <div style={{display: 'flex', flexDirection: 'column'}}>
        <input
          type='search'
          onChange={changingInput}
          value={input}
          style={{height: '30px'}}
        />
        <ul>
          {categoryOptions.map(each => (
            <div
              key={each.categoryId}
              onClick={() => catFilter(each.categoryId)}
            >
              <li>{each.name}</li>
            </div>
          ))}
        </ul>

        <ul>
          {ratingsList.map(each => (
            <div key={each.ratingId} onClick={() => catRat(each.ratingId)}>
              <img src={each.imageUrl} />
            </div>
          ))}
        </ul>
      </div>
      {renderAllProducts()}
    </div>
  )
}

export default AllProductsSection
