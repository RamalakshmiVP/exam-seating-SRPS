def generate_seating(students, rooms):
    seating = {}
    idx = 0

    for room in rooms:
        seating[room["room_no"]] = students[idx:idx + room["capacity"]]
        idx += room["capacity"]

    return seating
