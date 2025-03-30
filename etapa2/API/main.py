import logging
from typing import List

import pandas as pd
from fastapi import FastAPI, HTTPException

from DataModel import NewsInput, NewsRetrain
from utils import predict_proba, retrain_model

app = FastAPI()

logging.basicConfig(filename='model_logs.log',
                    level=logging.INFO,
                    format='%(asctime)s:%(levelname)s:%(message)s')

@app.get("/")
def read_root():
    return {"Hello": "World"}

@app.post("/predict")
def predict(news: List[NewsInput]):
    logging.info(f"Datos recibidos para prediccion: {news}")
    try:
        df = pd.DataFrame([news_item.model_dump() for news_item in news])

        predictions, probabilities = predict_proba(df['Descripcion'])

        logging.info(f"Predicciones: {predictions}")
        logging.info(f"Probabilidades: {probabilities}")

        return {
            "predictions": predictions.tolist(),
            "probabilities": probabilities.tolist()
        }
    except Exception as e:
        logging.error(f"Error en la prediccion: {str(e)}")
        raise HTTPException(status_code=500, detail="Error en la prediccion")


@app.post("/retrain")
def retrain(news: List[NewsRetrain]):
    logging.info(f"Datos recibidos para reentrenar: {news}")
    try:
        df = pd.DataFrame([news_item.model_dump() for news_item in news])

        precision, recall, f1 = retrain_model(df['Descripcion'], df['Label'])

        logging.info(f"Metricas tras reentrenamiento - Precision: {precision}, Recall: {recall}, F1: {f1}")
        return {
            "precision": precision,
            "recall": recall,
            "f1": f1
        }
    except Exception as e:
        logging.error(f"Error en el reentrenamiento: {str(e)}")
        raise HTTPException(status_code=500, detail="Error en el reentrenamiento")