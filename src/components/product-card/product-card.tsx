import { Guitar } from '../../types/guitar';
import { MAX_STAR_RATING, FULL_STAR } from '../../const';
import { nanoid } from 'nanoid';
import { fetchCommentsDataAction } from '../../store/api-actions';
import { ThunkAppDispatch } from '../../types/action';
import { store } from '../../index';
import { connect, ConnectedProps } from 'react-redux';
import { State } from '../../types/state';
import { useEffect, useRef } from 'react';

type ProductCardProps = {
  guitar: Guitar;
};

const mapStateToProps = ({guitarComments, currentId}: State) => ({
  guitarComments,
  currentId,
});

const connector = connect(mapStateToProps);

type PropsFromRedux = ConnectedProps<typeof connector>;
type ConnectedComponentProps = PropsFromRedux & ProductCardProps;

function ProductCard({guitar, guitarComments}: ConnectedComponentProps): JSX.Element {
  const exit = '';
  const commentsRef = useRef<HTMLSpanElement | null>(null);

  // useEffect(() => {
  //   if( guitarComments === null && guitar !== null) {
  //     const {id} = guitar;
  //     currentId = id;
  //     (store.dispatch as ThunkAppDispatch)(fetchCommentsDataAction(id, currentId));
  //   } else if( guitarComments !== null && guitar?.id !== currentId) {
  //     if (guitar?.id === undefined) {
  //       return <div>No data</div>;
  //     }
  //     currentId =  guitar?.id;
  //     (store.dispatch as ThunkAppDispatch)(fetchCommentsDataAction(guitar.id, currentId));
  //   }
  // }, guitar);

  useEffect(() => {
    if(guitar !== null) {
      (store.dispatch as ThunkAppDispatch)(fetchCommentsDataAction(guitar.id));
    }
    if(commentsRef.current !== null) {
      if(guitarComments) {
        commentsRef.current.textContent = guitarComments.length.toString();
      }}
    //eslint-disable-next-line
      console.log('запрос комментариев для гитары', guitar.id, guitarComments);
  }, [guitar]);

  if(guitar === null) {
    return <div>{exit}</div>;
  } else {
    const {name, previewImg, rating, price} = guitar;
    const imageAddress = `img/content${previewImg.substring(previewImg.indexOf('/'))}`;
    const starRange = (rating !== 0 ? new Array(MAX_STAR_RATING).fill(0).fill(1, 0, Math.floor(rating)): null);

    return(
      <div className="product-card">
        <img src={imageAddress} width="75" height="190" alt={name} />
        <div className="product-card__info">
          <div className="rate product-card__rate" aria-hidden="true"><span className="visually-hidden">Рейтинг:</span>
            {starRange?.map((item) => (
              <svg key={name+nanoid()} width="12" height="11" aria-hidden="true">
                <use xlinkHref={item === FULL_STAR ? '#icon-full-star' : '#icon-star'}></use>
              </svg>
            ))}
            <span className="rate__count" ref={commentsRef}>{guitarComments ? guitarComments.length : 0}</span><span className="rate__message"></span>
          </div>
          <p className="product-card__title">{name}</p>
          <p className="product-card__price"><span className="visually-hidden">Цена:</span>{price.toLocaleString('ru-RU')} ₽
          </p>
        </div>
        <div className="product-card__buttons"><a className="button button--mini" href="#">Подробнее</a><a className="button button--red button--mini button--add-to-cart" href="#">Купить</a>
        </div>
      </div>
    );
  }
}

export {ProductCard};
export default connector(ProductCard);
