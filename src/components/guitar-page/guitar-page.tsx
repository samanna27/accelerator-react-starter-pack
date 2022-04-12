import Logo from '../logo/logo';
import Footer from '../footer/footer';
import Header from '../header/header';
import { useParams } from 'react-router';
import { connect, ConnectedProps } from 'react-redux';
import { State } from '../../types/state';
import { MAX_STAR_RATING, FULL_STAR, GUITAR_TYPE_SINGLE, CHARACTERISTICS, COMMENTS_SHOW_PER_CLICK } from '../../const';
import { nanoid } from 'nanoid';
import { useState, useEffect, MouseEvent } from 'react';
import dayjs from 'dayjs';
import localeData from 'dayjs/plugin/localeData';
import 'dayjs/locale/ru';
import { fetchCommentsDataAction } from '../../store/api-actions';
import { updateCommentsRendered } from '../../store/action';
import { ThunkAppDispatch } from '../../types/action';
import { store } from '../../store/store';
import { sortCommentsDateDown } from '../../utils/common';
import { Comment } from '../../types/guitar';
import { Link } from 'react-router-dom';
import useComponentVisible from '../../hooks/useComponentVisible';
import PopupForm from '../popup-form/popup-form';
import ReviewSentModal from '../review-sent-modal/review-sent-modal';
import ModalCartAdd from '../modal-cart-add/modal-cart-add';
import { useNavigate } from 'react-router';
import { useInView } from 'react-intersection-observer';

dayjs.extend(localeData);
dayjs.locale('ru');

const mapStateToProps = ({guitars, allGuitarsComments, commentsRendered}: State) => ({
  guitars,
  allGuitarsComments,
  commentsRendered,
});

const connector = connect(mapStateToProps);

type PropsFromRedux = ConnectedProps<typeof connector>;
type ConnectedComponentProps = PropsFromRedux;

