%matplotlib notebook
from matplotlib import style
style.use('fivethirtyeight')
import matplotlib.pyplot as plt

import numpy as np
import pandas as pd

import datetime as dt

# Reflect Tables into SQLAlchemy ORM

# Python SQL toolkit and Object Relational Mapper
import sqlalchemy
from sqlalchemy.ext.automap import automap_base
from sqlalchemy.orm import Session
from sqlalchemy import create_engine, func, inspect

engine = create_engine("sqlite:///Resources/hawaii.sqlite")

# reflect an existing database into a new model
Base = automap_base()
# reflect the tables
Base.prepare(engine, reflect=True)

# We can view all of the classes that automap found
Base.classes.keys()

# Save references to each table
Measurement = Base.classes.measurement
Station = Base.classes.station

# Create our session (link) from Python to the DB
session = Session(engine)

inspector = inspect(engine)
m_columns = inspector.get_columns('Measurement')
for c in m_columns:
    print (c['name'])

s_columns = inspector.get_columns('Station')
for c in s_columns:
    print (c['name'])

engine.execute('SELECT * FROM Measurement LIMIT 10').fetchall()

engine.execute('SELECT * FROM Station LIMIT 10').fetchall()

# Exploratory Climate Analysis

# Design a query to retrieve the last 12 months from 08-23-2017 of precipitation data and plot the results

# Calculate the date 1 year ago from today

# Perform a query to retrieve the data and precipitation scores

# Save the query results as a Pandas DataFrame and set the index to the date column

# Sort the dataframe by date

# Use Pandas Plotting with Matplotlib to plot the data

# Rotate the xticks for the dates


august_date = dt.date(2017, 8, 23)
print(august_date)

# Assign a variable with last-year's date (from 8.23.17)
year_ago_august = august_date - dt.timedelta(days=365)
print(year_ago_august)

year_to_date = dt.datetime.now() - dt.timedelta(days=365)
print(year_to_date)

# Query our precipitation data to retrieve 12-months-worth of prcp data from 8/2017
prcp_query_august = session.query(Measurement.date, Measurement.prcp).filter(Measurement.date <= august_date, Measurement.date \
                                                                      >= year_ago_august).order_by(Measurement.date).all()

prcp_query_today = session.query(Measurement.date, Measurement.prcp).filter(Measurement.date <= august_date, Measurement.date \
                                                                      >= year_ago_august).order_by(Measurement.date).all()

prcp_query_august_df = pd.DataFrame(prcp_query_august).dropna()
prcp_query_august_df.head()

# Plot the data
prcp_query_august_df.plot('date', 'prcp')
plt.xlabel('Date')
plt.ylabel('Precipitation (Inches)')
plt.title('Precipitation from 8.23.16 to 8.23.17')
plt.legend(['Precipitation'])
# Rotate the xticks for the dates
plt.xticks(rotation=45)
plt.tight_layout()
plt.show()

# Use Pandas to calcualte the summary statistics for the precipitation data
prcp_query_august_df.describe()

# How many stations are available in this dataset?
stations = session.query(Measurement).group_by(Measurement.station).count()
print(f'There are {stations} stations')

# What are the most active stations?
most_active_stations = session.query(Measurement.station, func.count(Measurement.tobs)).group_by(Measurement.station).\
order_by(func.count(Measurement.tobs).desc()).all()
print(f'{most_active_stations[0][0]} is the most active station')

# List the stations and the counts in descending order.
station_activity_order = session.query(Measurement.station, func.count(Measurement.tobs)).group_by(Measurement.station).\
order_by(func.count(Measurement.tobs).desc())
for statn in station_activity_order:
    print(statn)

# Using the station id from the previous query, calculate the lowest temperature recorded, 
# highest temperature recorded, and average temperature most active station?
busiest_station = most_active_stations[0][0]

lowest_temp_most_active = session.query(Measurement.station, Measurement.tobs).filter\
(Measurement.station==busiest_station).order_by((Measurement.tobs).asc())

#average_temp_most_active = session.query(func.avg(Measurement.tobs)).filter(Measurement.station==busiest_station)
average_temp_most_active = session.query(func.avg(Measurement.tobs)).filter(Measurement.station==busiest_station, Measurement.station==Station.station).all()

highest_temp_most_active = session.query(Measurement.station, Measurement.tobs).filter\
(Measurement.station==busiest_station).order_by((Measurement.tobs).desc())

