USE sakila;
# 1a Display first and last names of actors from the actor table
SELECT first_name, last_name FROM actor;

# 1b Actor Name
SELECT CONCAT(first_name, " ", last_Name) AS "Actor Name"
FROM actor;

# 2a Who's Joe and what's his info?
SELECT actor_id, first_name, last_name FROM actor
WHERE first_name LIKE "Joe";

# 2b Last name contains GEN
SELECT first_name, last_name FROM actor
WHERE last_name LIKE "%GEN%";

# 2c Last name contains "LI", last_name then first_name
SELECT last_name, first_name FROM actor
WHERE last_name LIKE "%LI%";

# 2d use IN to display country_id and country for Afghanistan, Bangladesh, China
SELECT country_id, country FROM country
WHERE country IN ('Afghanistan', 'Bangladesh', 'China');

# 3a use dtype BLOB for a new description column in the actor table
ALTER TABLE actor
ADD COLUMN description blob;

# 3b now, delete the description column...alter
ALTER TABLE actor
DROP COLUMN description;

# 4a List the last_name of actors, and number of actors with that last_name
SELECT last_name, COUNT(last_name) AS 'Actor Count'
FROM actor
GROUP BY last_name;

# 4b List last_name of actors and number of actors with that last_name, only if frequency is >= 2
SELECT last_name, COUNT(last_name) AS 'Actor Count'
FROM actor
GROUP BY last_name HAVING COUNT(last_name) >= 2;

# 4c HARPO = GROUCHO, fix this
UPDATE actor
SET first_name = 'HARPO'
WHERE first_name = 'GROUCHO' AND last_name = 'WILLIAMS';

# 4d Wrong.  Change HARPO back to GROUCHO...
UPDATE actor
SET first_name = 'GROUCHO'
WHERE first_name = 'HARPO' AND last_name = 'WILLIAMS';

# 5a Can't find address, how to re-create it?...  Is this it?...
SHOW CREATE TABLE address;
# 'CREATE TABLE `address` (\n  `address_id` smallint(5) unsigned NOT NULL AUTO_INCREMENT,\n  `address` varchar(50) NOT NULL,\n  `address2` varchar(50) DEFAULT NULL,\n  `district` varchar(20) NOT NULL,\n  `city_id` smallint(5) unsigned NOT NULL,\n  `postal_code` varchar(10) DEFAULT NULL,\n  `phone` varchar(20) NOT NULL,\n  `location` geometry NOT NULL,\n  `last_update` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,\n  PRIMARY KEY (`address_id`),\n  KEY `idx_fk_city_id` (`city_id`),\n  SPATIAL KEY `idx_location` (`location`),\n  CONSTRAINT `fk_address_city` FOREIGN KEY (`city_id`) REFERENCES `city` (`city_id`) ON UPDATE CASCADE\n) ENGINE=InnoDB AUTO_INCREMENT=606 DEFAULT CHARSET=utf8'

# 6a Use JOIN to join first_, last_name columns, as well as the address for each staff member, join staff with address
SELECT s.first_name, s.last_name, a.address
FROM staff AS s
JOIN address AS a
ON (s.address_id = a.address_id);

# 6b Use JOIN to display total sales in August 2005 by each staff member by payment
# payment_date in format yyyy-mm-dd
SELECT s.first_name, s.last_name, p.staff_id, SUM(amount) AS Staff_Sales FROM staff AS s
JOIN payment AS p
ON (s.staff_id = p.staff_id) AND p.payment_date LIKE '2005-08%'
GROUP BY p.staff_id;

# 6c List each film and the number of actors listed for that film, inner join film_actor and film
SELECT f.title, COUNT(fa.actor_id) AS Num_Actors
FROM film AS f
INNER JOIN film_actor fa
ON f.film_id = fa.film_id
GROUP BY f.film_id;

# 6d How many copies of Hunchback Impossible are in the inventory system?... wtf movie is that...
SELECT f.title, COUNT(i.inventory_id) AS "Hunchbacks in Inventory"
FROM film f
JOIN inventory i
ON f.film_id = i.film_id
WHERE title = "Hunchback Impossible";

# 6e with payment and customer tables, join to find total paid by each customer, list customers AB-ly in last_name
SELECT c.last_name, c.first_name, SUM(p.amount) AS 'Total Paid'
FROM customer c
JOIN payment p
ON c.customer_id = p.customer_id
GROUP BY p.customer_id
ORDER BY last_name, first_name;

# 7a Display all English-language movie titles starting with K and Q 
SELECT title FROM film
WHERE language_id IN
	(SELECT language_id FROM language
    WHERE name = "English")
AND (title LIKE "K%") OR (title LIKE "Q%");

# 7b What actors are in Alone Trip?
SELECT first_name, last_name FROM actor
WHERE actor_id IN
	(SELECT actor_id FROM film_actor
    WHERE film_id IN
		(SELECT film_id FROM film
        WHERE title = "Alone Trip")
	)
ORDER BY last_name, first_name;

# 7c Use joins to diplay the names and emails of all Canadian customers
SELECT cs.first_name, cs.last_name, cs.email, co.country 
FROM customer cs
JOIN address a
ON cs.address_id = a.address_id
JOIN city ct
ON ct.city_id = a.city_id
JOIN country co
ON co.country_id = ct.country_id
WHERE country = "Canada";

# 7d Identify movies categorized as family
SELECT title FROM film
WHERE film_id IN (
	SELECT film_id FROM film_category
    WHERE category_id IN (
		SELECT category_id FROM category
        WHERE name = "Family")
        )
ORDER BY title;

# 7e Display most frequently rented movies in descending order
SELECT f.title, COUNT(r.rental_id) AS 'Rental Count'
FROM film f
JOIN inventory i
ON f.film_id = i.film_id
JOIN rental r
ON r.inventory_id = i.inventory_id
GROUP BY f.title
ORDER BY COUNT(r.rental_id) DESC;

# 7f Display how much money each store brought in
SELECT s.store_id, SUM(amount) as 'Sales'
FROM store s
JOIN staff st
ON s.store_id = st.store_id
JOIN payment p
ON st.staff_id = p.staff_id
GROUP BY s.store_id;

# 7g Display store IDs, cities, and countries for each store
SELECT s.store_id, ct.city, c.country
FROM store AS s
JOIN address AS a
ON a.address_id = s.address_id
JOIN city ct
ON ct.city_id = a.city_id
JOIN country AS c
ON c.country_id = ct.country_id;

# 7h List top five genres by gross revenue from lo to hi
SELECT c.name, SUM(amount) as 'Revenue' 
FROM category c
JOIN film_category f ON c.category_id = f.category_id
JOIN inventory i ON i.film_id = f.film_id
JOIN rental r ON r.inventory_id = i.inventory_id
JOIN payment p ON p.rental_id = r.rental_id
GROUP BY c.name ORDER BY amount DESC LIMIT 5;

# 8a Use 7h and "create view" to create view...............
CREATE VIEW top_five_genres AS 
SELECT c.name, SUM(amount) as 'Revenue' 
FROM category c
JOIN film_category f ON c.category_id = f.category_id
JOIN inventory i ON i.film_id = f.film_id
JOIN rental r ON r.inventory_id = i.inventory_id
JOIN payment p ON p.rental_id = r.rental_id
GROUP BY c.name ORDER BY amount DESC LIMIT 5;

# 8b How would you display the views created in 8a?
SELECT * FROM top_five_genres;

# 8c Don't need it anymore.  Delete the view.
DROP VIEW top_five_genres;