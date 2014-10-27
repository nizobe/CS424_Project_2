'''
trip_id,starttime,startdate,stoptime,enddate,startDay,endDay
'''
from datetime import date, timedelta, datetime
from dateutil import relativedelta

dataStart = date(2013,6,27)
dataEnd = date(2013,12,31)

#function to generate list of days covered in the data
def date_range(start_date, end_date, increment, period):
	dates = []
	nxt = start_date
	delta = relativedelta.relativedelta(**{period:increment})
	while nxt <= end_date:
		dates.append(nxt)
		nxt += delta
	return dates
#date_list holds the dates, populate it with the above function
date_list = date_range(dataStart, dataEnd, 1, 'days')
#print date_list[0]

#count for num bikes out in a given hour
clock_0 = 0
clock_1 = 0
clock_2 = 0
clock_3 = 0
clock_4 = 0
clock_5 = 0
clock_6 = 0
clock_7 = 0
clock_8 = 0
clock_9 = 0
clock_10 = 0
clock_11 = 0
clock_12 = 0
clock_13 = 0
clock_14 = 0
clock_15 = 0
clock_16 = 0
clock_17 = 0
clock_18 = 0
clock_19 = 0
clock_20 = 0
clock_21 = 0
clock_22 = 0
clock_23 = 0

sunCount = 0
monCount = 0
tueCount = 0
wedCount = 0
thuCount = 0
friCount = 0
satCount = 0

#compute the number of bikes out for each day of the week
for r_index, row in enumerate(open("num_day_week_updated.csv", 'r')):
	segmentedLine = row.split(',')
	for c_index, cell in enumerate(segmentedLine):
		#print cell #prints each cell one line at a time
		if c_index == 5: #column for first 3 letters of start day
			if cell == "Sun":
				sunCount+=1
			elif cell == "Mon":
				monCount+=1
			elif cell == "Tue":
				tueCount+=1
			elif cell == "Wed":
				wedCount+=1
			elif cell == "Thu":
				thuCount+=1
			elif cell == "Fri":
				friCount+=1
			elif cell == "Sat":
				satCount+=1
#print out the results of the above tally
print "Sunday Count:" , sunCount
print "Monday Count:" , monCount
print "Tuesday Count:" , tueCount
print "Wednesday Count:" , wedCount
print "Thursday Count:" , thuCount
print "Friday Count:" , friCount
print "Saturday Count:" , satCount