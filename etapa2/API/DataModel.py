from pydantic import BaseModel


class NewsInput(BaseModel):
    ID: str
    Titulo: str
    Descripcion: str
    Fecha: str


class NewsRetrain(BaseModel):
    ID: str
    Titulo: str
    Descripcion: str
    Fecha: str
    Label: int