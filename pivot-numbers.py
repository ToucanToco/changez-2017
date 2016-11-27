# -*- coding: utf8 -*-
# from __future__ import unicode_literals
# import fs
import sys
import os
import pandas as pd

FILENAME = 'change2017_full-extract_clean.csv'

print 'Start'
print '-------------'
df = pd.read_csv(FILENAME, sep=',')
demo_cols = [
    'Quel âge avez-vous ?',
    'Quelle est votre profession ?',
    'Vous êtes :',
    'Quelle est votre tranche de revenu annuel ?',
    'Dans quel département habitez vous ?',
    'Quelle est la taille de votre commune ?',
    'À quelle tendance politique vous identifiez-vous?',
]

# question_columns = [col for col in df.columns if col != 'Timestamp' and col not in demo_cols]
question_columns = [col for col in df.columns if col != 'Timestamp']


df['count'] = 1
df = df.set_index('Timestamp')

### QUESTION 1
df_q1 = df[[question_columns[0], 'count']]
# import ipdb; ipdb.set_trace()

agg_df = df_q1.groupby(question_columns[0]).count().reset_index()
total = agg_df['count'].sum()

agg_df['count'] = 100 * agg_df['count']/total
agg_df.columns = ['answer', 'value']
agg_df.to_csv('question1.csv')

# pd.melt(df, id_vars=['Timestamp'], value_vars=question_columns)
# pd.pivot_table(df, values='D', index=['A', 'B'], columns=['C'], aggfunc=np.sum)
print '-------------'
print 'End'
#
# # DEFAULT SCRIPT ARG
# ## Arguments can be changed here or by overriding when running the script:
# ## `python email-comp.py --arg_name=newname`
# arguments = {
#     'new_separator': u',',
#     'old_separator': u',',
#     'new_email': u'email address',
#     'old_email': u'Person - Email',
#     'fileold': u'Base de données pipedrive.csv',
#     'filenew': u'Etudes Market 2 Emilie.csv',
# }
# # PARSE ARGUMENTS
# print 'Arguments:'
# for arg in sys.argv:
#     print arg
#     if '--' in arg:
#         params = arg.strip(u'--').split(u'=')
#         if len(params) == 2:
#             arguments[params[0]] = params[1]
# if not ('fileold' in arguments) or not ('filenew' in arguments):
#     print 'Missing parameter fileold and/or filenew'
# print arguments
# # OPEN FILES
# print '-------------\nRead csv files'
# new_df = pd.read_csv(arguments['filenew'], sep=arguments['new_separator'])
# old_df = pd.read_csv(arguments['fileold'], sep=arguments['old_separator'])
# # DROP DUPLICATES
# ## Separate multiple emails
# # s = pd.DataFrame(list(old_df[arguments['old_email']].str.split(',')))
# s = old_df[arguments['old_email']].str.split(',')
# # s = old_df[arguments['old_email']].split(',').apply(Series, 1).stack()
# import ipdb; ipdb.set_trace()
# s.index = s.index.droplevel(-1)
# s.name = arguments['old_email']
# del old_df[arguments['old_email']]
# old_df = old_df.join(s)
#
# new_df = new_df.drop_duplicates(subset=[arguments['new_email']])
# old_df = old_df.drop_duplicates(subset=[arguments['old_email']])
#
# print 'New DF:'
# print new_df.head()
# print 'Old DF:'
# print old_df.head()
# import ipdb;ipdb.set_trace()
#
# # COMPARE
# print '-------------\nComparing'
#
# new_df = new_df.set_index([arguments['new_email']])
# old_df = old_df.set_index([arguments['old_email']])
# new_index = new_df.index.difference(old_df.index)
# new_user_list_df = new_df.ix[new_index]
# intersect_user_list_df = new_df.merge(old_df, how='inner', right_index=True, left_index=True)
# # print new_user_list_df.head()
# print 'Diff user list shape :'
# print new_user_list_df.shape
# # print intersect_user_list_df.head()
# print 'Common user list shape :'
# print intersect_user_list_df.shape
# print intersect_user_list_df.index
# print '-------------\nOutput'
