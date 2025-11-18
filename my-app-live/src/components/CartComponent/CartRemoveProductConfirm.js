export default function CartRemoveProductConfirm({onDelete, onCancel}) {
  return (
    <div className='cart-delete-confirm-product-wrapper'>
        <div  className='cart-delete-confirm-product-content'>
        <p>Vill du verkligen ta bort produkten?</p>
        <div>
      <button className="confirm-delete-product-btn" onClick={onDelete}>JA</button>
      <button className="cancel-delete-product-btn" onClick={onCancel}>NEJ</button>
      </div>
</div>
    </div>
  )
}
