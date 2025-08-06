const grades =[
  {
    "_id": "G1",
    "user": "123",
    "assignment": "A101",
    "grade": 87
  },
  {
    "_id": "G2",
    "user": "123",
    "assignment": "A102",
    "grade": 80
  },
  {
    "_id": "G3",
    "user": "123",
    "assignment": "A103",
    "grade": 95
  },
  {
    "_id": "G4",
    "user": "234",
    "assignment": "A101",
    "grade": 100
  },
  {
    "_id": "G5",
    "user": "234",
    "assignment": "A102",
    "grade": 64
  },
  {
    "_id": "G6",
    "user": "234",
    "assignment": "A103",
    "grade": 98
  },
  {
    "_id": "G7",
    "user": "345",
    "assignment": "A101",
    "grade": 62
  },
  {
    "_id": "G8",
    "user": "345",
    "assignment": "A102",
    "grade": 66
  },
  {
    "_id": "G9",
    "user": "345",
    "assignment": "A103",
    "grade": 79
  },
  {
    "_id": "G10",
    "user": "456",
    "assignment": "A101",
    "grade": 70
  },
  {
    "_id": "G11",
    "user": "456",
    "assignment": "A102",
    "grade": 60
  },
  {
    "_id": "G12",
    "user": "456",
    "assignment": "A103",
    "grade": 77
  },
  {
    "_id": "G13",
    "user": "567",
    "assignment": "A101",
    "grade": 80
  },
  {
    "_id": "G14",
    "user": "567",
    "assignment": "A102",
    "grade": 77
  },
  {
    "_id": "G15",
    "user": "567",
    "assignment": "A103",
    "grade": 69
  },
  {
    "_id": "G16",
    "user": "789",
    "assignment": "A201",
    "grade": 92
  },
  {
    "_id": "G17",
    "user": "789",
    "assignment": "A202",
    "grade": 74
  },
  {
    "_id": "G18",
    "user": "789",
    "assignment": "A203",
    "grade": 99
  },
  {
    "_id": "G19",
    "user": "890",
    "assignment": "A201",
    "grade": 88
  },
  {
    "_id": "G20",
    "user": "890",
    "assignment": "A202",
    "grade": 77
  },
  {
    "_id": "G21",
    "user": "890",
    "assignment": "A203",
    "grade": 87
  },
  {
    "_id": "G22",
    "user": "777",
    "assignment": "A301",
    "grade": 83
  },
  {
    "_id": "G23",
    "user": "777",
    "assignment": "A302",
    "grade": 97
  },
  {
    "_id": "G24",
    "user": "777",
    "assignment": "A303",
    "grade": 90
  },
  {
    "_id": "G25",
    "user": "901",
    "assignment": "A301",
    "grade": 68
  },
  {
    "_id": "G26",
    "user": "901",
    "assignment": "A302",
    "grade": 81
  },
  {
    "_id": "G27",
    "user": "901",
    "assignment": "A303",
    "grade": 81
  },
  {
    "_id": "G28",
    "user": "902",
    "assignment": "A301",
    "grade": 95
  },
  {
    "_id": "G29",
    "user": "902",
    "assignment": "A302",
    "grade": 85
  },
  {
    "_id": "G30",
    "user": "902",
    "assignment": "A303",
    "grade": 76
  },
  {
    "_id": "G31",
    "user": "903",
    "assignment": "A401",
    "grade": 100
  },
  {
    "_id": "G32",
    "user": "903",
    "assignment": "A402",
    "grade": 86
  },
  {
    "_id": "G33",
    "user": "903",
    "assignment": "A403",
    "grade": 90
  },
  {
    "_id": "G34",
    "user": "904",
    "assignment": "A401",
    "grade": 79
  },
  {
    "_id": "G35",
    "user": "904",
    "assignment": "A402",
    "grade": 81
  },
  {
    "_id": "G36",
    "user": "904",
    "assignment": "A403",
    "grade": 78
  },
  {
    "_id": "G37",
    "user": "905",
    "assignment": "A401",
    "grade": 81
  },
  {
    "_id": "G38",
    "user": "905",
    "assignment": "A402",
    "grade": 82
  },
  {
    "_id": "G39",
    "user": "905",
    "assignment": "A403",
    "grade": 65
  },
  {
    "_id": "G40",
    "user": "906",
    "assignment": "A501",
    "grade": 100
  },
  {
    "_id": "G41",
    "user": "906",
    "assignment": "A502",
    "grade": 83
  },
  {
    "_id": "G42",
    "user": "906",
    "assignment": "A503",
    "grade": 96
  },
  {
    "_id": "G43",
    "user": "907",
    "assignment": "A501",
    "grade": 96
  },
  {
    "_id": "G44",
    "user": "907",
    "assignment": "A502",
    "grade": 61
  },
  {
    "_id": "G45",
    "user": "907",
    "assignment": "A503",
    "grade": 77
  },
  {
    "_id": "G46",
    "user": "908",
    "assignment": "A501",
    "grade": 65
  },
  {
    "_id": "G47",
    "user": "908",
    "assignment": "A502",
    "grade": 99
  },
  {
    "_id": "G48",
    "user": "908",
    "assignment": "A503",
    "grade": 93
  },
  {
    "_id": "G49",
    "user": "909",
    "assignment": "A601",
    "grade": 72
  },
  {
    "_id": "G50",
    "user": "909",
    "assignment": "A602",
    "grade": 89
  },
  {
    "_id": "G51",
    "user": "909",
    "assignment": "A603",
    "grade": 66
  },
  {
    "_id": "G52",
    "user": "910",
    "assignment": "A601",
    "grade": 63
  },
  {
    "_id": "G53",
    "user": "910",
    "assignment": "A602",
    "grade": 86
  },
  {
    "_id": "G54",
    "user": "910",
    "assignment": "A603",
    "grade": 68
  },
  {
    "_id": "G55",
    "user": "911",
    "assignment": "A601",
    "grade": 92
  },
  {
    "_id": "G56",
    "user": "911",
    "assignment": "A602",
    "grade": 87
  },
  {
    "_id": "G57",
    "user": "911",
    "assignment": "A603",
    "grade": 60
  },
  {
    "_id": "G58",
    "user": "912",
    "assignment": "A701",
    "grade": 62
  },
  {
    "_id": "G59",
    "user": "912",
    "assignment": "A702",
    "grade": 65
  },
  {
    "_id": "G60",
    "user": "912",
    "assignment": "A703",
    "grade": 62
  },
  {
    "_id": "G61",
    "user": "913",
    "assignment": "A701",
    "grade": 73
  },
  {
    "_id": "G62",
    "user": "913",
    "assignment": "A702",
    "grade": 89
  },
  {
    "_id": "G63",
    "user": "913",
    "assignment": "A703",
    "grade": 87
  },
  {
    "_id": "G64",
    "user": "914",
    "assignment": "A701",
    "grade": 92
  },
  {
    "_id": "G65",
    "user": "914",
    "assignment": "A702",
    "grade": 99
  },
  {
    "_id": "G66",
    "user": "914",
    "assignment": "A703",
    "grade": 72
  },
  {
    "_id": "G67",
    "user": "915",
    "assignment": "A801",
    "grade": 84
  },
  {
    "_id": "G68",
    "user": "915",
    "assignment": "A802",
    "grade": 85
  },
  {
    "_id": "G69",
    "user": "915",
    "assignment": "A803",
    "grade": 62
  },
  {
    "_id": "G70",
    "user": "678",
    "assignment": "A801",
    "grade": 85
  },
  {
    "_id": "G71",
    "user": "678",
    "assignment": "A802",
    "grade": 98
  },
  {
    "_id": "G72",
    "user": "678",
    "assignment": "A803",
    "grade": 72
  },
  {
    "_id": "G73",
    "user": "904",
    "assignment": "A801",
    "grade": 68
  },
  {
    "_id": "G74",
    "user": "904",
    "assignment": "A802",
    "grade": 93
  },
  {
    "_id": "G75",
    "user": "904",
    "assignment": "A803",
    "grade": 99
  }
] 
export default grades