print(f'The lowest temperature observed at the busiest station, {busiest_station}, was {lowest_temp_most_active[0][1]}')
print(f'The average temperature for {busiest_station} was {average_temp_most_active[0][0]}')
print(f'The highest temperature observed at the busiest station, {busiest_station}, was {highest_temp_most_active[0][1]}')

# Choose the station with the highest number of temperature observations.
# Query the last 12 months of temperature observation data for this station and plot the results as a histogram
high_temperatures = session.query(Measurement.date, Measurement.tobs).\
filter(Measurement.date >= year_ago_august, Measurement.station == busiest_station).order_by(Measurement.date).all()
temperatures_df = pd.DataFrame(high_temperatures).set_index('date')
temperatures_df.head()

temperatures_df.plot.hist(bins=12, color="blue")
plt.title(f'Station {busiest_station} Temperatures')
plt.ylabel('Temperature Counts')
plt.show()

# Write a function called `calc_temps` that will accept start date and end date in the format '%Y-%m-%d' 
# and return the minimum, average, and maximum temperatures for that range of dates
def calc_temps(start_date, end_date):
    """TMIN, TAVG, and TMAX for a list of dates.
    
    Args:
        start_date (string): A date string in the format %Y-%m-%d
        end_date (string): A date string in the format %Y-%m-%d
        
    Returns:
        TMIN, TAVE, and TMAX
    """
    
    return session.query(func.min(Measurement.tobs), func.avg(Measurement.tobs), func.max(Measurement.tobs)).\
        filter(Measurement.date >= start_date).filter(Measurement.date <= end_date).all()
print(calc_temps('2012-02-28', '2012-03-05'))

# Use your previous function `calc_temps` to calculate the tmin, tavg, and tmax 
# for your trip using the previous year's data for those same dates.
previous_year = dt.timedelta(days=365)
trip_start = dt.date(2018, 3, 21)
trip_end = dt.date(2018, 3, 27)

calc_temps((trip_start-previous_year), (trip_end-previous_year))

min_temp = calc_temps((trip_start-previous_year), (trip_end-previous_year))[0][0]
avg_temp = calc_temps((trip_start-previous_year), (trip_end-previous_year))[0][1]
max_temp = calc_temps((trip_start-previous_year), (trip_end-previous_year))[0][2]

# Plot the results from your previous query as a bar chart.
# Use "Trip Avg Temp" as your Title
# Use the average temperature for the y value
# Use the peak-to-peak (tmax-tmin) value as the y error bar (yerr)

#plt.figure(figsize=(1,5))
plt.title("Trip Avg Temp")
plt.bar(1, avg_temp, yerr=(max_temp-min_temp), tick_label="")


# Calculate the rainfall per weather station for your trip dates using the previous year's matching dates.
# Sort this in descending order by precipitation amount and list the station, name, latitude, longitude, and elevation
queries = [Measurement.station, Station.name, Station.latitude, Station.longitude, Station.elevation, Measurement.date, Measurement.prcp]
rain_data = session.query(*queries).join(Station, Station.station==Measurement.station).\
    filter(Measurement.date >= (trip_start-previous_year)).filter(Measurement.date <= (trip_end-previous_year)).\
    order_by((Measurement.prcp).desc()).all()

rain_df = pd.DataFrame(rain_data).dropna()
rain_df

## Optional Challenge Assignment

# Create a query that will calculate the daily normals 
# (i.e. the averages for tmin, tmax, and tavg for all historic data matching a specific month and day)

def daily_normals(date):
    """Daily Normals.
    
    Args:
        date (str): A date string in the format '%m-%d'
        
    Returns:
        A list of tuples containing the daily normals, tmin, tavg, and tmax
    
    """
    
    sel = [func.min(Measurement.tobs), func.avg(Measurement.tobs), func.max(Measurement.tobs)]
    return session.query(*sel).filter(func.strftime("%m-%d", Measurement.date) == date).all()
    
daily_normals("01-01")

# calculate the daily normals for your trip
# push each tuple of calculations into a list called `normals`

# Set the start and end date of the trip

# Use the start and end date to create a range of dates

# Stip off the year and save a list of %m-%d strings

# Loop through the list of %m-%d strings and calculate the normals for each date


# Load the previous query results into a Pandas DataFrame and add the `trip_dates` range as the `date` index


# Plot the daily normals as an area plot with `stacked=False`