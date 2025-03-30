import { Container, Navbar, Nav } from 'react-bootstrap';

const NavBar = () => {
  return (
    <Navbar bg='light' expand='lg'>
      <Container>
        <Navbar.Brand href='/'>
          <span className='ms-3'>Análisis de Noticias Falsas</span>
        </Navbar.Brand>
        <Navbar.Toggle aria-controls='basic-navbar-nav' />
        <Navbar.Collapse id='basic-navbar-nav'>
          <Nav className='ms-auto'>
            <Nav.Link href='/predict'>Analizar Noticias</Nav.Link>
            <Nav.Link href='/retrain'>Reentrenar Modelo</Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavBar;