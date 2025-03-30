import unicodedata
from num2words import num2words
from sklearn.base import BaseEstimator, TransformerMixin
import contractions
from nltk.tokenize import word_tokenize
from nltk.corpus import stopwords
from nltk.stem import SnowballStemmer, WordNetLemmatizer
import re


class TextPreprocessor(BaseEstimator, TransformerMixin):
    def fit(self, X, y=None):
        return self

    def to_lowercase(self, words):
        return [word.lower() for word in words]

    def remove_punctuation(self, words):
        """Remove punctuation from list of tokenized words"""
        new_words = []
        for word in words:
            if word is not None:
                new_word = re.sub(r'[^\w\s]', '', word)
                if new_word != '':
                    new_words.append(new_word)
        return new_words

    def remove_stopwords(self, words):
        stop_words = stopwords.words('spanish')
        return [word for word in words if word not in stop_words]

    def remove_non_ascii(self, words):
        """Remove non-ASCII characters from list of tokenized words"""
        new_words = []
        for word in words:
            if word is not None:
                new_word = unicodedata.normalize('NFKD', word).encode('ascii', 'ignore').decode('utf-8', 'ignore')
                new_words.append(new_word)
        return new_words

    def replace_numbers(self, words):
        """Replace all integer occurrences in list of tokenized words with textual representation"""
        new_words = []
        for word in words:
            if word.isdigit():
                new_word = num2words(int(word), lang='es')
                new_words.append(new_word)
            else:
                new_words.append(word)
        return new_words

    def stem_words(self, words):
        stemmer = SnowballStemmer("spanish")
        return [stemmer.stem(word) for word in words]

    def lemmatize_words(self, words):
        lemmatizer = WordNetLemmatizer()
        return [lemmatizer.lemmatize(word) for word in words]

    def stem_and_lemmatize(self, words):
        stemmed_words = self.stem_words(words)
        lemmatized_words = self.lemmatize_words(stemmed_words)
        return lemmatized_words

    def transform(self, X, y=None):
        processed_texts = []
        for text in X:
            text = contractions.fix(text)
            tokens = word_tokenize(text)
            tokens = self.to_lowercase(tokens)
            tokens = self.remove_punctuation(tokens)
            tokens = self.remove_stopwords(tokens)
            tokens = self.remove_non_ascii(tokens)
            tokens = self.replace_numbers(tokens)
            tokens = self.stem_and_lemmatize(tokens)
            processed_texts.append(' '.join(tokens))
        return processed_texts

