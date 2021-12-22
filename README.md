# Fetch Points Coding Exercise

- Link to deployed API https://dashboard.heroku.com/apps/fetch-points-coding-exercise/deploy/github

or
- Download repository and run it locally on port 5000


# Endpoints


## Get Requests

`get /api`

Response:
```
[
    {
        "transaction_id": 1,
        "payer": "DANNON",
        "points": 1000,
        "timestamp": "2020-11-02T14:00:00Z"
    },
    {
        "transaction_id": 2,
        "payer": "UNILEVER",
        "points": 200,
        "timestamp": "2020-10-31T11:00:00Z"
    },
    {
        "transaction_id": 3,
        "payer": "DANNON",
        "points": -200,
        "timestamp": "2020-10-31T15:00:00Z"
    },
    {
        "transaction_id": 4,
        "payer": "MILLER COORS",
        "points": 10000,
        "timestamp": "2020-11-01T14:00:00Z"
    },
    {
        "transaction_id": 5,
        "payer": "DANNON",
        "points": 300,
        "timestamp": "2020-10-31T10:00:00Z"
    }
]
```

`get /api/balances`

Response:

```
{
    "DANNON": 1100,
    "UNILEVER": 200,
    "MILLER COORS": 5300
}

```

`get /reset`

```
this will reset the database to it's inital seed data
```

## Post Requests

`post /api/transaction`

Expected Body:
- note: the timestamp is optional, however the timestamp will default to the current date-time if left omitted

```
{
    "payer": "DANNON",
    "points": 300,
    "timestamp": "2020-11-02T14:00:00Z"
}
```

Response:

```
{
    "transaction_id": 6,
    "payer": "DANNON",
    "points": 300,
    "timestamp": "2020-11-02T14:00:00Z"
}
```

`post api/spendPoints`

Expected Body:

```
{
    "points": -5000
}
```

Response:

```
[
    { "payer": "DANNON", "points": -100 },
    { "payer": "UNILEVER", "points": -200 },
    { "payer": "MILLER COORS", "points": -4,700 }
]
```
