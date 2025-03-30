import { Container, Row, Col, Alert } from 'react-bootstrap'
import axios from 'axios'
import Papa from 'papaparse'
import { useState } from 'react'
import NavBar from './NavBar'
import Footer from './Footer'
import FileNewsForm from './FileNewsForm'
import PredictionResults from './PredictionResults'

const NewsAnalysisPage = () => {
  const [news, setNews] = useState([])
  const [results, setResults] = useState(null)
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)

  const predictFromFile = (file) => {
    if (!file) {
      setError('Sube un archivo.')
      return
    }

    const reader = new FileReader()
    reader.onload = (event) => {
      const csvData = event.target.result
      Papa.parse(csvData, {
        header: true,
        complete: (results) => {
          const data = results.data
          if (data.length > 0) {
            setNews(data)
            setLoading(true)
            axios
              .post('http://localhost:8000/predict', data)
              .then((response) => {
                setResults(response.data)
                setError(null)
              })
              .catch((error) => {
                setError('Error al realizar la predicción')
                console.error(error)
              })
              .finally(() => setLoading(false))
          }
        },
        error: (error) => {
          setError('Error al parsear el archivo CSV')
          console.error(error)
        }
      })
    }

    reader.readAsText(file)
  }

  const reset = () => {
    setNews([])
    setResults(null)
    setError(null)
  }

  return (
    <>
      <NavBar />
      <Container className='py-5'>
        <h1 className='mb-4'>Análisis de Noticias Falsas</h1>
        <Row>
          <FileNewsForm
            onSubmit={predictFromFile}
            loading={loading}
            onBack={reset}
            clearResults={() => setResults(null)}
            setError={setError}
          />
        </Row>
        {error && (
          <Alert variant='danger' className='mt-3'>
            {error}
          </Alert>
        )}
        {results && (
          <Row className='mt-5'>
            <Col>
              <PredictionResults results={results} news={news} />
            </Col>
          </Row>
        )}
      </Container>
      <Footer />
    </>
  )
}

export default NewsAnalysisPage
