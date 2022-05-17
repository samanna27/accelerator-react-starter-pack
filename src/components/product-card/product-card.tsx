import { Guitar } from '../../types/guitar';
import { MAX_STAR_RATING, FULL_STAR } from '../../const';
import { nanoid } from 'nanoid';
import { fetchCommentsDataAction } from '../../store/api-actions';
import { ThunkAppDispatch } from '../../types/action';
import { store } from '../../store/store';
import { connect, ConnectedProps } from 'react-redux';
import { State } from '../../types/state';
import { useEffect, Dispatch, SetStateAction } from 'react';
import { Link } from 'react-router-dom';

type ProductCardProps = {
  guitar: Guitar;
  setGuitarToCart: Dispatch<SetStateAction<Guitar>>;
  setIsModalCartAddVisible: Dispatch<SetStateAction<boolean>>;
  setIsModalSuccessAddVisible: Dispatch<SetStateAction<boolean>>;
  setIsComponentVisible: Dispatch<SetStateAction<boolean>>;
};

const mapStateToProps = ({allGuitarsComments, currentId, productsInCart}: State) => ({
  allGuitarsComments,
  currentId,
  productsInCart,
});

const connector = connect(mapStateToProps);

type PropsFromRedux = ConnectedProps<typeof connector>;
type ConnectedComponentProps = PropsFromRedux & ProductCardProps;

function ProductCard({guitar, allGuitarsComments, setIsModalCartAddVisible, setIsModalSuccessAddVisible, setIsComponentVisible, setGuitarToCart, productsInCart}: ConnectedComponentProps): JSX.Element {
  const exit = '';

  const handleAddToCartClick = () => {
    setGuitarToCart({...guitar});
    setIsModalSuccessAddVisible(false);
    setIsModalCartAddVisible(true);
    setIsComponentVisible(true);
  };

  useEffect(() => {
    if(guitar !== null) {
      (store.dispatch as ThunkAppDispatch)(fetchCommentsDataAction(guitar.id));
    }
  }, [guitar]);

  if(guitar === null) {
    return <div>{exit}</div>;
  } else {
    const {id, name, previewImg, rating, price} = guitar;
    const imageAddress = `img/content${previewImg.substring(previewImg.indexOf('/'))}`;
    const starRange = (rating !== 0 ? new Array(MAX_STAR_RATING).fill(0).fill(1, 0, Math.floor(rating)): null);

    return(
      <div className="product-card">
        <img src={imageAddress} width="75" height="190" alt={name} />
        <div className="product-card__info">
          <div className="rate product-card__rate" aria-hidden="true"><span className="visually-hidden">Рейтинг:</span>
            {starRange?.map((item) => (
              <svg key={name+nanoid()} width="12" height="11" aria-hidden="true">
                <use xlinkHref={item === FULL_STAR ? 'img/sprite/icon-full-star.svg#icon-full-star' : 'img/sprite/icon-star.svg#icon-star'}></use>
              </svg>
            ))}
            <span className="rate__count">
              { allGuitarsComments.find((guitarComments) => guitarComments[0] === id)
                ? allGuitarsComments.filter((guitarComments) => guitarComments[0] === id)[0][1].length
                : 0}
            </span>
            <span className="rate__message"></span>
          </div>
          <p className="product-card__title">{name}</p>
          <p className="product-card__price"><span className="visually-hidden">Цена:</span>{price.toLocaleString('ru-RU')} ₽
          </p>
        </div>
        <div className="product-card__buttons">
          <Link className="button button--mini" to={`/guitars/${id}`}>Подробнее</Link>
          {productsInCart.slice().filter((productInCart) => productInCart.id === guitar.id).length === 0 && <a className="button button--red button--mini button--add-to-cart" href="#" onClick={handleAddToCartClick}>Купить</a>}
          {productsInCart.slice().filter((productInCart) => productInCart.id === guitar.id).length > 0 && <Link className="button button--red-border button--mini button--in-cart" to="/cart">В Корзине</Link>}
        </div>
      </div>
    );
  }
}

export {ProductCard};
export default connector(ProductCard);
