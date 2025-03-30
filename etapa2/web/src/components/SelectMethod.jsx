import { Button, Row, Col } from 'react-bootstrap'

const SelectMethod = ({ onSelect }) => {
  return (
    <Row className='mb-5 text-center'>
      <Col>
        <h4>Selecciona la forma de entrada</h4>
        <Button
          variant='primary'
          className='m-2'
          onClick={() => onSelect('manual')}
        >
          Ingresar Opiniones Manualmente
        </Button>
        <Button
          variant='outline-primary'
          className='m-2'
          onClick={() => onSelect('file')}
        >
          Subir Archivo
        </Button>
      </Col>
    </Row>
  )
}

export default SelectMethod