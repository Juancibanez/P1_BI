import { Container, Navbar, Nav } from 'react-bootstrap';
import Logo from '../assets/images/UNFPA_logo.png';

const NavBar = () => {
  return (
    <Navbar bg='light' expand='lg'>
      <Container>
        <Navbar.Brand href='/'>
          <img src={Logo} alt='UNFPA Logo' width='40' />
          <span className='ms-3'>Análisis de Opiniones y ODS</span>
        </Navbar.Brand>
        <Navbar.Toggle aria-controls='basic-navbar-nav' />
        <Navbar.Collapse id='basic-navbar-nav'>
          <Nav className='ms-auto'>
            <Nav.Link href='/predict'>Analizar Opiniones</Nav.Link>
            <Nav.Link href='/retrain'>Reentrenar Modelo</Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavBar;