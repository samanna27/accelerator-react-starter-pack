import { Link } from 'react-router-dom';
import { SyntheticEvent } from 'react';

type PreviousPageProps = {
  onClick: (evt: SyntheticEvent<HTMLAnchorElement>) => void,
  isDeactivatePreviousPage: boolean,
}

function PreviousPage({onClick, isDeactivatePreviousPage}: PreviousPageProps): JSX.Element {

  return (
    <li className={`pagination__page pagination__page--next ${ isDeactivatePreviousPage ? 'pagination__page--active' : ''}`} id="next" >
      <Link className="link pagination__page-link" to="#"
        onClick={(evt) => {
          onClick(evt);
        }}
      >
      Назад
      </Link>
    </li>
  );
}

export default PreviousPage;
