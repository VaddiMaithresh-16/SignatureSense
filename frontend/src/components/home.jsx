import { Link } from 'react-router-dom';
import Nav1 from './nav1';
import { ROUTES } from '../constants';
import '../css/home.css';

function Home() {
  return (
    <>
      <Nav1 />
      <section className="homepage_page">
        <h1>Signature Verification</h1>
        <br />
        <p>To Verify the signature and to prevent fraud click button below</p>
        <div className="homecontainer">
          <Link className="getstarted" to={ROUTES.LOGIN}>
            <button className="homebtn">Get Started</button>
          </Link>
        </div>
      </section>
    </>
  );
}

export default Home;