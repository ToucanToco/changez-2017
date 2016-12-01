# -*- coding: utf8 -*-
# from __future__ import unicode_literals
# import fs
import sys
import os
import pandas as pd
from text_unidecode import unidecode

FILENAME = 'change2017_full-extract_clean.csv'

print 'Start'
print '-------------'
df = pd.read_csv(FILENAME, sep=',')

# CLean question wordcloud
import unicodedata

def clean_value(v):
    # import ipdb; ipdb.set_trace()
    try:
        if len(v) > 4:
            return v.strip().lower()
        else:
            return "notaword"
    except Exception as e:
        #print "can't decode {} -- skipping".format(v)
        # return v
        return 'notaword'

wordcloud_col = "Si vous deviez décrire en 1 mot votre président(e) idéal(e) quel serait-il ?"
df[wordcloud_col] = df[wordcloud_col].apply(clean_value)

demo_cols = [
    'Quel âge avez-vous ?',
    'Quelle est votre profession ?',
    'Vous êtes :',
    'Quelle est votre tranche de revenu annuel ?',
    'Dans quel département habitez vous ?',
    'Quelle est la taille de votre commune ?',
    'À quelle tendance politique vous identifiez-vous?',
]

question_columns_without_segments = [col for col in df.columns if col != 'Timestamp' and col not in demo_cols]
question_columns = [col for col in df.columns if col != 'Timestamp']


df['count'] = 1
df = df.set_index('Timestamp')


def compute_question_count_by_seg(q_index, segmentation_col=None, rename_segment=None):
    if not segmentation_col:
        segmentation_col = demo_cols[0]
    if not rename_segment:
        rename_segment = segmentation_col

    columns_to_keep = [question_columns[q_index], 'count', segmentation_col]
    df_q = df[columns_to_keep]


    agg_df = df_q.groupby([segmentation_col, question_columns[q_index]]).count().reset_index()


    segment_totals = df_q.groupby(segmentation_col).sum().reset_index()
    segment_totals = segment_totals.rename(columns={'count': 'total'})

    agg_df = agg_df.merge(segment_totals, on=[segmentation_col])
    agg_df['value'] = agg_df['count'] / agg_df['total']
    agg_df = agg_df.rename(columns={
        question_columns[q_index]: 'answer',
        segmentation_col: rename_segment
    })
    return agg_df

def compute_question_repartition(q_index):
    """
    Compute the repartition of the answers for a given question
    """
    df_q = df[[question_columns[q_index], 'count']]

    agg_df = df_q.groupby(question_columns[q_index]).count().reset_index()
    total = agg_df['count'].sum()

    agg_df['count'] = agg_df['count']/total
    agg_df.columns = ['answer', 'value']
    return agg_df


def compute_data_for_question(q_index):
    df_q1 = compute_question_repartition(q_index)
    df_q1.to_csv('question{}.csv'.format(q_index))

    print '-- compute by age'
    df_q1_seg = compute_question_count_by_seg(q_index, 'Quel âge avez-vous ?', 'age')
    df_q1_seg.to_csv('question{}-age.csv'.format(q_index))

    print '-- compute by sexe'
    df_q1_seg = compute_question_count_by_seg(q_index, 'Vous êtes :', 'sexe')
    df_q1_seg.to_csv('question{}-sexe.csv'.format(q_index))

    print '-- compute by tendance'
    df_q1_seg = compute_question_count_by_seg(q_index, 'À quelle tendance politique vous identifiez-vous?', 'tendance')
    df_q1_seg.to_csv('question{}-tendance.csv'.format(q_index))

    print '-- compute by commune'
    df_q1_seg = compute_question_count_by_seg(q_index, 'Quelle est la taille de votre commune ?', 'taille_commune')
    df_q1_seg.to_csv('question{}-taille_commune.csv'.format(q_index))

    print '-- compute by revenu'
    df_q1_seg = compute_question_count_by_seg(q_index, 'Quelle est votre tranche de revenu annuel ?', 'revenu')
    df_q1_seg.to_csv('question{}-revenu.csv'.format(q_index))

def compute_question_aggregates(q_index):
    """
    Compute the repartition by segment categories for a given question
    """
    columns_to_keep = demo_cols + [question_columns[q_index]]
    df_q = df[columns_to_keep + ['count']]

    agg_df = df_q.groupby(columns_to_keep).sum().reset_index()
    agg_df = agg_df.rename(columns={
            'Quel âge avez-vous ?': 'age',
            'Quelle est votre profession ?': 'profession',
            'Vous êtes :': 'sexe',
            'Quelle est votre tranche de revenu annuel ?': 'revenu',
            'Dans quel département habitez vous ?': 'departement',
            'Quelle est la taille de votre commune ?': 'taille_commune',
            'À quelle tendance politique vous identifiez-vous?': 'tendance',
            question_columns[q_index]: 'answer',
            'count': 'value'
        })
    return agg_df

### ALL QUESTIONS
# print 'length {}'.format(len(question_columns_without_segments))
# 18 QUESTIONS
# for i in range(15, 18):
#     print 'Compute data for question {}'.format(i)
#     compute_data_for_question(i)

# Repartition
# df = compute_question_aggregates(0)
# df.to_csv('q0-aggregate.csv')
for i in range(18):
    compute_data_for_question(i)
    print 'question', i
# df_q1 = compute_question_repartition(0)
# df_q1.to_csv('question0.csv')
#
# df_q1_seg = compute_question_count_by_seg(0, 'Quel âge avez-vous ?', 'age')
# df_q1_seg.to_csv('question0-age.csv')
#
# df_q1_seg = compute_question_count_by_seg(0, 'Vous êtes :', 'sexe')
# df_q1_seg.to_csv('question0-sexe.csv')
#
# df_q1_seg = compute_question_count_by_seg(0, 'À quelle tendance politique vous identifiez-vous?', 'tendance')
# df_q1_seg.to_csv('question0-tendance.csv')

# pd.melt(df, id_vars=['Timestamp'], value_vars=question_columns)
# pd.pivot_table(df, values='D', index=['A', 'B'], columns=['C'], aggfunc=np.sum)
print '-------------'
print 'End'
