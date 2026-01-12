def validate_seating(seating, rooms):
    for room in rooms:
        if len(seating[room["room_no"]]) > room["capacity"]:
            return False
    return True
