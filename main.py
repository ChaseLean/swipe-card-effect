import pandas as pd

data = pd.read_excel("german_words.xlsx")
data.to_csv("output.csv", encoding="utf-8", index=False)
