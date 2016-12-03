#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Created on Sat Dec  3 12:58:52 2016

@author: seiteta
"""
import pandas as pd

# Read the data
data = pd.read_csv("data+words.csv")

# Generate data without groupby
words_serie = data['Si vous deviez décrire en 1 mot votre président(e) idéal(e) quel serait-il ?']
words_count = words_serie.value_counts()
words_count = words_count.to_frame()
words_count=words_count.reset_index()
words_count = words_count.rename(columns={'Si vous deviez décrire en 1 mot votre président(e) idéal(e) quel serait-il ?': 'value',
                                          'index': 'answer'})
words_count['value'] = words_count['value']/words_count['value'].sum()
words_count=words_count.head(50)
words_count.to_csv("question11.csv", encoding="utf-8")


# Generate data with groupby for different variables
data = data.rename(columns={'Quel âge avez-vous ?': 'age', 'Quelle est votre profession ?': 'profession',
                            'Vous êtes :': 'sexe', 'Quelle est votre tranche de revenu annuel ?':'revenu',
                            'Quelle est la taille de votre commune ?':'taille-commune',
                            'À quelle tendance politique vous identifiez-vous?':'tendance',
                            'Si vous deviez décrire en 1 mot votre président(e) idéal(e) quel serait-il ?': 'answer'})

variables = ['age', 'profession', 'sexe', 'revenu', 'taille-commune', 'tendance'] 

for variable in variables:
    agg = data[[variable,'answer']]
    categories = agg[variable].unique()
    grouped_words_count = pd.DataFrame()    
    for category in categories:
        if pd.isnull(category) == False:
            words_serie = agg[agg[variable]== category]
            words_count = words_serie['answer'].value_counts()
            total = words_count.sum()
            words_count = words_count.to_frame()
            words_count=words_count.reset_index()
            words_count[variable] = category
            words_count['total'] = total
            words_count=words_count.head(50)
            
        grouped_words_count = grouped_words_count.append(words_count, ignore_index = True)   
        
    grouped_words_count = grouped_words_count.rename(columns={'answer':'count', 'index':'answer'})
    grouped_words_count['value'] = grouped_words_count['count']/grouped_words_count['total']    
    grouped_words_count = grouped_words_count[[variable, 'answer', 'count', 'total', 'value']]    
    filename = 'question11-' + variable + '.csv'
    grouped_words_count.to_csv(filename, encoding="utf-8")