from joblib import dump, load
import pandas as pd
from sklearn.metrics import f1_score, precision_score, recall_score
from sklearn.model_selection import train_test_split


model = load("assets/model.joblib")


def predict_proba(news: pd.Series):
    predictions = model.predict(news)
    probabilities = model.predict_proba(news)

    return predictions, probabilities


def retrain_model(news: pd.Series, labels: pd.Series):

    X_train, X_test, y_train, y_test = train_test_split(news, labels, test_size=0.2, random_state=0)

    processed_train = model.named_steps['preprocessor'].transform(X_train)
    X_train_vectorized = model.named_steps['vectorizer'].transform(processed_train)

    classifier = model.named_steps['classifier']

    classifier.fit(X_train_vectorized, y_train)

    processed_test = model.named_steps['preprocessor'].transform(X_test)
    X_test_vectorized = model.named_steps['vectorizer'].transform(processed_test)

    y_pred = classifier.predict(X_test_vectorized)

    precision = precision_score(y_test, y_pred, average='weighted')
    recall = recall_score(y_test, y_pred, average='weighted')
    f1 = f1_score(y_test, y_pred, average='weighted')

    dump(model, "assets/model.joblib")

    return precision, recall, f1


