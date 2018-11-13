-- This is a reference on how to shrink the database. --

--use this to drop duplicate records (variables will need to be changed)--
--https://stackoverflow.com/questions/8190541/deleting-duplicate-rows-from-sqlite-database--
delete   from YourTable
where    rowid not in
         (
         select  min(rowid)
         from    YourTable
         group by
                 hash
         ,       d
         )

--drop tables  --
--foreign keys must be turned off--

PRAGMA foreign_keys = OFF;
 
DROP TABLE addresses;


-- now to shrink the db --
vacuum;


		 

