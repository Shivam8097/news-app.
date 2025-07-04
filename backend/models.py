from sqlalchemy import Column, Integer, String, DateTime, Boolean, ForeignKey, Float
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship
import datetime

Base = declarative_base()

class User(Base):
    __tablename__ = 'users'
    id = Column(Integer, primary_key=True)
    username = Column(String, unique=True, nullable=False)
    password_hash = Column(String, nullable=False)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    activities = relationship('UserActivity', back_populates='user')

class Article(Base):
    __tablename__ = 'articles'
    id = Column(Integer, primary_key=True)
    title = Column(String, nullable=False)
    url = Column(String, nullable=False)
    # Add more fields as needed
    activities = relationship('UserActivity', back_populates='article')

class UserActivity(Base):
    __tablename__ = 'user_activities'
    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey('users.id'))
    article_id = Column(Integer, ForeignKey('articles.id'))
    time_spent = Column(Float, default=0.0)  # seconds
    liked = Column(Boolean, default=None)  # True=like, False=dislike, None=not rated
    clicked_full_article = Column(Boolean, default=False)
    timestamp = Column(DateTime, default=datetime.datetime.utcnow)

    user = relationship('User', back_populates='activities')
    article = relationship('Article', back_populates='activities') 