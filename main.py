import pandas as pd
import os

os.chdir("C:\\Users\\Chase Lean\\Desktop\\Javascript\\47 Learn german 2")

data = pd.read_excel("german_words.xlsx")
data.to_csv("output.csv", encoding="utf-8", index=False)

os.chdir("C:\\Users\\Chase Lean\\AppData\\Local\\Programs\\Microsoft VS Code")
os.system("start Code.exe")


