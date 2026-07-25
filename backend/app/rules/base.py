from abc import ABC, abstractmethod
from typing import Dict, Any, Optional
from bs4 import BeautifulSoup

class BaseRule(ABC):
    rule_id: str
    title: str
    
    @abstractmethod
    def evaluate(self, soup: BeautifulSoup, response_metadata: Dict[str, Any]) -> Dict[str, Any]:
        """
        Executes rule validation on parsed DOM soup and metadata.
        Returns a dictionary containing issue details, confidence, priority metrics, 
        business impact, and multi-framework code snippets.
        """
        pass