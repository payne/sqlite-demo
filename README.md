# Sqlite Demo

```
% sqlite3 tasks-2024-12-28.db
SQLite version 3.37.2 2022-01-06 13:25:41
Enter ".help" for usage hints.
sqlite> .schema
CREATE TABLE tasks (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        completed BOOLEAN DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
CREATE TABLE sqlite_sequence(name,seq);
sqlite> select * from tasks;                                                                                            1|task 1|0|2024-12-28 14:36:21
2|task 2|0|2024-12-28 14:36:26
3|3rd task|0|2024-12-28 14:44:59
sqlite>
```

### References
1. The YouTube [Sql.js - full SQLite in the browser by Jeffrey Codes](https://youtu.be/0DZ472GiVNw?si=7rjap0TNowAgEc9z) is very helpful :-)

