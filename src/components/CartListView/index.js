import CartItem from '../CartItem'
import {useContext} from 'react'
import Context from '../Context'
import './index.css'

const CartListView = () => {
  const {item} = useContext(Context)

  return (
    <ul className='cart-list'>
      {item.map(eachCartItem => (
        <CartItem key={eachCartItem.id} cartItemDetails={eachCartItem} />
      ))}
    </ul>
  )
}
export default CartListView
