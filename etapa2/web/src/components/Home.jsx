import { Container, Row, Col, Button, Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import NavBar from './NavBar';
import Footer from './Footer';

const Home = () => {
  return (
    <>
      <NavBar />

      <Container fluid className='text-center bg-light py-5'>
        <h1 className='display-4'>
          Clasifica noticias falsas
        </h1>
        <p className='lead'>
          Automatiza el la clasificación de noticias falsas.
        </p>
        <div className='mt-4'>
          <Link to="/predict">
            <Button variant='primary' size='lg' className='me-3'>
              Analizar Noticias
            </Button>
          </Link>
          <Link to="/retrain">
            <Button variant='outline-primary' size='lg'>
              Reentrenar Modelo
            </Button>
          </Link>
        </div>
      </Container>

      <Container className='py-5'>
        <Row>
          <Col md={6} className='mb-4'>
            <Card>
              <Card.Body className='text-center'>
                <Card.Title>Analizar Noticias</Card.Title>
                <Card.Text>
                  Envía noticias y descubre si es falsa o verdadera.
                </Card.Text>
                <Link to="/predict">
                  <Button variant='primary'>
                    Acceder
                  </Button>
                </Link>
              </Card.Body>
            </Card>
          </Col>
          <Col md={6} className='mb-4'>
            <Card>
              <Card.Body className='text-center'>
                <Card.Title>Reentrenar el Modelo</Card.Title>
                <Card.Text>
                  Sube nuevos datos y mejora el modelo de análisis
                  automáticamente.
                </Card.Text>
                <Link to="/retrain">
                  <Button variant='outline-primary'>
                    Acceder
                  </Button>
                </Link>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>

      <Footer />
    </>
  );
}

export default Home;