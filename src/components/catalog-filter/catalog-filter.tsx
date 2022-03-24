import { State } from '../../types/state';
import { connect, ConnectedProps } from 'react-redux';
import { FocusEvent, ChangeEvent, FormEvent, useState, useEffect, useRef} from 'react';
import { store } from '../../index';
import { updateMinPriceFilter, setMaxPriceFilter, updateGuitarTypeFilter, updateStringsTypeFilter, updateCardsRendered } from '../../store/action';
import { ThunkAppDispatch } from '../../types/action';
import { GUITAR_TYPE, STRINGS_QUANTITY_BY_GUITAR, GUITAR_STRINGS, CARDS_PER_PAGE } from '../../const';
import { nanoid } from 'nanoid';
import { StringsChecked, Guitar } from '../../types/guitar';
import { Filter } from '../../types/common';

type CatalogFilterProps = {
  guitarsForRendering: Guitar[],
  filter: Filter,
  changeFilter: (fieldName: string) => (value: string) => void,
  clearFilter: (filedName: string) => () => void,
}

const mapStateToProps =({minPriceFilter, maxPriceFilter, guitarType, cardsRendered, stringsQuantity}: State) => ({
  minPriceFilter,
  maxPriceFilter,
  guitarType,
  cardsRendered,
  stringsQuantity,
});

const connector = connect(mapStateToProps);

type PropsFromRedux = ConnectedProps<typeof connector>
type ConnectedComponentProps = PropsFromRedux & CatalogFilterProps;

function CatalogFilter({minPriceFilter, maxPriceFilter, guitarType, stringsQuantity, guitarsForRendering, filter, changeFilter, clearFilter}: ConnectedComponentProps):JSX.Element {
  const minPrice =  Math.min(...guitarsForRendering.map((guitar) => guitar.price));
  const maxPrice = Math.max(...guitarsForRendering.map((guitar) => guitar.price));
  const minPriceRef = useRef<HTMLInputElement>(null);
  const maxPriceRef = useRef<HTMLInputElement>(null);
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
    setIsMinPrice(minPriceFilter.toLocaleString('ru'));
  }, [minPriceFilter]);

  useEffect(() => {
    setIsMaxPrice(maxPriceFilter.toLocaleString('ru'));
  }, [maxPriceFilter]);

  const handlePriceBlur = (evt: FocusEvent<HTMLInputElement>) => {
    evt.preventDefault();
    const value = Math.max(Math.max(minPriceFilter, Number(minPrice)), Math.min(Math.min(maxPriceFilter, Number(maxPrice)), Number(evt.target.value)));

    if(evt.target.id === 'priceMin' ){
      if(minPriceRef.current !== null) {
        minPriceRef.current.value = value.toString();
      }
      setIsMinPrice(value.toString());
      (store.dispatch as ThunkAppDispatch)(updateMinPriceFilter(value));
    }
    if(evt.target.id === 'priceMax' ){
      if(maxPriceRef.current !== null) {
        maxPriceRef.current.value = value.toString();
      }
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
      if(+evt.target.value > maxPriceFilter) {
        evt.target.setCustomValidity('Минимальная цена не может быть больше максимальной.');
      }
      setIsMinPrice(value);
    }
    if(evt.target.id === 'priceMax' ){
      if(+evt.target.value < minPriceFilter) {
        evt.target.setCustomValidity('Максимальная цена не может быть меньше минимальной.');
      }
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
    const guitarTypeState = {};
    const stringsOfGuitarTypesChecked: Set<number> = new Set();
    Object.assign(guitarTypeState, guitarType);// копируем объект со статусом по активированным типам гитар
    const guitarCheckedStrings = Object.entries(guitarTypeState).filter((item) => item[1] === true).map((item)=> STRINGS_QUANTITY_BY_GUITAR[item[0]]); //формируем массив массивов струн по активированным типам гитар
    guitarCheckedStrings.forEach((guitarStrings) => guitarStrings.forEach((strings)=> stringsOfGuitarTypesChecked.add(strings))); // формируем Set струн по активированным гитарам

    stringsQuantity.forEach((stringChecked) => {
      if(stringsOfGuitarTypesChecked.has(stringChecked)){
        return '';
      } else {
        handleStringsQuantityChange(stringChecked);
      }
    });

    setIsStringsActive(stringsOfGuitarTypesChecked); //пушим Set струн по активированным гитарам в состояние
  }, [guitarType]);

  useEffect(() => {
    if(minPriceRef.current && minPriceRef.current.value !== '' && Number(minPriceRef.current?.value) < minPrice) {
      minPriceRef.current.value = minPrice.toString();
      (store.dispatch as ThunkAppDispatch)(updateMinPriceFilter(minPrice));
    }
    if(maxPriceRef.current && Number(maxPriceRef.current?.value) > maxPrice) {
      maxPriceRef.current.value = maxPrice.toString();
    }
  }, [guitarType, stringsQuantity]);

  const handleStringsQuantityChange = (item: number) => {
    stringsChecked[item] = !stringsChecked[item]; // отмечаем, какое количество струн было выбрано
    setStringsChecked(stringsChecked); // меняем объект состояния выбранных струн
    const stringsQuantityChecked: number[] = [];
    stringsQuantity.forEach((strings) => stringsQuantityChecked.push(strings)); // копируем массив с выбранными струнами из состояния. Дальше добавляем или удаляем из массива струны в зависимости от состояния клика (true - выбрали, false - удалили)

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
            <input type="number" ref={minPriceRef} placeholder={minPrice.toLocaleString('ru')} id="priceMin" name="от" defaultValue={isMinPrice} onBlur={(evt) => handlePriceBlur(evt)} onChange={(evt) => handlePriceChange(evt)} />
          </div>
          <div className="form-input">
            <label className="visually-hidden">Максимальная цена</label>
            <input type="number" ref={maxPriceRef} placeholder={maxPrice.toLocaleString('ru')} id="priceMax" name="до" defaultValue={isMaxPrice} onBlur={(evt) => handlePriceBlur(evt)} onChange={(evt) => handlePriceChange(evt)} />
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
            <input className="visually-hidden" type="checkbox" id={`${item}-strings`} name={`${item}-strings`} disabled={!isStringsActive.has(item)} checked={stringsChecked[item]} onChange={(evt) => handleStringsQuantityChange(item)} />
            <label htmlFor={`${item}-strings`}>{item}</label>
          </div>))}
      </fieldset>
    </form>
  );
}

export {CatalogFilter};
export default connector(CatalogFilter);
