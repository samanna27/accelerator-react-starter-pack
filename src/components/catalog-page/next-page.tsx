import { Link } from 'react-router-dom';
import { SyntheticEvent } from 'react';

type NextPageProps = {
  onClick: (evt: SyntheticEvent<HTMLAnchorElement>) => void,
  isDeactivateNextPage: boolean,
}

function NextPage({onClick, isDeactivateNextPage}: NextPageProps): JSX.Element {
  return (
    <li className={`pagination__page pagination__page--next ${ isDeactivateNextPage ? 'pagination__page--active' : ''}`} id="next" >
      <Link className="link pagination__page-link" to="#"
        onClick={(evt) => {
          evt.preventDefault();
          onClick(evt);}}
      >
        Далее
      </Link>
    </li>
  );
}

export default NextPage;
