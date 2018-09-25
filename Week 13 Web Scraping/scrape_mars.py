from splinter import Browser
from bs4 import BeautifulSoup as bs
import pandas as pd
import datetime as dt
import time
import pymongo

mars_dict = {}

def init_browser():
    executable_path = {"executable_path": "chromedriver"}
    return Browser("chrome", **executable_path, headless=False)

# I had a "scrape_all()" function initially, which had each scrape function separated and called individually, but 
# it wasn't liking that...  So, now, everything is crammed together."
def scrape():
    # This will only scrape the nasa.gov site for news titles and brief article intro P
    browser = init_browser()
    mars_dict = {}
    news_dict = {}
    
    mars_news_url = "https://mars.nasa.gov/news/"
    # takes a little time to migrate to the "extended" url, so I threw this sleep function in, dunno if necessary
    browser.visit(mars_news_url)
    time.sleep(3)
    
    mars_html = browser.html
    mars_soup = bs(mars_html, "html.parser")
    
    # Only need latest news, not all displayed articles on page
    news_title = mars_soup.find('div', class_='content_title').text
    news_p = mars_soup.find('div', class_='article_teaser_body').text

    news_dict['News_Title'] = news_title
    news_dict['News_Paragraph'] = news_p
    
    mars_dict['News_Title'] = news_title
    mars_dict['News_Paragraph'] = news_p
    
    # "def featured_image():"
    mars_image_url = "https://www.jpl.nasa.gov/spaceimages/?search=&category=Mars"
    browser.visit(mars_image_url)
    time.sleep(3)
    
    image_html = browser.html
    mars_image_soup = bs(image_html, "html.parser")

    # Find and click the full image button
    browser.click_link_by_partial_text('FULL IMAGE')
    time.sleep(3)
    # <img src="/spaceimages/images/mediumsize/PIA18185_ip.jpg" class="fancybox-image" style="display: inline;">
    # featured_image_extension = mars_image_soup.find("img", class_="fancybox-image")["src"]
    # This was spitting out a Nonetype error..................................
    browser.click_link_by_partial_text('more info')
    time.sleep(3)
    
    try:
        image_article_page = mars_image_soup.find('article')
        featured_image_extension = image_article_page.find('figure', 'lede').a['href']
        # Use the base url to create an absolute url
        base_url = "https://www.jpl.nasa.gov"
   

        # return img_url
        featured_image_url = base_url + featured_image_extension
        print(featured_image_url)
    except AttributeError:
        featured_image_url = 'https://www.jpl.nasa.gov/spaceimages/images/largesize/PIA16225_hires.jpg'
        print(featured_image_url)
    # This is also giving a nonetype error.............  Giving up.  Throwing it into a try, except: using default image url from hw page.
    mars_dict["Featured_Image_URL"] = featured_image_url
    
    # "def twitter_weather():"
    weather_url = "https://twitter.com/marswxreport?lang=en"
    browser.visit(weather_url)
    time.sleep(3)
    weather_html = browser.html
    weather_soup = bs(weather_html, "html.parser")
    
    # <span class="username u-dir u-textTruncate" dir="ltr" data-aria-label-part="">@<b>MarsWxReport</b></span>
    # <b>MarsWxReport</b>
    # <p class="TweetTextSize TweetTextSize--normal js-tweet-text tweet-text" lang="en" data-aria-label-part="0">Sol 2171 (2018-09-14), high -12C/10F, low -65C/-84F, pressure at 8.79 hPa, daylight 05:43-17:59</p>
    mars_weather = weather_soup.find("p", class_="TweetTextSize TweetTextSize--normal js-tweet-text tweet-text").text
    # This doesn't work...  Because some dude named Tony ruined the string of posts from @MarsWxReport
    print(mars_weather)
    mars_dict["Mars_Weather_Tweet"] = mars_weather
    
    # "def scrape_hemisphere():"
    hemisphere_url = "https://astrogeology.usgs.gov/search/results?q=hemisphere+enhanced&k1=target&v1=Mars"
    browser.visit(hemisphere_url)
    time.sleep(3)
    #hemisphere_html = browser.html
    #hemisphere_soup = bs(hemisphere_html, 'html.parser')
    mars_hemisphere_data=[]
    
    for i in range (4):
        time.sleep(5)
        images = browser.find_by_tag('h3')
        images[i].click()
        html = browser.html
        soup = bs(html, 'html.parser')
        hemi_specific = soup.find("img", class_="wide-image")["src"]
        img_title = soup.find("h2",class_="title").text
        img_url = 'https://astrogeology.usgs.gov'+ hemi_specific
        hemi_dict={"title":img_title,"img_url":img_url}
        mars_hemisphere_data.append(hemi_dict)
        browser.back()
    print(mars_hemisphere_data)
    mars_dict["Hemisphere_Data_and_URLs"] = mars_hemisphere_data
    
    # "def mars_facts()"
    mars_facts_url = "https://space-facts.com/mars/"
    browser.visit(mars_facts_url)
    time.sleep(3)
    #facts_html = browser.html
    #facts_soup = bs(facts_html, "html.parser")
    table = pd.read_html(mars_facts_url)
    mars_facts_df = table[0]
    mars_facts_df.columns = ["Parameter", "Value"]
    mars_facts_df.set_index(["Parameter"])
    facts_html_table = mars_facts_df.to_html()
    facts_html_table = facts_html_table.replace("\n", "")
    # print(mars_facts_df)
    mars_dict["Facts_Table"] = facts_html_table
    
    return mars_dict