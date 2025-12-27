when stats is waiting
{
    id: string,
    participants: [id, id, id, id]
    stats: waiting
}

when stats is going or done
going = current  match is currently played
done = current match is finish
{
  "id": "5fd22a27-69bd-4a51-a42f-d8182d3ad02e",
  "state": "going",
  "rounds": [
    {
      "id": "aedcce6d-04fc-42cc-84ba-d6dd6ea33072",
      "state": "done",
      "matches": [
        {
          "id": "d25cb1e8-c2a3-4867-a0be-f7e59864fe22",
          "state": "done",
          "winner": "4dde638786982b1551796ece358d3c95",
          "leftPlayer": {
            "id": "4dde638786982b1551796ece358d3c95",
            "username": "omghazi",
            "points": 7,
            "avatar": "https://lh3.googleusercontent.com/a/ACg8ocIeJ44jX2Dndq4BA8VP0c_FX4KPyfGcUMAeglPhI0Wedg06dZA=s96-c"
          },
          "rightPlayer": {
            "id": "5e0e4a8ae51308de3cdf11ba9f5a81b2",
            "username": "ezahiri",
            "points": 2,
            "avatar": "https://lh3.googleusercontent.com/a/ACg8ocKKN-3G7dLMUnBY2xV3CahLG8vvF4Ka9m-XfZqOOCy_P-8Y=s96-c"
          }
        },
        {
          "id": "017670d9-e727-455a-90c6-1537407baf43",
          "state": "done",
          "winner": "8e20beaf5f95c92d9582685f4d6771d8",
          "leftPlayer": {
            "id": "4c8aa2636221d8ae31d0c9acadef2541",
            "username": "ALAFDILI",
            "points": 1,
            "avatar": null
          },
          "rightPlayer": {
            "id": "8e20beaf5f95c92d9582685f4d6771d8",
            "username": "bramzill",
            "points": 7,
            "avatar": "https://lh3.googleusercontent.com/a/ACg8ocLcV-iNaedp9qGd9Dv_p0mhH1aaxvUN7NFwo9pTsalD9nnbZQ=s96-c"
          }
        }
      ]
    },
    {
      "id": "ae0e9655-0731-4824-a327-c9f2c8d33df6",
      "state": "going",
      "matches": [
        {
          "id": "2c3e638c-ca12-4387-8410-bc84e33ff332",
          "state": "waiting"
        }
      ]
    }
  ]
}
