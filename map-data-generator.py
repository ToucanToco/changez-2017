#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Created on Fri Dec  2 16:20:32 2016

@author: seiteta
"""
import pandas as pd

# Read the data
data = pd.read_csv("change2017_full-extract_clean.csv")

# Keep only one version of the departement number 69
data = data.replace(to_replace="69D16 Rhône", value="69M16 Métropole de Lyon")        

# Group by departement and causes
agg = data.groupby(['Dans quel département habitez vous ?', 'Quelle est la cause qui vous tient le plus à coeur : ']).count()
agg = agg.reset_index()
agg = agg.rename(columns={'Dans quel département habitez vous ?': 'departement', 'Quelle est la cause qui vous tient le plus à coeur : ': 'answer', 'Timestamp': 'count'})
agg = agg[['departement','answer', 'count']]

# Keep the digits for the departement (or the text if there is no digit)
def dep_cleaner(string):
    if string[2].isdigit():
        return string[:3]
    elif string[0].isdigit():
        return string[:2]
    else:
        return string
        
agg['departement'] = agg['departement'].apply(dep_cleaner)

# Count the number of response per departement
total =  agg[['count','departement']].groupby(['departement']).sum()
total['departement'] = total.index
total = total.rename(columns={'count': 'total'})
agg = pd.merge(agg, total, on=['departement'], how='inner')

# Compute the percentage for each departement and each cause
agg['value']= agg['count']/agg['total']

# Export the data
agg.to_csv('question0-cause.csv', encoding="utf-8")