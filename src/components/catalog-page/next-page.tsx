import { Link } from 'react-router-dom';
import { SyntheticEvent } from 'react';

type NextPageProps = {
  onClick: (evt: SyntheticEvent<HTMLAnchorElement>) => void,
  pageURL: string,
}

function NextPage({onClick, pageURL}: NextPageProps): JSX.Element {

  return (
    <li className="pagination__page pagination__page--next" id="next" >
      <Link className="link pagination__page-link" to={pageURL}
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
