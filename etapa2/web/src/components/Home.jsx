import { Container, Row, Col, Button, Card } from 'react-bootstrap';
import { Link } from 'react-router-dom'; // Importa Link
import NavBar from './NavBar';
import Footer from './Footer';

const Home = () => {
  return (
    <>
      {/* Header */}
      <NavBar />

      {/* Hero Section */}
      <Container fluid className='text-center bg-light py-5'>
        <h1 className='display-4'>
          Relacionando Opiniones Ciudadanas con los ODS
        </h1>
        <p className='lead'>
          Automatiza el análisis de opiniones para los Objetivos de Desarrollo
          Sostenible.
        </p>
        <div className='mt-4'>
          <Link to="/predict"> {/* Cambiar href a Link */}
            <Button variant='primary' size='lg' className='me-3'>
              Analizar Opiniones
            </Button>
          </Link>
          <Link to="/retrain"> {/* Cambiar href a Link */}
            <Button variant='outline-primary' size='lg'>
              Reentrenar Modelo
            </Button>
          </Link>
        </div>
      </Container>

      {/* Functionalities Section */}
      <Container className='py-5'>
        <Row>
          <Col md={6} className='mb-4'>
            <Card>
              <Card.Body className='text-center'>
                <Card.Title>Analizar Opiniones</Card.Title>
                <Card.Text>
                  Envía opiniones y descubre cómo se relacionan con los ODS 3, 4
                  y 5.
                </Card.Text>
                <Link to="/predict"> {/* Cambiar href a Link */}
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
                <Link to="/retrain"> {/* Cambiar href a Link */}
                  <Button variant='outline-primary'>
                    Acceder
                  </Button>
                </Link>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>

      {/* Footer */}
      <Footer />
    </>
  );
}

export default Home;