function GuitarPage({guitars, allGuitarsComments, commentsRendered}: ConnectedComponentProps): JSX.Element {
  const params = useParams();
  const productId = Number(params.id);
  const product = guitars.slice().find((element) => element.id === productId);
  const comments: Comment[] | undefined = [...allGuitarsComments].slice().find((guitarComments) => guitarComments[0] === productId)?.[1].sort(sortCommentsDateDown);
  const exit = '';
  const [characteristic, setCharacteristic] = useState<string>(CHARACTERISTICS[0]);
  const [showMoreFlag, setShowMoreFlag] = useState<boolean>(true);
  const [isReviewPopupVisible, setIsReviewPopupVisible] = useState<boolean>(false);
  const [isReviewSentModalVisible, setIsReviewSentModalVisible] = useState<boolean>(false);
  const [isModalCartAddVisible, setIsModalCartAddVisible] = useState<boolean>(false);
  const { refPopup, refReviewSent, isComponentVisible, setIsComponentVisible } = useComponentVisible(true);
  const { ref, inView } = useInView({
    threshold: 0,
  });
  const navigate = useNavigate();

  useEffect(() => {
    if(comments !== undefined && commentsRendered !== comments.length){
      const commentsRenderedQuantity: number = commentsRendered + Math.min(COMMENTS_SHOW_PER_CLICK, (comments.length-commentsRendered));
      (store.dispatch as ThunkAppDispatch)(updateCommentsRendered(commentsRenderedQuantity));
      if(commentsRenderedQuantity >= comments.length) {
        setShowMoreFlag(false);
      }
    }
  }, [inView]);

  useEffect(() => {
    if(![...allGuitarsComments].slice().map((item)=>item[0]).includes(productId)){
      (store.dispatch as ThunkAppDispatch)(fetchCommentsDataAction(productId));
    }
  }, [allGuitarsComments]);

  useEffect(() => {
    (store.dispatch as ThunkAppDispatch)(updateCommentsRendered(COMMENTS_SHOW_PER_CLICK));
  }, [params]);

  useEffect(() => {
    const body = document.querySelector('body');
    if(body !== null){
      body.style.overflow = (isReviewPopupVisible || isReviewSentModalVisible) && isComponentVisible ? 'hidden' : 'auto';
    }
  }, [isReviewPopupVisible, isReviewSentModalVisible, isComponentVisible]);

  if(product === null || product === undefined) {
    navigate('*');
    return <div>{exit}</div>;
  } else {
    const {id, name, previewImg, rating, type, stringCount, vendorCode, price, description} = product;
    const imageAddress = `../img/content${previewImg.substring(previewImg.indexOf('/'))}`;
    const starRange = (rating !== 0 ? new Array(MAX_STAR_RATING).fill(0).fill(1, 0, Math.floor(rating)): null);
    const handleShowMoreButtonClick = (evt: MouseEvent<HTMLButtonElement>) => {
      evt.preventDefault();
      if(comments !== undefined && commentsRendered !== comments.length){
        const commentsRenderedQuantity: number = commentsRendered + Math.min(COMMENTS_SHOW_PER_CLICK, (comments.length-commentsRendered));
        (store.dispatch as ThunkAppDispatch)(updateCommentsRendered(commentsRenderedQuantity));
        if(commentsRenderedQuantity >= comments.length) {
          setShowMoreFlag(false);
        }
      }
    };

    const handleUpButtonClick = (evt: MouseEvent<HTMLAnchorElement>) => {
      evt.preventDefault();
      window.scrollTo(0, 0);
    };

    const handleAddReviewClick = (evt: MouseEvent<HTMLAnchorElement>) => {
      evt.preventDefault();
      setIsReviewPopupVisible(true);
      setIsComponentVisible(true);
      setIsReviewSentModalVisible(false);
    };

    const handleAddToCartClick = (evt: MouseEvent<HTMLAnchorElement>) => {
      evt.preventDefault();
      setIsModalCartAddVisible(true);
    };

    return (
      <>
        <Logo />
        <div className="wrapper">
          <Header />
          <main className="page-content">
            <div className="container">
              <h1 className="page-content__title title title--bigger">{name}</h1>
              <ul className="breadcrumbs page-content__breadcrumbs">
                <li className="breadcrumbs__item"><Link className="link" to="/">Главная</Link>
                </li>
                <li className="breadcrumbs__item"><Link className="link" to="/">Каталог</Link>
                </li>
                <li className="breadcrumbs__item"><a className="link">{name}</a>
                </li>
              </ul>
              <div className="product-container">
                <img className="product-container__img" src={imageAddress} width="90" height="235" alt={name} />
                <div className="product-container__info-wrapper">
                  <h2 className="product-container__title title title--big title--uppercase">{name}</h2>
                  <div className="rate product-container__rating" aria-hidden="true"><span className="visually-hidden">Рейтинг:</span>
                    {starRange?.map((item) => (
                      <svg key={name+nanoid()} width="14" height="14" aria-hidden="true">
                        <use xlinkHref={item === FULL_STAR ? '#icon-full-star' : '#icon-star'}></use>
                      </svg>
                    ))}
                    <span className="rate__count">
                      {comments !== undefined ? comments.length : 0}
                    </span>
                    <span className="rate__message"></span>
                  </div>
                  <div className="tabs">
                    <a className={`button button--medium tabs__button ${characteristic === CHARACTERISTICS[0] ? '' : 'button--black-border' }`} href="#characteristics"
                      onClick={() => setCharacteristic(CHARACTERISTICS[0])}
                    >
                      Характеристики
                    </a>
                    <a className={`button ${characteristic === CHARACTERISTICS[1] ? '' : 'button--black-border' } button--medium tabs__button`}
                      href="#description"
                      onClick={(evt) => setCharacteristic(CHARACTERISTICS[1])}
                    >
                      Описание
                    </a>
                    <div className="tabs__content" id="characteristics">
                      <table className={`tabs__table ${characteristic === CHARACTERISTICS[0] ? '' : 'hidden'}`}>
                        <tr className="tabs__table-row">
                          <td className="tabs__title">Артикул:</td>
                          <td className="tabs__value">{vendorCode}</td>
                        </tr>
                        <tr className="tabs__table-row">
                          <td className="tabs__title">Тип:</td>
                          <td className="tabs__value">{GUITAR_TYPE_SINGLE[type]}</td>
                        </tr>
                        <tr className="tabs__table-row">
                          <td className="tabs__title">Количество струн:</td>
                          <td className="tabs__value">{stringCount} струнная</td>
                        </tr>
                      </table>
                      <p className={`tabs__product-description ${characteristic === CHARACTERISTICS[1] ? '' : 'hidden'}`}>
                        {description}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="product-container__price-wrapper">
                  <p className="product-container__price-info product-container__price-info--title">Цена:</p>
                  <p className="product-container__price-info product-container__price-info--value">{price.toLocaleString('ru-RU')} ₽</p>
                  <a className="button button--red button--big product-container__button" href="#" onClick={handleAddToCartClick} >Добавить в корзину</a>
                </div>
              </div>
              <section className="reviews">
                <h3 className="reviews__title title title--bigger">Отзывы</h3>
                <a className="button button--red-border button--big reviews__submit-button" onClick={handleAddReviewClick} href="#header">Оставить отзыв</a>
                {comments === undefined
                  ? <div>{exit}</div>
                  : comments.slice(0, Math.min(commentsRendered, comments.length)).map((comment) => (
                    <div key={comment.id} className="review">
                      <div className="review__wrapper">
                        <h4 className="review__title review__title--author title title--lesser">{comment.userName}</h4><span className="review__date">{dayjs(comment.createAt).format('D MMMM')}</span>
                      </div>
                      <div className="rate review__rating-panel" aria-hidden="true"><span className="visually-hidden">Рейтинг:</span>
                        {new Array(MAX_STAR_RATING).fill(0).fill(1, 0, Math.floor(comment.rating))?.map((item) => (
                          <svg key={name+nanoid()} width="16" height="16" aria-hidden="true">
                            <use xlinkHref={item === FULL_STAR ? '#icon-full-star' : '#icon-star'}></use>
                          </svg>
                        ))}
                        <span className="rate__count"></span><span className="rate__message"></span>
                      </div>
                      <h4 className="review__title title title--lesser">Достоинства:</h4>
                      <p className="review__value">{comment.advantage}</p>
                      <h4 className="review__title title title--lesser">Недостатки:</h4>
                      <p className="review__value">{comment.disadvantage}</p>
                      <h4 className="review__title title title--lesser">Комментарий:</h4>
                      <p className="review__value">{comment.comment}</p>
                    </div>
                  ))}
                {comments !== undefined && comments?.length <= 3
                  ? ''
                  : showMoreFlag && <button className="button button--medium reviews__more-button" style={{ zIndex: '1000'}} onClick={handleShowMoreButtonClick}>Показать еще отзывы</button>}
                <a className="button button--up button--red-border button--big reviews__up-button" style={{ zIndex: '1000'}} onClick={handleUpButtonClick} href="#">Наверх</a>
              </section>
            </div>
          </main>
          <Footer />
        </div>
        <div ref={ref}></div>
        {isComponentVisible && isReviewPopupVisible && <PopupForm guitarName={name} refPopup={refPopup} setIsComponentVisible={setIsComponentVisible} setIsReviewPopupVisible={setIsReviewPopupVisible} setIsReviewSentModalVisible={setIsReviewSentModalVisible} guitarId={productId} />}
        {isComponentVisible && isReviewSentModalVisible && <ReviewSentModal id={id} refReviewSent={refReviewSent} setIsComponentVisible={setIsComponentVisible} setIsReviewSentModalVisible={setIsReviewSentModalVisible} setIsReviewPopupVisible={setIsReviewPopupVisible}/>}
        {isModalCartAddVisible && <ModalCartAdd setIsComponentVisible={setIsComponentVisible} setIsModalCartAddVisible={setIsModalCartAddVisible}/>}
      </>
    );
  }}

export {GuitarPage};
export default connector(GuitarPage);
