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

#turn the above list into keys for a dictionary with all values set to zero
date_dict = dict((day,0) for day in date_list)

#just checking type of contents; spoiler: it's datetime.date
'''
print date_dict[date_list[0]]
print type(date_list[0])
'''

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

'''
last populated row with useful data = 759789 --> 759788 useful rows
so because of zero-index, 759788 = last index of useful data
'''

#compute the number of bikes out for each day of the week
for r_index, row in enumerate(open("num_day_week_updated.csv", 'r')):
	if r_index == 759789:
		break
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
		if c_index == 2 and r_index != 0: #column for start date formatted M(M)/D(D)/YYYY and skipping header row
			csvDatePieces = cell.split('/')
			#print csvDatePieces[0]
			#a datetime.date object to hold the split up slash date, to be used in dictionary
			parsedDate = date(int(csvDatePieces[2]), int(csvDatePieces[0]), int(csvDatePieces[1]))
			if date_dict.has_key(parsedDate):
				date_dict[parsedDate] = date_dict[parsedDate] + 1

'''
just testing out some dates and counts.
everything works as it should
you can access a date_dict by making a date object by hand like this:
print date_dict[date(2013,6,28)]
or by using one of the dates from date_list, which are in order
(date_dict keys (dates) are not guaranteed to be in any particular order)
print date_dict[date_list[0]]
both of these print out date object in YYYY-MM-DD format
print date_list[0]
print parsedDate
'''

#print out the results of the above tally
print "Sunday Count:" , sunCount
print "Monday Count:" , monCount
print "Tuesday Count:" , tueCount
print "Wednesday Count:" , wedCount
print "Thursday Count:" , thuCount
print "Friday Count:" , friCount
print "Saturday Count:" , satCount