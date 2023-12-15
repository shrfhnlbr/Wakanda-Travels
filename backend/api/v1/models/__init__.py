# from sqlalchemy.ext.declarative import declarative_base
# from sqlalchemy import create_engine
# from sqlalchemy.orm.session import Session, sessionmaker
from flask_sqlalchemy import SQLAlchemy

# Base = declarative_base()
db = SQLAlchemy()


# class DB:
#     """DB Class"""

#     def __init__(self) -> None:
#         """Initialization of Database instance"""
#         self._engine = create_engine("mysql://root@localhost", echo=False)
#         Base.metadata.drop_all(self._engine)
#         Base.metadata.create_all(self._engine)
#         self.__session = None

#     @property
#     def _session(self) -> Session:
#         """Memoized session object"""
#         if self.__session is None:
#             DBSession = sessionmaker(bind=self._engine)
#             self.__session = DBSession()
#         return self.__session
