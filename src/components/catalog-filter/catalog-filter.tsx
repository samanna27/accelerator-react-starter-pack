import { State } from '../../types/state';
import { connect, ConnectedProps } from 'react-redux';
import { FocusEvent, ChangeEvent, FormEvent, useState, useEffect} from 'react';
import { store } from '../../index';
import { updateMinPriceFilter, setMaxPriceFilter, updateGuitarTypeFilter, updateStringsTypeFilter, updateCardsRendered } from '../../store/action';
import { ThunkAppDispatch } from '../../types/action';
import { GUITAR_TYPE, STRINGS_QUANTITY_BY_GUITAR, GUITAR_STRINGS, CARDS_PER_PAGE } from '../../const';
import { nanoid } from 'nanoid';
import { StringsChecked } from '../../types/guitar';

const mapStateToProps =({guitars, minPriceFilter, maxPriceFilter, guitarType, cardsRendered, stringsQuantity}: State) => ({
  guitars,
  minPriceFilter,
  maxPriceFilter,
  guitarType,
  cardsRendered,
  stringsQuantity,
});

const connector = connect(mapStateToProps);

type PropsFromRedux = ConnectedProps<typeof connector>
type ConnectedComponentProps = PropsFromRedux;

function CatalogFilter({guitars, minPriceFilter, maxPriceFilter, guitarType, stringsQuantity}: ConnectedComponentProps):JSX.Element {
  const minPrice = Math.min(...guitars.map((guitar) => guitar.price));
  const maxPrice = Math.max(...guitars.map((guitar) => guitar.price));
  const [isMinPrice, setIsMinPrice] = useState<string>('');
  const [isMaxPrice, setIsMaxPrice] = useState<string>('');
  const [isStringsActive, setIsStringsActive] = useState<Set<number>>(new Set());
  const [stringsChecked, setStringsChecked] = useState<StringsChecked>({
    4: false,
    6: false,
    7: false,
    12: false,
  });

  useEffect(() => {
    setIsMinPrice(minPriceFilter.toString());
  }, [minPriceFilter]);

  useEffect(() => {
    setIsMaxPrice(maxPriceFilter.toString());
  }, [maxPriceFilter]);

  const handlePriceBlur = (evt: FocusEvent<HTMLInputElement>) => {
    evt.preventDefault();
    const value = Math.max(Number(minPrice), Math.min(Number(maxPrice), Number(evt.target.value)));

    if(evt.target.id === 'priceMin' ){
      setIsMinPrice(value.toString());
      (store.dispatch as ThunkAppDispatch)(updateMinPriceFilter(value));
    }
    if(evt.target.id === 'priceMax' ){
      setIsMaxPrice(value.toString());
      (store.dispatch as ThunkAppDispatch)(setMaxPriceFilter(value));
    }
  };

  const handlePriceChange = (evt: ChangeEvent<HTMLInputElement>) => {
    evt.preventDefault();

    const value = evt.target.value;

    if (+evt.target.value < 0) {
      evt.target.setCustomValidity('Цена не может быть меньше 0.');
    } else if(evt.target.id === 'priceMin' && +evt.target.value < minPrice) {
      evt.target.setCustomValidity(`Минимальная цена - ${minPrice}`);
    } else if(evt.target.id === 'priceMax' && +evt.target.value > maxPrice) {
      evt.target.setCustomValidity(`Максимальная цена - ${maxPrice}`);
    } else {
      evt.target.setCustomValidity('');
    }

    if(evt.target.id === 'priceMin' ){
      setIsMinPrice(value);
    }
    if(evt.target.id === 'priceMax' ){
      setIsMaxPrice(value);
    }

    evt.target.reportValidity();
  };

  const handleGuitarTypeChange = (evt: FormEvent<HTMLInputElement>) => {
    evt.preventDefault();
    const type = evt.currentTarget.name;
    (store.dispatch as ThunkAppDispatch)(updateCardsRendered([0, CARDS_PER_PAGE]));
    (store.dispatch as ThunkAppDispatch)(updateGuitarTypeFilter(type));
  };

  useEffect(() => {
    const guitarTypeState ={};
    const stringsOfTypesChecked: Set<number> = new Set();
    Object.assign(guitarTypeState, guitarType);// копируем объект со статусом по активированным типам гитар
    const guitarCheckedStrings = Object.entries(guitarTypeState).filter((item) => item[1] === true).map((item)=> STRINGS_QUANTITY_BY_GUITAR[item[0]]); //формируем массив массивов струн по активированным типам гитар
    guitarCheckedStrings.forEach((guitarStrings) => guitarStrings.forEach((strings)=> stringsOfTypesChecked.add(strings))); // формируем Set струн по активированным гитарам
    setIsStringsActive(stringsOfTypesChecked); //пушим Set струн по активированным гитарам в состояние
  }, [guitarType]);

  const handleStringsQuantityChange = (item: number) => {
    stringsChecked[item] = !stringsChecked[item]; // отмечаем, какое количество струн было выбрано
    setStringsChecked(stringsChecked); // меняем объект состояния выбранных струн
    const stringsQuantityChecked = stringsQuantity; // присваиваем массив с выбранными струнами из состояния. Дальше добавляем или удаляем из массива струны в зависимости от состояния клика (true - выбрали, false - удалили)

    if(stringsChecked[item] === true) {
      Object.assign(stringsQuantityChecked, Object.entries(stringsChecked).filter((stringsValue) => stringsValue[1] === true).map((stringsKey) => +stringsKey[0]));
    } else {
      stringsQuantityChecked.splice(stringsQuantityChecked.indexOf(item),1);
    }

    (store.dispatch as ThunkAppDispatch)(updateStringsTypeFilter(stringsQuantityChecked));
    (store.dispatch as ThunkAppDispatch)(updateCardsRendered([0, CARDS_PER_PAGE]));
  };

  return (
    <form className="catalog-filter">
      <h2 className="title title--bigger catalog-filter__title">Фильтр</h2>
      <fieldset className="catalog-filter__block">
        <legend className="catalog-filter__block-title">Цена, ₽</legend>
        <div className="catalog-filter__price-range">
          <div className="form-input">
            <label className="visually-hidden">Минимальная цена</label>
            <input type="number" placeholder={minPrice.toString()} id="priceMin" name="от" value={isMinPrice} onBlur={(evt) => handlePriceBlur(evt)} onChange={(evt) => handlePriceChange(evt)} />
          </div>
          <div className="form-input">
            <label className="visually-hidden">Максимальная цена</label>
            <input type="number" placeholder={maxPrice.toLocaleString('ru-RU')} id="priceMax" name="до" value={isMaxPrice} onBlur={(evt) => handlePriceBlur(evt)} onChange={(evt) => handlePriceChange(evt)} />
          </div>
        </div>
      </fieldset>
      <fieldset className="catalog-filter__block" >
        <legend className="catalog-filter__block-title">Тип гитар</legend>
        {Object.keys(GUITAR_TYPE).map((item) => {
          const type: string = item;
          return (
            <div key={nanoid()} className="form-checkbox catalog-filter__block-item">
              <input className="visually-hidden" type="checkbox" id={type} name={type} defaultChecked={guitarType[type]} onChange={(evt) => handleGuitarTypeChange(evt)} />
              <label htmlFor={type}>{GUITAR_TYPE[type]}</label>
            </div>);
        })}
      </fieldset>
      <fieldset className="catalog-filter__block">
        <legend className="catalog-filter__block-title">Количество струн</legend>
        {GUITAR_STRINGS.map((item) => (
          <div key={item} className="form-checkbox catalog-filter__block-item">
            <input className="visually-hidden" type="checkbox" id={`${item}-strings`} name={`${item}-strings`} disabled={!isStringsActive.has(item)} onChange={(evt) => handleStringsQuantityChange(item)} />
            <label htmlFor={`${item}-strings`}>{item}</label>
          </div>))}
      </fieldset>
    </form>
  );
}

export {CatalogFilter};
export default connector(CatalogFilter);
