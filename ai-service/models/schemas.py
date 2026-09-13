from pydantic import BaseModel
from typing import List

class RiskItem(BaseModel):
    clause: str
    problem: str
    law: str
    advice: str

class AnalysisReport(BaseModel):
    status: str
    file_name: str
    contract_length: int
    critical_risks: List[RiskItem]
    moderate_risks: List[RiskItem]
    all_good: List[str]
    conclusion: str
    language: str